"use client";

import React, { useState } from "react";

export default function ProfileUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <label htmlFor="profile" className="text-sm font-medium text-gray-600">
        Profile picture
      </label>

      <div className="relative w-28 h-28">
        <img
          src={
            preview || "https://via.placeholder.com/150/cccccc/ffffff?text=+"
          }
          alt="profile preview"
          className="w-28 h-28 object-cover rounded-full border border-gray-300 shadow-sm"
        />

        <input
          id="profile"
          type="file"
          name="profile"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="profile"
          className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer shadow"
        >
          Change
        </label>
      </div>
    </div>
  );
}
