"use client";

import React, { useState } from "react";
import { uploadProfilePicture } from "../../../lib/apis/profile-uploader";
import { useRouter } from "next/navigation";

export default function ProfileDefaultPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setFile(f);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadProfilePicture(file);

      router.refresh();

      alert("Upload success");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <img
        src={preview || "/placeholder.png"}
        className="w-28 h-28 rounded-full"
      />
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
