"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { IRichTextEditorProps } from "../../../interfaces/props.interface";

export default function RichTextEditor({
  content,
  onChange,
  token,
}: {
  content: IRichTextEditorProps;
  onChange: (content: any) => void;
  token: string | undefined;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-3" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-3" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "min-h-100 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md rounded-3xl focus:ring-2 focus:ring-white/30 focus:outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="w-full">
      <MenuBar token={token} editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
