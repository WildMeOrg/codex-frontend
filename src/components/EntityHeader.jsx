import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import BigAvatar from './BigAvatar';
import Text from './Text';

export default function EntityHeader({
  imgSrc,
  name,
  editable,
  children,
  square = false,
  onSettingsClick,
  renderOptions,
}) {
  return (
    <>
      <Grid container>
        <Grid
          style={{
            marginTop: 12,
            marginLeft: 12,
            padding: '24px 0 0 0',
          }}
          item
        >
          <BigAvatar
            imgSrc={imgSrc}
            editable={editable}
            name={name}
            square={square}
          />
        </Grid>
        <Grid
          item
          style={{
            marginLeft: 12,
            flexGrow: 1,
            padding: '24px 12px 12px 0',
            overflow: 'hidden',
            maxWidth: 677, // (i never said i was a role model)
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              variant="h4"
              component="h4"
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '80%',
              }}
            >
              {name}
            </Text>
            <div>
              {editable && (
                <IconButton
                  aria-label="Edit settings and profile"
                  onClick={onSettingsClick}
                >
                  <SettingsIcon fontSize="large" />
                </IconButton>
              )}
              {renderOptions}
            </div>
          </div>
          <div style={{ marginLeft: 4, marginTop: 4 }}>
            {children}
          </div>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: 12 }} />
    </>
  );
}
