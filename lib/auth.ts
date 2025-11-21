import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserRole } from "./supabase/users";

export async function isAdmin() {
  try {
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
    } catch (error) {
      console.error("Auth error in isAdmin:", error);
      return false;
    }
    
    if (!userId) {
      return false;
    }

    const role = await getUserRole(userId);
    return role === "admin";
  } catch (error) {
    console.error("Error in isAdmin:", error);
    return false;
  }
}

export async function getCurrentUserRole() {
  try {
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId || null;
    } catch (error) {
      console.error("Auth error in getCurrentUserRole:", error);
      return null;
    }
    
    if (!userId) {
      return null;
    }

    return await getUserRole(userId);
  } catch (error) {
    console.error("Error in getCurrentUserRole:", error);
    return null;
  }
}

