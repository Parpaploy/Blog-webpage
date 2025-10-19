import { NodeViewWrapper } from "@tiptap/react";
import React, { useRef, useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Square,
  Columns,
  Image as ImageIcon,
  X,
  Move,
  GripVertical,
} from "lucide-react";

export const ImageResizer = (props: any) => {
  const { node, updateAttributes, deleteNode, getPos, editor } = props;
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const layout = node.attrs.layout || "inline";
  const width = node.attrs.width || 300;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsClicked(false);
        setShowMenu(false);
      }
    };

    if (isClicked || showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isClicked, showMenu]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isClicked;
    setIsClicked(newState);
    setShowMenu(newState);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(100, Math.min(startWidth + diff, 1000));
      updateAttributes({ width: newWidth });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setShowMenu(false);
    setIsClicked(false);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", node.attrs.src);

    if (imgRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }
      e.dataTransfer.setDragImage(canvas, 100, 75);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const setLayout = (newLayout: string) => {
    updateAttributes({ layout: newLayout });
  };

  const getWrapperStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: "relative",
      maxWidth: "100%",
      clear: layout === "center" ? "both" : "none",
    };

    switch (layout) {
      case "inline":
        return {
          ...baseStyle,
          display: "inline-block",
          verticalAlign: "top",
          margin: "4px 8px",
        };
      case "left":
        return {
          ...baseStyle,
          float: "left",
          marginRight: "16px",
          marginBottom: "8px",
          marginTop: "4px",
        };
      case "right":
        return {
          ...baseStyle,
          float: "right",
          marginLeft: "16px",
          marginBottom: "8px",
          marginTop: "4px",
        };
      case "center":
        return {
          ...baseStyle,
          display: "block",
          margin: "4px auto 8px auto",
          width: "fit-content",
        };
      case "square":
        return {
          ...baseStyle,
          float: "left",
          marginRight: "12px",
          marginBottom: "8px",
          marginTop: "4px",
          width: `${width}px`,
        };
      case "behind":
        return {
          ...baseStyle,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.2,
          zIndex: 0,
          pointerEvents: "none",
        };
      default:
        return baseStyle;
    }
  };

  const layoutOptions = [
    { type: "inline", icon: <ImageIcon size={16} />, label: "In Line" },
    { type: "left", icon: <AlignLeft size={16} />, label: "Wrap Left" },
    { type: "center", icon: <AlignCenter size={16} />, label: "Center" },
    { type: "right", icon: <AlignRight size={16} />, label: "Wrap Right" },
    { type: "square", icon: <Square size={16} />, label: "Square Wrap" },
    // { type: "behind", icon: <Columns size={16} />, label: "Behind Text" },
  ];

  return (
    <NodeViewWrapper
      as="span"
      className="image-wrapper group"
      style={getWrapperStyle()}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-drag-handle
    >
      <span
        ref={wrapperRef}
        className="relative inline-block"
        onMouseEnter={() => !isClicked && setShowMenu(true)}
        onMouseLeave={() =>
          !isClicked && !isResizing && !isDragging && setShowMenu(false)
        }
      >
        {(showMenu || isClicked) && layout !== "behind" && (
          <span
            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white/90 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/30 shadow-md rounded cursor-move transition-colors"
            title="ลากเพื่อย้ายตำแหน่ง"
          >
            <GripVertical size={16} />
          </span>
        )}

        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          onClick={handleImageClick}
          className={`rounded-lg block transition-all cursor-pointer ${
            isResizing || isDragging
              ? "outline-2 outline-white/60 opacity-80"
              : isClicked
              ? "outline-2 outline-white/80"
              : "group-hover:outline-2 group-hover:outline-white/60"
          }`}
          style={{
            width: `${width}px`,
            height: "auto",
            maxWidth: "100%",
            userSelect: "none",
            display: "block",
          }}
          draggable={false}
        />

        {showMenu && layout !== "behind" && !isDragging && (
          <span
            className="absolute -top-12 left-0 rounded-full p-1 flex gap-1 z-[9999] text-white/60 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseEnter={() => setShowMenu(true)}
          >
            {layoutOptions.map((option) => (
              <button
                key={option.type}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLayout(option.type);
                }}
                className={`p-2 rounded-full hover:border-white/30 hover:backdrop-blur-sm hover:shadow-md hover:bg-white/30 transition-colors ${
                  layout === option.type
                    ? "text-white/90 bg-white/30 border border-white/30 backdrop-blur-sm shadow-md"
                    : "text-white/60 hover:text-white/90 cursor-pointer"
                }`}
                title={option.label}
              >
                {option.icon}
              </button>
            ))}
            <span className="w-px bg-white/30 mx-0.5" />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteNode();
              }}
              className="p-2 cursor-pointer rounded-full hover:border-white/30 text-white/60 hover:text-white/90 hover:backdrop-blur-sm hover:shadow-md hover:bg-white/30 transition-colors"
              title="Delete"
            >
              <X size={16} />
            </button>
          </span>
        )}

        {layout !== "behind" && !isDragging && (
          <span
            className={`absolute bottom-0 right-0 w-6 h-6 bg-white border-2 border-white/80 rounded-full cursor-nwse-resize shadow-lg flex items-center justify-center ${
              isResizing
                ? "opacity-100 scale-110"
                : "opacity-0 group-hover:opacity-100"
            } transition-all`}
            onMouseDown={handleMouseDown}
            style={{ transform: "translate(50%, 50%)" }}
          >
            <span className="w-2 h-2 border-r-2 border-b-2 border-gray-600 inline-block" />
          </span>
        )}

        {isDragging && (
          <span className="absolute inset-0 bg-white/10 rounded-lg border-2 border-white/40 border-dashed" />
        )}
      </span>
    </NodeViewWrapper>
  );
};
