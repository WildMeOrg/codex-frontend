import React, { useState } from 'react';
import { get } from 'lodash-es';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Text from '../../components/Text';

export default function Photographs({ assets }) {
  const [anchorInfo, setAnchorInfo] = useState(null);
  return (
    <div
      style={{
        display: 'grid',
        columnGap: 12,
        rowGap: 12,
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: 'auto',
        gridAutoRows: 'auto',
      }}
    >
      <Menu
        id="image-actions-menu"
        anchorEl={get(anchorInfo, 'element')}
        open={Boolean(get(anchorInfo, 'element'))}
        onClose={() => setAnchorInfo(null)}
      >
        <MenuItem>Add annotation</MenuItem>
        <MenuItem>Delete photograph</MenuItem>
      </Menu>
      {assets.map(asset => (
        <div style={{ position: 'relative' }}>
          <input
            type="image"
            style={{
              display: 'block',
              width: '100%',
            }}
            // onClick={() => setSelectedPhoto(asset.guid)}
            alt={asset.filename}
            src={asset.src}
          />
          <IconButton
            onClick={e =>
              setAnchorInfo({ element: e.currentTarget, asset })
            }
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: 'white',
            }}
          >
            <MoreIcon />
          </IconButton>
          <Text variant="caption">{asset.filename}</Text>
        </div>
      ))}
    </div>
  );
}
