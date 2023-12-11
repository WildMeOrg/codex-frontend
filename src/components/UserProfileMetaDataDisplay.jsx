import React from 'react';
import {
  MailOutline,
  PlaceOutlined,
  AccountBalanceOutlined,
} from '@material-ui/icons';
import UserProfileMetadataWrap from './UserProfileMetadataWrap';

export default function UserProfileMetaDataDisplay({
  email,
  location,
  affiliation,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '50px',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginTop: '30px',
        marginLeft: '15px',
        marginRight: '15px',
      }}
    >
      <UserProfileMetadataWrap id="EMAIL_ADDRESS" value={email}>
        <MailOutline fontSize="small" color="inherit" />
      </UserProfileMetadataWrap>

      <UserProfileMetadataWrap id="LOCATION" value={location}>
        <PlaceOutlined fontSize="small" color="inherit" />
      </UserProfileMetadataWrap>

      <UserProfileMetadataWrap id="AFFILIATION" value={affiliation}>
        <AccountBalanceOutlined fontSize="small" color="inherit" />
      </UserProfileMetadataWrap>
    </div>
  );
}
