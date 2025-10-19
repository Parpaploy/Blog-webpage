import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageResizer } from "./image-resizer";

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
        default: 300,
      },
      layout: {
        default: "inline",
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResizer);
  },
});
