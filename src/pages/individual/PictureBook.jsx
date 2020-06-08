import React from 'react';
import { Global, css } from '@emotion/core';

const resetStylesForPrintingCSS = css`
  @media screen {
    body {
      padding: 1rem;
    }
  }

  /* visually removing header and footer */
  main > header.MuiAppBar-root,
  #root > div {
    display: none;
  }
`;

export default function PictureBook() {
  return (
    <>
      <Global styles={resetStylesForPrintingCSS} />
      Picture Book
    </>
  );
}
