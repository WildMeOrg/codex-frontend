import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
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
      <GridList
        cols={3}
        cellHeight={imageHeight}
        style={{ marginTop: 8 }}
      >
        {assets.map(asset => (
          <GridListTile key={asset.id} cols={1}>
            <img src={asset.src} alt={asset.filename} />
          </GridListTile>
        ))}
      </GridList>
    </Card>
  );
}
