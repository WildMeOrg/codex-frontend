import React from 'react';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '../../components/Button';

export default function HowItWorks() {
  const themeColor = '#00fff7';

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px 20px 12px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h6" style={{ color: 'white' }}>
          Wild Me for Whale Sharks
        </Typography>
        <Button
          display="primary"
          style={{
            marginTop: 12,
            backgroundColor: themeColor,
            color: 'black',
            padding: '6px 14px',
            fontSize: 12,
            borderRadius: 300,
            marginRight: 12,
          }}
        >
          Community forums
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '8px 0 24px 0',
        }}
      >
        <MenuList style={{ margin: '0 20px' }}>
          <MenuItem>
            <Typography
              variant="subtitle2"
              style={{ color: themeColor }}
            >
              USER
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Log in</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Request invitation</Typography>
          </MenuItem>
        </MenuList>
        <MenuList style={{ margin: '0 20px' }}>
          <MenuItem>
            <Typography
              variant="subtitle2"
              style={{ color: themeColor }}
            >
              RESOURCES
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Documentation</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Community forums</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Legal</Typography>
          </MenuItem>
        </MenuList>
        <MenuList style={{ margin: '0 20px' }}>
          <MenuItem>
            <Typography
              variant="subtitle2"
              style={{ color: themeColor }}
            >
              CONTRIBUTE
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Report sighting</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Adopt a whale shark</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Donate</Typography>
          </MenuItem>
        </MenuList>
        <MenuList style={{ margin: '0 20px' }}>
          <MenuItem>
            <Typography
              variant="subtitle2"
              style={{ color: themeColor }}
            >
              SOCIAL
            </Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Facebook</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>LinkedIn</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Github</Typography>
          </MenuItem>
        </MenuList>
      </div>
      <div
        style={{
          width: '100%',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption">
          Copyright 2020 Wild Me for Whale Sharks
        </Typography>
      </div>
    </div>
  );
}
