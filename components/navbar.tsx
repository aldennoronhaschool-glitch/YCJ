"use client";

import Link from "next/link";
import { useUser, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user?.id) return;

      try {
        // We need to fetch the role from our public API or use a server action
        // For client-side, we'll use a direct Supabase query if we have the client available
        // Or better, we can check the user's metadata if we synced it

        // For now, let's fetch from our API endpoint to be safe and secure
        const response = await fetch('/api/user/role');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.role === 'admin');
        }
      } catch (error) {
        console.error("Failed to check admin status", error);
      }
    }

    if (isSignedIn) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn, user]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ABOUT US", href: "/about" },
    { name: "MINISTRIES", href: "/ministries" },
    { name: "RESOURCES", href: "/resources" },
    { name: "GIVE", href: "/give" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 font-montserrat",
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo size={scrolled ? 150 : 180} showText={false} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            // Special handling for Contact link with dropdown
            if (link.name === "CONTACT") {
              return (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className="text-[13px] font-bold text-gray-900 hover:text-bethel-red transition-colors uppercase tracking-[0.15em]"
                  >
                    {link.name}
                  </Link>

                  {/* Dropdown on Hover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white shadow-xl rounded-lg p-6 w-80 border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Contact Information</h3>

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Phone</p>
                          <a href="tel:+918067537777" className="text-bethel-red hover:underline font-medium">
                            +91 (80) 6753 7777
                          </a>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs mb-1">Email</p>
                          <a href="mailto:info@ycjchurch.org" className="text-bethel-red hover:underline font-medium">
                            info@ycjchurch.org
                          </a>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs mb-1">Address</p>
                          <p className="text-gray-700 leading-relaxed">
                            CSI Christa Jyothi Church<br />
                            Bima Nagar, Bailoor, Udupi<br />
                            Karnataka 576101
                          </p>
                        </div>

                        <div className="pt-3 border-t">
                          <Link
                            href="/contact"
                            className="text-bethel-red hover:text-red-700 font-bold text-xs uppercase tracking-wide"
                          >
                            View Full Contact Page →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Regular links
            return (
              <Link
                key={link.name}
                href={link.href}
                className="text-[13px] font-bold text-gray-900 hover:text-bethel-red transition-colors uppercase tracking-[0.15em]"
              >
                {link.name}
              </Link>
            );
          })}

          {isSignedIn && isAdmin && (
            <Link
              href="/admin"
              className="text-[13px] font-bold text-gray-900 hover:text-bethel-red transition-colors uppercase tracking-[0.15em]"
            >
              ADMIN
            </Link>
          )}

          {/* Auth Button */}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button className="bg-bethel-red hover:bg-[#b93f1f] text-white font-bold uppercase tracking-wider text-xs h-8 px-4">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[13px] font-bold text-gray-900 hover:text-bethel-red transition-colors uppercase tracking-[0.15em]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isSignedIn && isAdmin && (
              <Link
                href="/admin"
                className="text-[13px] font-bold text-gray-900 hover:text-bethel-red transition-colors uppercase tracking-[0.15em]"
                onClick={() => setMobileMenuOpen(false)}
              >
                ADMIN
              </Link>
            )}

            {isSignedIn ? (
              <div className="pt-2 border-t mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{user?.emailAddresses[0]?.emailAddress}</span>
                  <SignOutButton>
                    <Button variant="outline" size="sm">Sign Out</Button>
                  </SignOutButton>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t mt-2">
                <SignInButton mode="modal">
                  <Button className="w-full bg-bethel-red hover:bg-[#b93f1f] text-white font-bold uppercase tracking-wider">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

