import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import Link from '../Link';
import Card from './Card';

export default function GalleryCard({
  title,
  titleId = 'GALLERY',
  assets,
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const imageHeight = isSm ? 140 : 80;

  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={<Link>See all</Link>}
    >
      <ImageList
        cols={3}
        rowHeight={imageHeight}
        style={{ marginTop: 8 }}
      >
        {assets.map(asset => (
          <ImageListItem key={asset.id} cols={1}>
            <img src={asset.src} alt={asset.filename} />
          </ImageListItem>
        ))}
      </ImageList>
    </Card>
  );
}
