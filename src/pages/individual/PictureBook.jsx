import React, { useEffect, useState, useCallback } from 'react';
import { Global, css } from '@emotion/core';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { selectSearchResults } from '../../modules/individuals/selectors';
import PrintablePictureBookPage from './components/PrintablePictureBookPage';
import PictureBookIndividual from './components/PictureBookIndividual';

// Placeholder images that will be replaced with images from the api
import flukePic from '../../assets/fluke.png';
import newsitePic from '../../assets/newsite.png';
import oceanPic from '../../assets/ocean.jpeg';
import savannaPic from '../../assets/savanna.jpeg';

const mockPhotos = [
  [flukePic, newsitePic, oceanPic],
  [newsitePic, oceanPic, savannaPic],
  [oceanPic, savannaPic, flukePic],
  [oceanPic, savannaPic],
  [savannaPic],
  [],
  [savannaPic, oceanPic, flukePic, newsitePic],
];

// temporary way to associate placeholder photos with individuals
function addPhotosToSearchResults(resultsArr) {
  resultsArr.forEach((individual, index) => {
    if (mockPhotos[index]) {
      individual.photos = mockPhotos[index];
    }
  });
}

function resetStylesForPrintingCSS(theme) {
  return css`
    @media screen {
      body {
        padding: 1rem;
        max-width: ${theme.breakpoints.values.lg}px;
      }
    }

    /* visually removes header and footer */
    main > header.MuiAppBar-root,
    #root > div {
      display: none;
    }
  `;
}

export default function PictureBook() {
  const theme = useTheme();
  const searchResults = useSelector(selectSearchResults);
  addPhotosToSearchResults(searchResults);

  const [pagesLoading, setPagesLoading] = useState(
    searchResults.reduce((acc, result) => {
      acc[result.id] = true;
      return acc;
    }, {}),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => {
      if (
        isLoading &&
        !Object.values(pagesLoading).some(value => value === true)
      ) {
        setIsLoading(false);
      }
    },
    [isLoading, pagesLoading],
  );

  return (
    <>
      <Global styles={resetStylesForPrintingCSS(theme)} />
      <PrintablePictureBookPage isVisible={!isLoading}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="h2" component="h1">
            <FormattedMessage id="PRINTABLE_FLUKE_BOOK" />
          </Typography>
          <Button
            variant="outlined"
            disabled={isLoading}
            onClick={() => window.print()}
            css={css`
              @media print {
                display: none;
              }
            `}
          >
            <FormattedMessage id="PRINT" />
          </Button>
        </div>
      </PrintablePictureBookPage>
      {searchResults.map(individual => (
        <PictureBookIndividual
          key={individual.id}
          isVisible={!isLoading}
          individual={individual}
          onLoad={useCallback(
            () =>
              setPagesLoading(prevState => ({
                ...prevState,
                [individual.id]: false,
              })),
            [],
          )}
        />
      ))}
    </>
  );
}
