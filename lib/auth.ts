import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export async function Login(
  prevState: { message: string },
  formData: FormData
) {
  try {
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      return { message: "Email and password are required" };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
      { identifier: email, password }
    );

    Cookies.set("token", response.data.jwt);
    // return { message: "Login Ok!" };
  } catch (error: unknown) {
    console.log(error, ":error");

    let errorMessage = "Login failed";

    if (axios.isAxiosError(error)) {
      errorMessage =
        (error.response?.data?.error?.message as string) ||
        (error.response?.data?.message as string) ||
        error.message ||
        "Login failed";
    }

    return { message: errorMessage };
  }

  redirect("/subscribe-blogs");
}
