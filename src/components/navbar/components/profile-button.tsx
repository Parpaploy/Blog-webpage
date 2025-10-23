"use client";

import React from "react";
import { IUser } from "../../../../interfaces/strapi.interface";

const ProfileButton = React.forwardRef<
  HTMLDivElement,
  {
    handleToggleProfile: (e: React.MouseEvent) => void;
    defaultProfileUrl: string;
    handleImageError: (
      e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => void;
    isProfile: boolean;
    user: IUser | null;
  }
>(
  (
    {
      handleToggleProfile,
      defaultProfileUrl,
      handleImageError,
      isProfile,
      user,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onMouseDown={handleToggleProfile}
        className={`cursor-pointer md:w-10 md:h-10 w-8.5 h-8.5 rounded-full border ${
          isProfile ? "border-white/50" : "border-white/30"
        } shadow-md`}
      >
        <img
          className={`transition-all ease-in-out w-full h-full rounded-full overflow-hidden object-cover aspect-square opacity-80 ${
            isProfile ? "opacity-100" : "hover:opacity-90"
          }`}
          src={
            user?.profile?.formats?.small?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${user.profile.formats.small.url}`
              : defaultProfileUrl
          }
          onError={handleImageError}
          alt={(user?.username || "Guest") + " profile picture"}
        />
      </div>
    );
  }
);

ProfileButton.displayName = "ProfileButton";

export default ProfileButton;
