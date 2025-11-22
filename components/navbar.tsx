"use client";

import Link from "next/link";
import { useUser, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Logo size={40} showText={false} />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/events" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Events
          </Link>
          <Link href="/gallery" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Gallery
          </Link>
          <Link href="/office-bearers" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Office Bearers
          </Link>
          <Link href="/register" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Register
          </Link>
          {isSignedIn && (
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Admin
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container px-4 py-4 space-y-4">
            <Link
              href="/events"
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/gallery"
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/office-bearers"
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Office Bearers
            </Link>
            <Link
              href="/register"
              className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
            {isSignedIn && (
              <Link
                href="/admin"
                className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-4">
              {isSignedIn ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{user.emailAddresses[0]?.emailAddress}</span>
                  <SignOutButton>
                    <Button variant="outline" size="sm">Sign Out</Button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button className="w-full">Sign In</Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

