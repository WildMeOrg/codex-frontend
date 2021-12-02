import React, { useState, useEffect } from 'react';
import RoomIcon from '@material-ui/icons/Room';

import { get } from 'lodash';

import ButtonLink from '../ButtonLink';
import Text from '../Text';

export default function Marker({
  entry,
  clickAwayClicked,
  setClickAwayClicked,
}) {
  const [showInfo, setShowInfo] = useState(false);
  useEffect(
    () => {
      if (clickAwayClicked) setShowInfo(false);
    },
    [clickAwayClicked],
  );
  // function onClose() {
  //   setShowInfo(false);
  // }
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
        <RoomIcon
          onClick={event => {
            event.stopPropagation();
            setShowInfo(true);
            setClickAwayClicked(false);
          }}
        />
      )}
    </div>
  );
}
