import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 150, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/ycj-logo.png"
        alt="YCJ - CSI Christa Jyothi Church"
        width={showText ? size * 6 : size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
}
