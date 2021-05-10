import React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Text from '../../components/Text';

export default function Photographs({ assets }) {
  console.log(assets);
  return (
    <GridList cellHeight={200}>
      {assets.map(asset => (
        <GridListTile key={asset.guid}>
          <img alt={asset.filename} src={asset.src} />
          <GridListTileBar
            title={asset.filename}
            titlePosition="top"
            actionIcon={
              <IconButton>
                <MoreIcon />
              </IconButton>
            }
          />
        </GridListTile>
      ))}
    </GridList>
  );
}
