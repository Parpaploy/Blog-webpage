"use client";

import "../../app/globals.css";
import React, { useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Image as ImageIcon,
} from "lucide-react";
import { Toggle } from "../ui/toggle";

export default function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url && editor) {
          editor.chain().focus().setImage({ src: base64Url }).run();
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const Options = [
    {
      icon: <Heading1 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },

    { icon: <ImageIcon />, onClick: addImage, pressed: false },
  ];

  return (
    <div className="rounded-4xl p-1 mb-1 bg-white/10 backdrop-blur-sm border border-white/30 shadow-md space-x-2 z-50 text-white/90">
      {Options.map((option, i) => (
        <Toggle
          key={i}
          pressed={option.pressed}
          onPressedChange={option.onClick}
          className={`p-2 rounded-full transition-all cursor-pointer text-white/50
        ${
          option.pressed
            ? "bg-white/10 backdrop-blur-sm border border-white/30 shadow-md data-[state=on]:bg-white/10 data-[state=on]:text-white"
            : "bg-transparent hover:bg-white/20 hover:text-white/80"
        }`}
        >
          {option.icon}
        </Toggle>
      ))}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
