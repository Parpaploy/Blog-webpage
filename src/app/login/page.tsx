import React from "react";
import LoginDefaultPage from "./login-default-page";
import { Login } from "../../../lib/auth";

export default function LoginPage() {
  return <LoginDefaultPage Login={Login} />;
}
