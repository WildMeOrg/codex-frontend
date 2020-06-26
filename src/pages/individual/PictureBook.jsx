import React, { useState } from 'react';
import { Global, css } from '@emotion/core';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { selectSearchResults } from '../../modules/individuals/selectors';
import Button from '../../components/Button';
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
  const searchResultsOriginal = useSelector(selectSearchResults);
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
          <Typography>
            <FormattedMessage id="LOADING" />
          </Typography>
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
          <Typography variant="h2" component="h1">
            <FormattedMessage id="PRINTABLE_PHOTOBOOK" />
          </Typography>
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
