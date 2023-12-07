import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Text from './Text';
import Chip from '@material-ui/core/Chip';
import { useTheme } from '@material-ui/core/styles';

export default function EntityHeader({
  name,
  noAvatar = false,
  children,
  renderOptions,
  renderAvatar,
  renderTabs,
  codexID,
  noDivider=false,
}) {
  const theme = useTheme();
  return (
    <>
      <Grid container justifyContent="center">
        {renderAvatar ? (
          <Grid
            style={{
              padding: '24px 0 16px 12px',
            }}
            item
          >
            {renderAvatar}
          </Grid>
        ) : null}
        <Grid
          item
          style={{
            marginLeft: 12,
            flexGrow: 1,
            padding: '24px 0 12px 0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
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
                maxWidth: noAvatar ? '100%' : '80%',
              }}
            >
              {name}
            </Text>                          
            <div>{renderOptions}</div>
          </div> 
          {codexID && (
            <div style={{ marginTop: 4 }}>
            <Chip
              // key={value}
              label={codexID}
              style={{
                marginTop: 4,
                marginRight: 4,
                color: theme.palette.common.white,
                backgroundColor: theme.palette.primary.main,
              }}
            />
          </div> 
          )}                   
          <div style={{ marginLeft: 4, marginTop: 4 }}>
            {children}
          </div>
          <div style={{ marginTop: 20 }}>{renderTabs}</div>          
         
        </Grid>
      </Grid>
      {!noDivider &&<Divider style={{ marginBottom: 12 }} />}
    </>
  );
}