import React from "react";
import ProfileMenu from "./profile-menu";
import { Logout } from "../../../../lib/auth";

function ProfilePanel({
  toggle,
  setToggle,
}: {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}) {
  return (
    <>
      {toggle && (
        <div className="absolute top-12 right-5 w-60 h-fit bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg rounded-lg overflow-hidden">
          <ProfileMenu
            path="/profile"
            title="จัดการโปรไฟล์ของคุณ"
            setToggle={setToggle}
          />
          <ProfileMenu
            path="/your-blogs"
            title="บล็อกทั้งหมดของคุณ"
            setToggle={setToggle}
          />

          <div
            onClick={() => {
              Logout();
              setToggle(false);
            }}
            className="text-white/80 text-md cursor-pointer hover:bg-white/30 transition-all hover:text-white/90 px-3 py-2"
          >
            ออกจากระบบ
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePanel;
