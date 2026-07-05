import { cookies } from "next/headers";

export const ADMIN_COOKIE = "tk_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "tourkit@2025";
}

/** Token stored in the cookie once logged in. Derived from the password so it invalidates if the password changes. */
export function adminToken(): string {
  return Buffer.from("tk:" + adminPassword()).toString("base64");
}

export function checkPassword(password: string): boolean {
  return typeof password === "string" && password.length > 0 && password === adminPassword();
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}
