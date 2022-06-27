import React, { useState } from 'react';
import { Global, css } from '@emotion/core';
import { cloneDeep } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '../../components/Button';
import Text from '../../components/Text';
import PrintablePictureBookPage from './components/PrintablePictureBookPage';
import PictureBookIndividual from './components/PictureBookIndividual';

// Placeholder images that will be replaced with images from the api
import flukePic from '../../assets/fluke.png';
import newsitePic from '../../assets/newsite.png';
import oceanPic from '../../assets/ocean.jpeg';
import savannaPic from '../../assets/savanna.jpeg';

const fakeSearchResults = [
  {
    id: 'Teddy',
    alias: 'Teddy',
    species: 'Grampus Griseus',
    encounterCount: 7,
    locationsSighted: 3,
    lastSeen: Date.now(),
    profile: flukePic,
  },
  {
    id: 'WB-104',
    alias: 'Zeeb',
    species: 'Grampus Griseus',
    encounterCount: 5,
    locationsSighted: 2,
    lastSeen: Date.now(),
    profile: flukePic,
  },
];

const mockPhotos = [
  [flukePic, newsitePic, oceanPic],
  [newsitePic, oceanPic, savannaPic],
  [oceanPic, savannaPic, flukePic],
  [oceanPic, savannaPic],
  [savannaPic],
  [],
  [savannaPic, oceanPic, flukePic, newsitePic],
  ['/invalid.jpg', newsitePic, oceanPic],
  [newsitePic, 'invalid.jpg', savannaPic],
  [oceanPic, savannaPic, 'invalid.jpg'],
  [oceanPic, 'invalid.jpg', 'invalid.tiff'],
  [
    'invalid.jpg',
    savannaPic,
    'invalid.tiff',
    oceanPic,
    flukePic,
    newsitePic,
  ],
  ['invalid.jpg', 'invalid.tiff', 'invalid.png'],
  [oceanPic, flukePic, newsitePic],
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
        padding: 0;
        max-width: ${theme.breakpoints.values.lg}px;
      }

      main > div:first-of-type {
        padding: 1rem;
      }
    }

    /* visually removes header and footer */
    main > header.MuiAppBar-root,
    main #footer {
      display: none;
    }

    /* repositions content at top of page */
    main > div:first-of-type {
      top: 0 !important;
    }
  `;
}

export default function PictureBook() {
  const theme = useTheme();
  const searchResultsOriginal = fakeSearchResults;
  const searchResults = [
    ...searchResultsOriginal,
    ...cloneDeep(searchResultsOriginal),
  ];
  addPhotosToSearchResults(searchResults);

  const [pagesLoading, setPagesLoading] = useState(
    searchResults.reduce((acc, result) => {
      acc[result.id] = true;
      return acc;
    }, {}),
  );
  const isLoading = Object.values(pagesLoading).some(value =>
    Boolean(value),
  );
  return (
    <>
      <Global styles={resetStylesForPrintingCSS(theme)} />
      {isLoading && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress
            color="secondary"
            style={{ marginRight: 16 }}
          />
          <Text id="LOADING" />
        </div>
      )}
      <PrintablePictureBookPage isVisible={!isLoading}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <Text
            variant="h2"
            component="h1"
            id="PRINTABLE_PHOTOBOOK"
          />
          <Button
            display="primary"
            size="large"
            disabled={isLoading}
            onClick={() => window.print()}
            css={css`
              margin-top: 16px;
              @media print {
                display: none;
              }
            `}
          >
            <FormattedMessage id="PRINT" />
          </Button>
        </div>
      </PrintablePictureBookPage>
      {searchResults.map((individual, index) => (
        <PictureBookIndividual
          // eslint-disable-next-line react/no-array-index-key
          key={`${individual.id}-${index}`} // remove index from key when using real data
          isVisible={!isLoading}
          individual={individual}
          onLoad={() =>
            setPagesLoading(prevState => ({
              ...prevState,
              [individual.id]: false,
            }))
          }
        />
      ))}
    </>
  );
}
