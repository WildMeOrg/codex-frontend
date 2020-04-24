import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

export default function IndividualIcon({ ...porpoises }) {
  return (
    <SvgIcon {...porpoises}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        <path
          d="M11.9159 19C4.7131 19 2 15.5 2 12C2 8.5 5.56056 5 11.9159 5C18.2712 5 22 8 22 12C22 16 19.1186 19 11.9159 19Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="15" cy="10" r="2" fill="white" />
      </svg>
    </SvgIcon>
  );
}
