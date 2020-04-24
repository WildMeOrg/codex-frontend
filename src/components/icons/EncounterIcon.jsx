import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function EncounterIcon({ ...porpoises }) {
  return (
    <SvgIcon {...porpoises}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" fill="white" />
        <circle cx="11.5" cy="11.5" r="3.5" fill="currentColor" />
        <path
          d="M11.4453 16C6.76352 16 5 13.75 5 11.5C5 9.25 7.31436 7 11.4453 7C15.5763 7 18 8.92857 18 11.5C18 14.0714 16.1271 16 11.4453 16Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="13.5" cy="9.5" r="1.5" fill="white" />
        <circle
          cx="11.5"
          cy="11.5"
          r="9.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="17.7071"
          y1="18.2929"
          x2="22.7071"
          y2="23.2929"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </SvgIcon>
  );
}
