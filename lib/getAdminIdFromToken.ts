import Cookies from "js-cookie";

export function getAdminIdFromToken(): string | null {
  const token = Cookies.get("masala-admin-token");
  if (!token) return null;
  try {
    // JWT: header.payload.signature
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.adminId || null;
  } catch {
    return null;
  }
}
