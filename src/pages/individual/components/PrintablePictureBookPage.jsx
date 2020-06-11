import React from 'react';
import { css } from '@emotion/core';

export default function PrintablePictureBookPage({
  children,
  isVisible = true,
}) {
  return (
    <div
      css={css`
        page-break-after: always;
        display: ${isVisible ? 'flex' : 'none'};
        flex-direction: column;
        box-sizing: border-box;

        > * {
          box-sizing: border-box;
        }

        .gallery-container {
          flex-grow: 1;
        }

        @media print {
          height: 100vh;

          .gallery-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        @media screen {
          padding: 2rem 1rem;
          border-bottom: 1px solid black;
          :last-of-type {
            border-bottom: none;
          }
        }
      `}
    >
      {children}
    </div>
  );
}
