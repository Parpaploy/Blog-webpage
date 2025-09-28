import React from "react";
import { Signup } from "../../../lib/auth";
import SignupDefaultPage from "./signup-default-page";

export default function SignupPage() {
  return <SignupDefaultPage Signup={Signup} />;
}
