"use server";

import { auth } from "../server/api/auth";

import { cookies } from "next/headers";

export async function signIn(formData: FormData) {
  try {
    const username = formData.get("username") as string | null;
    const password = formData.get("password") as string | null;

    if (!username || !password) {
      throw new Error("Missing username or password");
    }

    const key = await auth.useKey("username", username.toLowerCase(), password);

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const sessionCookie = auth.createSessionCookie(session);
    cookies().set(sessionCookie);
    return "";
  } catch (error) {
    console.error(error);
    return "Invalid username or password";
  }
}

export async function plus(a: number, b: number) {
  return a + b;
}
