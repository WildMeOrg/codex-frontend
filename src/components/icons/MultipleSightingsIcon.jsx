import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  darken,
  lighten,
} from '@material-ui/core/styles/colorManipulator';

const paint1Id = `radial1-${uuid()}`;
const paint2Id = `radial2-${uuid()}`;
const paint3Id = `radial3-${uuid()}`;
const filterId = `shadow-${uuid()}`;

export default function MultipleIndividualsIcon({ color, ...rest }) {
  const darkColor = darken(color, 0.3);
  const lightColor = lighten(color, 0.3);

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g filter={`url(#${filterId})`}>
        <circle
          cx="43.5"
          cy="69.5"
          r="29.5"
          fill={`url(#${paint1Id})`}
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="104.5"
          cy="116.5"
          r="29.5"
          fill={`url(#${paint2Id})`}
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="117.5"
          cy="44.5"
          r="29.5"
          fill={`url(#${paint3Id})`}
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="39.6268"
          cy="55.7934"
          r="4.91667"
          transform="rotate(30 39.6268 55.7934)"
          fill="white"
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="29.7928"
          cy="72.8252"
          r="4.91667"
          transform="rotate(30 29.7928 72.8252)"
          fill="white"
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="56.658"
          cy="65.6264"
          r="4.91667"
          transform="rotate(30 56.658 65.6264)"
          fill="white"
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="46.825"
          cy="82.6587"
          r="4.91667"
          transform="rotate(30 46.825 82.6587)"
          fill="white"
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle cx="105" cy="117" r="5" fill="white" />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="111.931"
          cy="35.3314"
          r="4.91667"
          transform="rotate(-30 111.931 35.3314)"
          fill="white"
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="111.358"
          cy="54.0047"
          r="4.91667"
          transform="rotate(-30 111.358 54.0047)"
          fill="white"
        />
      </g>
      <g filter={`url(#${filterId})`}>
        <circle
          cx="127.079"
          cy="44.9276"
          r="4.91667"
          transform="rotate(-30 127.079 44.9276)"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="160"
          height="160"
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
          id={paint1Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(43.5 69.5) rotate(90) scale(29.5)"
        >
          <stop stopColor={lightColor} />
          <stop offset="1" stopColor={darkColor} />
        </radialGradient>
        <radialGradient
          id={paint2Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(104.5 116.5) rotate(90) scale(29.5)"
        >
          <stop stopColor={lightColor} />
          <stop offset="1" stopColor={darkColor} />
        </radialGradient>
        <radialGradient
          id={paint3Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(117.5 44.5) rotate(90) scale(29.5)"
        >
          <stop stopColor={lightColor} />
          <stop offset="1" stopColor={darkColor} />
        </radialGradient>
      </defs>
    </svg>
  );
}
