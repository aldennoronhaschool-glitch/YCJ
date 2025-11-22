import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 40, showText = true }: LogoProps) {
  // Calculate aspect ratio - logo is wider than tall due to text
  const aspectRatio = 1.2; // Logo is 20% wider
  const logoWidth = size * aspectRatio;
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* White Circle Background with Logo - adjusted for proper fit */}
      <div className="relative flex-shrink-0" style={{ width: logoWidth, height: size }}>
        <svg
          width={logoWidth}
          height={size}
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* White Circle Background - centered */}
          <circle cx="50" cy="50" r="48" fill="white" />
          
          {/* Red Location Pin on the left side - properly sized */}
          <path
            d="M20 40C20 33 24 28 29 28C34 28 38 33 38 40C38 47 29 68 29 68C29 68 20 47 20 40Z"
            fill="#DC2626"
          />
          
          {/* Black Church Outline inside the pin */}
          <g transform="translate(23, 45)">
            {/* Church building - main rectangle */}
            <rect
              x="2"
              y="6"
              width="9"
              height="12"
              fill="none"
              stroke="black"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Church roof/triangle top */}
            <path
              d="M2 6L6.5 1L11 6"
              fill="none"
              stroke="black"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            {/* Steeple with cross on top */}
            <line
              x1="6.5"
              y1="1"
              x2="6.5"
              y2="-2"
              stroke="black"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="-0.5"
              x2="8"
              y2="-0.5"
              stroke="black"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            {/* Door outline */}
            <rect
              x="5"
              y="15"
              width="3"
              height="3"
              fill="none"
              stroke="black"
              strokeWidth="0.8"
            />
          </g>
          
          {/* YCJ Text on the right - Bold, properly sized and positioned */}
          <text
            x="62"
            y="42"
            fontSize="24"
            fontWeight="bold"
            fill="black"
            fontFamily="Arial, sans-serif"
            letterSpacing="1.5"
          >
            YCJ
          </text>
          
          {/* CSI Christa Jyothi Church text below - smaller, properly positioned */}
          <text
            x="62"
            y="62"
            fontSize="8"
            fill="black"
            fontFamily="Arial, sans-serif"
          >
            CSI Christa Jyothi Church
          </text>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col ml-2">
          <span className="font-bold text-lg text-gray-900 leading-tight">YCJ</span>
          <span className="text-xs text-gray-600 leading-tight hidden md:block">CSI Christha Jyothi</span>
        </div>
      )}
    </div>
  );
}
