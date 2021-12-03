import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';

import { get } from 'lodash';

import ButtonLink from '../ButtonLink';
import Text from '../Text';

export default function Marker({
  entry,
  clickAwayClicked,
  setClickAwayClicked,
  children,
}) {
  const [showInfo, setShowInfo] = useState(false);
  useEffect(
    () => {
      if (clickAwayClicked) setShowInfo(false);
    },
    [clickAwayClicked],
  );
  return (
    <div>
      {showInfo && (
        <div style={{ backgroundColor: 'white' }}>
          <ButtonLink
            href={`/sightings/${get(entry, 'guid')}`}
            newTab
            external
            size="small"
            style={{ backgroundColor: 'white', borderRadius: 0 }}
          >
            <Text
              style={{ fontSize: '9px', textDecoration: 'underline' }}
            >
              {get(entry, 'text')}
            </Text>
          </ButtonLink>
        </div>
      )}
      {!showInfo && (
        <IconButton
          onClick={event => {
            event.stopPropagation();
            setShowInfo(true);
            setClickAwayClicked(false);
          }}
        >
          {children}
        </IconButton>
      )}
    </div>
  );
}
