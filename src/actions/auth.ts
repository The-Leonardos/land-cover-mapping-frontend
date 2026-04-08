"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const password = formData.get("password");

  // Mock password check
  if (password === "admin123") {
    // Set mock JWT HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "mock_jwt_payload_12345", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  }

  return { success: false, error: "Invalid password" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}
