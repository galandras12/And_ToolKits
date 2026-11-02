import React from 'react';

interface AndWrenchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Custom WordPress Admin Logo for "And ToolKit":
 * An unmistakable classic open-jaw wrench (villáskulcs) holding a bold '&' (and sign).
 */
export const AndWrenchLogo: React.FC<AndWrenchLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const dimensions =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';

  return (
    <span
      role="img"
      aria-label="And ToolKit logó: & jel egy villáskulcsban"
      className={`inline-flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs shrink-0 select-none ${dimensions} ${className}`}
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[88%] h-[88%]"
      >
        {/* Classic Open-End Wrench Silhouette (Villáskulcs C-pofa + markolat) */}
        <path
          d="M34.8 14.2C36.3 18.4 35.3 23.2 32.0 26.5C28.9 29.6 24.4 30.6 20.3 29.3L11.8 37.8C10.2 39.4 7.6 39.4 6.0 37.8C4.4 36.2 4.4 33.6 6.0 32.0L14.5 23.5C13.2 19.4 14.2 14.9 17.3 11.8C20.6 8.5 25.4 7.5 29.6 9.0L24.8 13.8L25.6 17.8L29.6 18.6L34.8 14.2Z"
          fill="#1E40AF"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Handle grip slot */}
        <circle cx="9.2" cy="34.6" r="1.5" fill="#FFFFFF" />
        {/* Wrench Head Badge with '&' (And sign) */}
        <circle
          cx="23.5"
          cy="19.5"
          r="8.2"
          fill="#2563EB"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
        <text
          x="23.5"
          y="24.2"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="800"
          fontSize="14"
        >
          &amp;
        </text>
      </svg>
    </span>
  );
};
