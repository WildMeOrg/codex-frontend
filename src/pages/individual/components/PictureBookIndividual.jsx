import React from 'react';
import { css } from '@emotion/core';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import PrintablePictureBookPage from './PrintablePictureBookPage';
import PictureBookGallery from './PictureBookGallery';
import Link from '../../../components/Link';

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

export default function PictureBookPage({
  individual,
  isVisible = true,
  onLoad,
}) {
  const { alias, id, species, photos } = individual;

  return (
    <PrintablePictureBookPage isVisible={isVisible}>
      <Typography variant="h4" component="h2">
        {alias}
      </Typography>
      <dl css={dataCSS}>
        <Typography component="dt">
          <FormattedMessage id="INDIVIDUAL_ID:" />
        </Typography>
        <Typography component="dd">
          <Link href={`/individuals/${id}`}>{id}</Link>
        </Typography>
        <Typography component="dt">
          <FormattedMessage id="SPECIES:" />
        </Typography>
        <Typography component="dd">{species}</Typography>
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
