import React from 'react';
import { FrameShape, ProductColor } from '../../types';

interface EyewearArtworkProps {
  shape: FrameShape;
  color?: ProductColor;
  isOptical?: boolean;
  className?: string;
  isDetailedView?: boolean;
  customImageUrl?: string;
  alt?: string;
}

export const EyewearArtwork: React.FC<EyewearArtworkProps> = ({
  shape,
  color,
  isOptical = true,
  className = 'w-full h-full',
  isDetailedView = false,
  customImageUrl,
  alt = 'RAMA OPTICS handcrafted frame',
}) => {
  const [imageFailed, setImageFailed] = React.useState(false);

  // If a valid custom image exists and hasn't failed, render it with safe fallback
  if (customImageUrl && !imageFailed) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-[#F7F6F2] ${className}`}>
        <img
          src={customImageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-contain p-6 transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  // Derive frame metal/acetate colors based on selected color or fallback gold
  const frameHex = color?.hex || '#C6A15B';
  const isGoldTone =
    frameHex.toLowerCase().includes('c6a15b') ||
    frameHex.toLowerCase().includes('d4af37') ||
    frameHex.toLowerCase().includes('gold');
  const isDarkTone =
    frameHex.toLowerCase().includes('1c1c1e') ||
    frameHex.toLowerCase().includes('000000') ||
    frameHex.toLowerCase().includes('111111') ||
    frameHex.toLowerCase().includes('black') ||
    frameHex.toLowerCase().includes('navy');

  const strokeColor = frameHex;
  const highlightStroke = isDarkTone ? '#4B5563' : isGoldTone ? '#F5E6BE' : '#E2E8F0';
  const lensFill = isOptical
    ? 'url(#opticalLensGrad)'
    : isGoldTone
    ? 'url(#sunglassGoldGrad)'
    : isDarkTone
    ? 'url(#sunglassDarkGrad)'
    : 'url(#sunglassGradient)';

  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden bg-gradient-to-b from-[#FAF9F5] to-[#F2EFE8] ${className}`}
    >
      {/* Background ambient lighting vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.9),transparent_75%)] pointer-events-none" />

      {/* SVG Canvas for High-Precision Eyewear CAD */}
      <svg
        viewBox="0 0 500 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[90%] max-w-[90%] drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="opticalLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id="sunglassDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E232A" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#111417" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#0B0D0F" stopOpacity="0.82" />
          </linearGradient>

          <linearGradient id="sunglassGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2E2010" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#784A1A" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="sunglassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.92" />
            <stop offset="50%" stopColor="#334155" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#64748B" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="frameSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={strokeColor} />
            <stop offset="50%" stopColor={highlightStroke} />
            <stop offset="100%" stopColor={strokeColor} />
          </linearGradient>

          {/* Lens reflection gleam */}
          <linearGradient id="lensReflect" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Shadow on ground */}
        <ellipse cx="250" cy="215" rx="170" ry="10" fill="rgba(0,0,0,0.06)" filter="blur(6px)" />
        <ellipse cx="250" cy="214" rx="120" ry="5" fill="rgba(0,0,0,0.04)" filter="blur(3px)" />

        {/* Temples (Arms extending back) */}
        <path
          d="M 68 110 Q 50 100 35 90 Q 25 82 22 74"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 432 110 Q 450 100 465 90 Q 475 82 478 74"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Acetate temple tips */}
        <path d="M 35 90 Q 25 82 22 74" stroke={frameHex} strokeWidth="5.5" strokeLinecap="round" opacity="0.9" />
        <path d="M 465 90 Q 475 82 478 74" stroke={frameHex} strokeWidth="5.5" strokeLinecap="round" opacity="0.9" />

        {/* Shape Specific Lenses and Rim Profiles */}
        {shape === 'Round' && (
          <g>
            {/* Left Lens */}
            <circle cx="155" cy="120" r="62" fill={lensFill} />
            <circle cx="155" cy="120" r="62" stroke="url(#frameSheen)" strokeWidth="4.5" />
            {/* Left Reflection */}
            <path d="M 120 75 Q 155 65 185 85 L 180 92 Q 155 76 122 83 Z" fill="url(#lensReflect)" />

            {/* Right Lens */}
            <circle cx="345" cy="120" r="62" fill={lensFill} />
            <circle cx="345" cy="120" r="62" stroke="url(#frameSheen)" strokeWidth="4.5" />
            {/* Right Reflection */}
            <path d="M 310 75 Q 345 65 375 85 L 370 92 Q 345 76 312 83 Z" fill="url(#lensReflect)" />

            {/* Bridge */}
            <path d="M 217 114 Q 250 104 283 114" stroke="url(#frameSheen)" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {shape === 'Aviator' && (
          <g>
            {/* Left Tear Drop Lens */}
            <path
              d="M 100 95 C 100 78, 190 74, 210 90 C 220 120, 205 168, 160 170 C 115 170, 95 130, 100 95 Z"
              fill={lensFill}
            />
            <path
              d="M 100 95 C 100 78, 190 74, 210 90 C 220 120, 205 168, 160 170 C 115 170, 95 130, 100 95 Z"
              stroke="url(#frameSheen)"
              strokeWidth="4"
            />
            {/* Left Reflection */}
            <path d="M 115 86 Q 165 78 195 90 L 190 98 Q 165 86 118 94 Z" fill="url(#lensReflect)" />

            {/* Right Tear Drop Lens */}
            <path
              d="M 400 95 C 400 78, 310 74, 290 90 C 280 120, 295 168, 340 170 C 385 170, 405 130, 400 95 Z"
              fill={lensFill}
            />
            <path
              d="M 400 95 C 400 78, 310 74, 290 90 C 280 120, 295 168, 340 170 C 385 170, 405 130, 400 95 Z"
              stroke="url(#frameSheen)"
              strokeWidth="4"
            />
            {/* Right Reflection */}
            <path d="M 385 86 Q 335 78 305 90 L 310 98 Q 335 86 382 94 Z" fill="url(#lensReflect)" />

            {/* Double Brow Bridge (Signature Aviator) */}
            <path d="M 185 80 L 315 80" stroke="url(#frameSheen)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 210 96 Q 250 90 290 96" stroke="url(#frameSheen)" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {shape === 'Square' && (
          <g>
            {/* Left Square Lens */}
            <rect x="95" y="68" width="124" height="104" rx="18" fill={lensFill} />
            <rect x="95" y="68" width="124" height="104" rx="18" stroke="url(#frameSheen)" strokeWidth="5" />
            <path d="M 108 80 L 205 80 L 198 88 L 112 88 Z" fill="url(#lensReflect)" />

            {/* Right Square Lens */}
            <rect x="281" y="68" width="124" height="104" rx="18" fill={lensFill} />
            <rect x="281" y="68" width="124" height="104" rx="18" stroke="url(#frameSheen)" strokeWidth="5" />
            <path d="M 294 80 L 391 80 L 384 88 L 298 88 Z" fill="url(#lensReflect)" />

            {/* Strong Horizontal Keyhole Bridge */}
            <path d="M 219 92 Q 250 85 281 92" stroke="url(#frameSheen)" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {shape === 'Cat Eye' && (
          <g>
            {/* Left Cat Eye */}
            <path
              d="M 85 85 C 92 60, 160 62, 214 82 C 220 120, 195 160, 150 162 C 105 160, 80 120, 85 85 Z"
              fill={lensFill}
            />
            <path
              d="M 85 85 C 92 60, 160 62, 214 82 C 220 120, 195 160, 150 162 C 105 160, 80 120, 85 85 Z"
              stroke="url(#frameSheen)"
              strokeWidth="5.5"
            />
            {/* Left Wing Accent */}
            <circle cx="88" cy="82" r="3" fill="#C6A15B" />

            {/* Right Cat Eye */}
            <path
              d="M 415 85 C 408 60, 340 62, 286 82 C 280 120, 305 160, 350 162 C 395 160, 420 120, 415 85 Z"
              fill={lensFill}
            />
            <path
              d="M 415 85 C 408 60, 340 62, 286 82 C 280 120, 305 160, 350 162 C 395 160, 420 120, 415 85 Z"
              stroke="url(#frameSheen)"
              strokeWidth="5.5"
            />
            {/* Right Wing Accent */}
            <circle cx="412" cy="82" r="3" fill="#C6A15B" />

            {/* Arched Feminine Bridge */}
            <path d="M 214 96 Q 250 82 286 96" stroke="url(#frameSheen)" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {shape === 'Geometric' && (
          <g>
            {/* Left Octagon */}
            <polygon
              points="120,68 185,68 218,92 218,140 185,168 120,168 92,140 92,92"
              fill={lensFill}
            />
            <polygon
              points="120,68 185,68 218,92 218,140 185,168 120,168 92,140 92,92"
              stroke="url(#frameSheen)"
              strokeWidth="4"
            />
            <path d="M 124 74 L 180 74 L 175 80 L 128 80 Z" fill="url(#lensReflect)" />

            {/* Right Octagon */}
            <polygon
              points="380,68 315,68 282,92 282,140 315,168 380,168 408,140 408,92"
              fill={lensFill}
            />
            <polygon
              points="380,68 315,68 282,92 282,140 315,168 380,168 408,140 408,92"
              stroke="url(#frameSheen)"
              strokeWidth="4"
            />
            <path d="M 376 74 L 320 74 L 325 80 L 372 80 Z" fill="url(#lensReflect)" />

            {/* Geometric Bridge */}
            <path d="M 218 100 L 250 94 L 282 100" stroke="url(#frameSheen)" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}

        {(shape === 'Rectangle' || shape === 'Oval') && (
          <g>
            {/* Left Oval/Rectangle */}
            <rect
              x="92"
              y="78"
              width="128"
              height="88"
              rx={shape === 'Oval' ? '44' : '14'}
              fill={lensFill}
            />
            <rect
              x="92"
              y="78"
              width="128"
              height="88"
              rx={shape === 'Oval' ? '44' : '14'}
              stroke="url(#frameSheen)"
              strokeWidth="4.5"
            />
            <path d="M 110 88 Q 155 82 195 88" stroke="url(#lensReflect)" strokeWidth="3" opacity="0.7" />

            {/* Right Oval/Rectangle */}
            <rect
              x="280"
              y="78"
              width="128"
              height="88"
              rx={shape === 'Oval' ? '44' : '14'}
              fill={lensFill}
            />
            <rect
              x="280"
              y="78"
              width="128"
              height="88"
              rx={shape === 'Oval' ? '44' : '14'}
              stroke="url(#frameSheen)"
              strokeWidth="4.5"
            />
            <path d="M 298 88 Q 345 82 385 88" stroke="url(#lensReflect)" strokeWidth="3" opacity="0.7" />

            {/* Bridge */}
            <path d="M 220 106 Q 250 96 280 106" stroke="url(#frameSheen)" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {/* Nose Pads with micro-mounts */}
        <ellipse cx="225" cy="132" rx="4" ry="9" fill="#F8FAFC" stroke={strokeColor} strokeWidth="1.5" />
        <ellipse cx="275" cy="132" rx="4" ry="9" fill="#F8FAFC" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M 223 125 L 219 122" stroke={strokeColor} strokeWidth="2" />
        <path d="M 277 125 L 281 122" stroke={strokeColor} strokeWidth="2" />

        {/* Hinge Joint Rivets */}
        <circle cx="88" cy="110" r="2.2" fill={isGoldTone ? '#D4AF37' : '#94A3B8'} />
        <circle cx="412" cy="110" r="2.2" fill={isGoldTone ? '#D4AF37' : '#94A3B8'} />

        {/* Luxury Brand Hallmark micro-engraving on temple if detailed view */}
        {isDetailedView && (
          <text
            x="36"
            y="98"
            fill="#C6A15B"
            fontSize="6"
            fontFamily="sans-serif"
            letterSpacing="0.8"
            opacity="0.8"
          >
            RAMA TITANIUM · HANDMADE IN JAPAN
          </text>
        )}
      </svg>

      {/* Discrete bottom corner material badge */}
      <div className="absolute bottom-2.5 right-3 text-[10px] tracking-widest uppercase font-medium text-stone-400 select-none">
        {shape}
      </div>
    </div>
  );
};
