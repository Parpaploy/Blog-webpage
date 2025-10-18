import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import React, { useRef, useState } from "react";
import { LuArrowDownRight } from "react-icons/lu";

const ResizableImageComponent = (props: any) => {
  const { node, updateAttributes } = props;
  const [isResizing, setIsResizing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    let aspectRatio = 1;
    if (imgRef.current) {
      aspectRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
    }

    const startX = e.clientX;
    const startWidth = node.attrs.width || imgRef.current?.offsetWidth || 200;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(100, Math.min(startWidth + diff, 1000));

      updateAttributes({
        width: newWidth,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const isSmall = node.attrs.width && node.attrs.width < 600;

  return (
    <NodeViewWrapper
      as="span"
      className="relative group"
      style={{
        display: isSmall ? "inline-block" : "block",
        float: isSmall ? "left" : "none",
        marginRight: isSmall ? "16px" : "0",
        marginBottom: isSmall ? "8px" : "16px",
        marginTop: isSmall ? "4px" : "16px",
        verticalAlign: "top",
        shapeOutside: isSmall ? "margin-box" : "none",
      }}
    >
      <div
        className={`rounded-xl ${
          isResizing
            ? "outline-2 outline-white/80"
            : "group-hover:outline-2 group-hover:outline-white/50"
        } transition-all`}
      >
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          className="rounded-xl block"
          style={{
            width: node.attrs.width ? `${node.attrs.width}px` : "auto",
            height: "auto",
            maxWidth: "100%",
          }}
        />
      </div>

      <div
        className={`absolute bottom-0 right-0 w-5 h-5 bg-white border-2 border-white/50 rounded-full cursor-nwse-resize shadow-lg ${
          isResizing
            ? "opacity-100 scale-110"
            : "opacity-0 group-hover:opacity-100"
        } transition-all`}
        onMouseDown={handleMouseDown}
        style={{ transform: "translate(50%, 50%)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs font-bold">
          <LuArrowDownRight />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Image.extend({
  name: "resizableImage",

  addOptions() {
    return {
      inline: true,
      allowBase64: true,
      HTMLAttributes: {},
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
