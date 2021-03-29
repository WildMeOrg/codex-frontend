import React from 'react';
import {
  darken,
  lighten,
} from '@material-ui/core/styles/colorManipulator';

export default function OneIndividualIcon({ color, ...rest }) {
  const darkColor = darken(color, 0.3);
  const lightColor = lighten(color, 0.3);

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g filter="url(#filter0_d)">
        <circle
          cx="80.5"
          cy="80.5"
          r="55.5"
          fill="url(#paint0_radial)"
        />
      </g>
      <g filter="url(#filter0_d)">
        <circle cx="81" cy="81" r="12" fill="white" />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="21"
          y="25"
          width="119"
          height="119"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(80.5 80.5) rotate(90) scale(55.5)"
        >
          <stop stopColor={lightColor} />
          <stop offset="1" stopColor={darkColor} />
        </radialGradient>
      </defs>
    </svg>
  );
}
