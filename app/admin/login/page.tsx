"use client";

import { SignIn } from "@clerk/nextjs";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">✟</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignIn 
            routing="path"
            path="/admin/login"
            signUpUrl="/admin/login"
            afterSignInUrl="/admin"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
              },
            }}
          />
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Don't have admin access? Contact the administrator.</p>
        </div>
      </div>
    </div>
  );
}

