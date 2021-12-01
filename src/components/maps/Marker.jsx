import React, { useState, useEffect } from 'react';
import RoomIcon from '@material-ui/icons/Room';
import DialogContent from '@material-ui/core/DialogContent';

import { get } from 'lodash';

import Link from '../Link';
import ButtonLink from '../ButtonLink';
import StandardDialog from '../StandardDialog';
import Text from '../Text';

export default function Marker({
  entry,
  clickAwayClicked,
  setClickAwayClicked,
}) {
  console.log('deleteMe a1 Marker instance called');
  console.log('deleteMe clickAwayClicked is: ' + clickAwayClicked);
  const [showInfo, setShowInfo] = useState(false);
  useEffect(
    () => {
      console.log('deleteMe a1 useEffect in Marker.jsx is firing');
      if (clickAwayClicked) setShowInfo(false);
    },
    [clickAwayClicked],
  );
  function onClose() {
    console.log('deleteMe onClose called');
    setShowInfo(false);
  }
  return (
    <div>
      {showInfo && ( //   onClose={onClose} // <StandardDialog
        //   open={showInfo}
        //   titleId="SIGHTING_ON_MAP"
        // >
        //   <DialogContent>
        <div style={{ backgroundColor: 'white' }}>
          {/* <Link href={`/sightings/${get(entry, 'guid')}`}>
            {get(entry, 'text')}
          </Link> */}
          <ButtonLink
            href={`/sightings/${get(entry, 'guid')}`}
            newTab
            external
            size="small"
            style={{ backgroundColor: 'white', borderRadius: 0 }}
            variant="basic"
          >
            <Text style={{ fontSize: '9px' }}>
              {get(entry, 'text')}
            </Text>
            {/* {get(entry, 'text')} */}
          </ButtonLink>
        </div>
      )
      //   </DialogContent>
      // </StandardDialog>
      }
      {!showInfo && (
        <RoomIcon
          onClick={event => {
            console.log('deleteMe a1 room icon clicked before!');
            event.stopPropagation();
            console.log('deleteMe a1 room icon clicked after!');
            setShowInfo(true);
            setClickAwayClicked(false);
          }}
        />
      )}
    </div>
  );
}
