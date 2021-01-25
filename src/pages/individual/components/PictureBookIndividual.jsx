import React from 'react';
import { css } from '@emotion/core';
import PrintablePictureBookPage from './PrintablePictureBookPage';
import PictureBookGallery from './PictureBookGallery';
import Link from '../../../components/Link';
import Text from '../../../components/Text';

const dataCSS = css`
  ::after {
    content: '';
    display: block;
    clear: both;
  }
  dt {
    font-weight: bold;
    float: left;
    clear: left;
    margin-right: 0.5rem;
  }

  dd {
    float: left;
  }
`;

export default function PictureBookIndividual({
  individual,
  isVisible = true,
  onLoad,
}) {
  const { alias, id, species, photos } = individual;

  return (
    <PrintablePictureBookPage isVisible={isVisible}>
      <Text variant="h4" component="h2">
        {alias}
      </Text>
      <dl css={dataCSS}>
        <Text component="dt" id="INDIVIDUAL_ID:" />
        <Text component="dd">
          <Link href={`/individuals/${id}`}>{id}</Link>
        </Text>
        <Text component="dt" id="SPECIES:" />
        <Text component="dd">{species}</Text>
      </dl>
      <div className="gallery-container">
        <PictureBookGallery
          images={photos}
          onLoad={onLoad}
          name={alias}
        />
      </div>
    </PrintablePictureBookPage>
  );
}
