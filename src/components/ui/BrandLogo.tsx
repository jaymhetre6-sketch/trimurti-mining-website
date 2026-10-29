import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  light?: boolean;
  isAdmin?: boolean;
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  light = true,
  isAdmin = false,
  className = '',
  showSubtitle = true,
}) => {
  return (
    <Link to={isAdmin ? '/admin' : '/'} className={`group flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Mountain / Mining Peak Icon */}
      <div className="relative w-8 h-8 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 50 46"
          aria-hidden="true"
          className="w-full h-full fill-none"
        >
          {/* Outer Triangle Profile in Brand Orange */}
          <path
            d="M3 41 25 3l22 38H34l-9-16-9 16H3Z"
            className="fill-[#FF6B18] transition-colors duration-300 group-hover:fill-[#FF8238]"
          />
          {/* Inner Mountain Ridge in Steel Slate */}
          <path
            d="m16 41 9-16 9 16"
            className="stroke-[#B9C0C9] stroke-[2.5] stroke-linecap-round stroke-linejoin-round"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-base tracking-widest text-[#F5F5F2] uppercase font-sans">
          TRIMURTI
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-semibold tracking-[0.22em] text-[#B9C0C9] uppercase mt-0.5 group-hover:text-[#FF6B18] transition-colors">
            {isAdmin ? 'ADMINISTRATION' : 'MINING & INFRASTRUCTURE'}
          </span>
        )}
      </div>
    </Link>
  );
};
