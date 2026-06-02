import React from 'react';

export function UtmistLogo({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 300 240" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Brain Outline */}
      <path 
        d="M80.7 207.2C80.7 207.2 70.8 190.5 52.8 174.5C34.8 158.5 25.5 137.5 26.5 111.5C27.5 85.5 44.5 56.5 78.5 44.5C112.5 32.5 186.5 32.5 212.5 44.5C238.5 56.5 256.5 88.5 256.5 111.5C256.5 134.5 249.5 158.5 222.5 181.5C195.5 204.5 149.5 219.5 142.5 229.5" 
        stroke={color} 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Stem Tail */}
      <path 
        d="M142.5 229.5C138 236 128 238 128 238" 
        stroke={color} 
        strokeWidth="10" 
        strokeLinecap="round"
      />
      {/* Tail Node */}
      <circle cx="128" cy="238" r="8" fill="white" stroke={color} strokeWidth="6" />

      {/* Nodes (Circles) */}
      {/* Top Center Node */}
      <circle cx="142.5" cy="40.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Top Left Node */}
      <circle cx="80.5" cy="65.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Left Node */}
      <circle cx="48.5" cy="115.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Bottom Left Node */}
      <circle cx="68.5" cy="170.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Mid Left Center Node */}
      <circle cx="108.5" cy="120.5" r="7" fill={color} />
      {/* Center Node */}
      <circle cx="145.5" cy="125.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Mid Right Center Node */}
      <circle cx="188.5" cy="110.5" r="7" fill={color} />
      {/* Top Right Node */}
      <circle cx="218.5" cy="111.5" r="7" fill={color} />
      {/* Right Node */}
      <circle cx="242.5" cy="110.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Bottom Right Node */}
      <circle cx="218.5" cy="180.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Far Right Node */}
      <circle cx="242.5" cy="170.5" r="7" fill="white" stroke={color} strokeWidth="6" />
      {/* Stem Connection Node */}
      <circle cx="142.5" cy="200.5" r="7" fill={color} />

      {/* Connection Lines */}
      <line x1="80.5" y1="65.5" x2="142.5" y2="40.5" stroke={color} strokeWidth="4" />
      <line x1="80.5" y1="65.5" x2="48.5" y2="115.5" stroke={color} strokeWidth="4" />
      <line x1="48.5" y1="115.5" x2="108.5" y2="120.5" stroke={color} strokeWidth="4" />
      <line x1="48.5" y1="115.5" x2="68.5" y2="170.5" stroke={color} strokeWidth="4" />
      <line x1="80.5" y1="65.5" x2="108.5" y2="120.5" stroke={color} strokeWidth="4" />
      <line x1="142.5" y1="40.5" x2="108.5" y2="120.5" stroke={color} strokeWidth="4" />
      <line x1="142.5" y1="40.5" x2="145.5" y2="125.5" stroke={color} strokeWidth="4" />
      <line x1="108.5" y1="120.5" x2="145.5" y2="125.5" stroke={color} strokeWidth="4" />
      <line x1="68.5" y1="170.5" x2="145.5" y2="125.5" stroke={color} strokeWidth="4" />
      <line x1="68.5" y1="170.5" x2="142.5" y2="200.5" stroke={color} strokeWidth="4" />
      <line x1="145.5" y1="125.5" x2="142.5" y2="200.5" stroke={color} strokeWidth="4" />
      
      <line x1="142.5" y1="40.5" x2="188.5" y2="110.5" stroke={color} strokeWidth="4" />
      <line x1="145.5" y1="125.5" x2="188.5" y2="110.5" stroke={color} strokeWidth="4" />
      <line x1="188.5" y1="110.5" x2="218.5" y2="111.5" stroke={color} strokeWidth="4" />
      <line x1="218.5" y1="111.5" x2="242.5" y2="110.5" stroke={color} strokeWidth="4" />
      <line x1="218.5" y1="111.5" x2="218.5" y2="180.5" stroke={color} strokeWidth="4" />
      <line x1="242.5" y1="110.5" x2="242.5" y2="170.5" stroke={color} strokeWidth="4" />
      <line x1="218.5" y1="180.5" x2="242.5" y2="170.5" stroke={color} strokeWidth="4" />
      <line x1="218.5" y1="180.5" x2="142.5" y2="200.5" stroke={color} strokeWidth="4" />
      <line x1="188.5" y1="110.5" x2="218.5" y2="180.5" stroke={color} strokeWidth="4" />
    </svg>
  );
}

export function WataiLogo({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 300 240" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized Gold ribbon wave logo 'W / A / T' */}
      <path 
        d="M30 80 C60 180, 80 180, 110 110 C130 60, 140 60, 150 90 C160 120, 140 160, 120 160 C90 160, 100 100, 130 80 C160 60, 200 180, 230 180 C250 180, 270 120, 270 80" 
        stroke={color} 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
