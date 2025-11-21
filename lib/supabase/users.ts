import { createClient } from "./server";
import { currentUser } from "@clerk/nextjs/server";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export async function getUserRole(userId: string): Promise<"user" | "admin" | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    // If user doesn't exist (PGRST116), create them with default role
    if (error.code === "PGRST116" || error.message?.includes("No rows") || error.message?.includes("not found")) {
      console.log(`User ${userId} not found in database, creating with default role...`);
      try {
        // Try to get email from Clerk
        let email = "";
        try {
          const clerkUser = await currentUser();
          email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";
        } catch (clerkError) {
          console.log("Could not fetch email from Clerk, using placeholder");
        }

        // Create user with default role
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({ id: userId, email: email || `user_${userId}@placeholder.com`, role: "user" })
          .select()
          .single();
        
        if (createError) {
          console.error("Error creating user:", {
            code: createError.code,
            message: createError.message,
            details: createError.details,
          });
          return "user"; // Default to user role
        }
        
        console.log(`Created user ${userId} with default role`);
        return "user";
      } catch (createError: any) {
        console.error("Error creating user:", createError);
        return "user"; // Default to user role
      }
    }
    
    console.error("Error fetching user role:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return "user"; // Default to user role instead of null
  }

  return data?.role || "user";
}

export async function setUserRole(userId: string, role: "user" | "admin") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .upsert({ id: userId, role }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createOrUpdateUser(userId: string, email: string, role: "user" | "admin" = "user") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .upsert({ id: userId, email, role }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

