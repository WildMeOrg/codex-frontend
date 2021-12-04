import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';

import { get } from 'lodash';

import ButtonLink from '../ButtonLink';
import Text from '../Text';

export default function Marker({
  entry,
  currentMarkerToShow,
  setCurrentMarkerToShow,
  children,
}) {
  const [showInfo, setShowInfo] = useState(false);
  useEffect(
    () => {
      const thisMarkersSightingId = get(entry, 'guid');
      currentMarkerToShow === thisMarkersSightingId
        ? setShowInfo(true)
        : setShowInfo(false);
    },
    [currentMarkerToShow],
  );
  return (
    <div>
      {showInfo ? (
        <div
          style={{ backgroundColor: 'white', width: 'max-content' }}
        >
          <ButtonLink
            href={`/sightings/${get(entry, 'guid')}`}
            newTab
            external
            size="small"
            style={{
              backgroundColor: 'white',
              borderRadius: 0,
              textTransform: 'none',
            }}
          >
            <Text
              variant="body2"
              style={{
                textDecoration: 'underline',
              }}
            >
              {get(entry, 'text')}
            </Text>
          </ButtonLink>
        </div>
      ) : (
        <IconButton
          style={{ backgroundColor: 'transparent' }}
          onClick={event => {
            event.stopPropagation();
            setCurrentMarkerToShow(get(entry, 'guid'));
          }}
        >
          {children}
        </IconButton>
      )}
    </div>
  );
}
