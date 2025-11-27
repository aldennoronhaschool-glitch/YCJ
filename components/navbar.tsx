"use client";

import Link from "next/link";
import { useUser, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

interface ContactSettings {
  telephone: string;
  display_telephone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
}

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    telephone: "+91 (80) 6753 7777",
    display_telephone: "xxxxxxx",
    email: "info@ycjchurch.org",
    address_line1: "CSI Christa Jyothi Church",
    address_line2: "Bima Nagar, Bailoor, Udupi",
    address_line3: "Karnataka 576101",
  });

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

  // Fetch contact settings
  useEffect(() => {
    async function fetchContactSettings() {
      try {
        const response = await fetch('/api/admin/contact');
        if (response.ok) {
          const data = await response.json();
          setContactSettings({
            telephone: data.telephone || "+91 (80) 6753 7777",
            display_telephone: data.display_telephone || "xxxxxxx",
            email: data.email || "info@ycjchurch.org",
            address_line1: data.address_line1 || "CSI Christa Jyothi Church",
            address_line2: data.address_line2 || "Bima Nagar, Bailoor, Udupi",
            address_line3: data.address_line3 || "Karnataka 576101",
          });
        }
      } catch (error) {
        console.error("Failed to fetch contact settings", error);
      }
    }

    fetchContactSettings();
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ABOUT US", href: "/about" },
    { name: "MINISTRIES", href: "/ministries" },
    { name: "RESOURCES", href: "/resources" },
    { name: "VIDEOS", href: "/videos" },
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
          <Logo size={scrolled ? 100 : 120} showText={false} />
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
                        {/* Email - First */}
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Email:</p>
                          <a
                            href={`mailto:${contactSettings.email}`}
                            className="text-gray-700 hover:text-bethel-red transition-colors"
                          >
                            {contactSettings.email}
                          </a>
                        </div>

                        {/* Location/Address - Second */}
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Location:</p>
                          <p className="text-gray-700 leading-relaxed">
                            {contactSettings.address_line1}
                            {contactSettings.address_line2 && (
                              <>
                                <br />
                                {contactSettings.address_line2}
                              </>
                            )}
                            {contactSettings.address_line3 && (
                              <>
                                <br />
                                {contactSettings.address_line3}
                              </>
                            )}
                          </p>
                        </div>

                        {/* Phone - Third (only if not masked) */}
                        {contactSettings.display_telephone && contactSettings.display_telephone !== 'xxxxxxx' && (
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Phone:</p>
                            <a
                              href={`tel:${contactSettings.telephone.replace(/[^0-9+]/g, '')}`}
                              className="text-gray-700 hover:text-bethel-red transition-colors"
                            >
                              {contactSettings.display_telephone}
                            </a>
                          </div>
                        )}

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

