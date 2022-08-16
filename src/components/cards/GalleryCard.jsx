import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import Link from '../Link';
import Card from './Card';

export default function GalleryCard({
  title,
  titleId = 'GALLERY',
  individualGuid,
  assets,
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const imageHeight = isSm ? 140 : 80;

  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        individualGuid ? (
          <Link to={`/individuals/${individualGuid}/gallery`}>
            <FormattedMessage id="INDIVIDUAL_GALLERY_SEE_ALL" />
          </Link>
        ) : null
      }
      overflow="hidden"
      overflowX="hidden"
    >
      <ImageList
        cols={3}
        rowHeight={imageHeight}
        style={{ marginTop: 8 }}
      >
        {assets.map(asset => (
          <ImageListItem key={asset.guid} cols={1}>
            <img src={asset.src} alt={asset.alt} />
          </ImageListItem>
        ))}
      </ImageList>
    </Card>
  );
}
