import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Text from './Text';

export default function UserProfileMetadataWrap({
  id,
  value,
  children,
}) {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: theme.palette.primary.main + '26',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '10px',
        }}
      >
        {children}
      </div>
      <div>
        <Text
          variant="subtitle1"
          domId="selenium-user-since"
          id={id}
        />
        <Text
          variant="body2"
          domId="selenium-user-since"
          id={value}
          style={{ textDecoration: 'underline' }}
        />
      </div>
    </div>
  );
}
