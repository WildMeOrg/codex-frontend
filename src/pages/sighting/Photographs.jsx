import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Text from '../../components/Text';

export default function Photographs({ assets }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('xs'));

  const [anchorInfo, setAnchorInfo] = useState(null);
  return (
    <div
      style={{
        display: 'grid',
        columnGap: 12,
        rowGap: 12,
        gridTemplateColumns: isSm ? '1fr' : '1fr 1fr 1fr',
        gridTemplateRows: 'auto',
        gridAutoRows: 'auto',
        margin: '0 20px',
      }}
    >
      <Menu
        id="image-actions-menu"
        anchorEl={get(anchorInfo, 'element')}
        open={Boolean(get(anchorInfo, 'element'))}
        onClose={() => setAnchorInfo(null)}
      >
        <MenuItem>
          <FormattedMessage id="ADD_ANNOTATION" />
        </MenuItem>
        <MenuItem>
          <FormattedMessage id="DELETE_PHOTOGRAPH" />
        </MenuItem>
      </Menu>
      {assets.map(asset => (
        <div style={{ position: 'relative' }}>
          <input
            type="image"
            style={{
              display: 'block',
              width: '100%',
            }}
            // onClick={() => open full screen dialog thing}
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
