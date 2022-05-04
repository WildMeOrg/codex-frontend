import React, { useMemo } from 'react';
import { get } from 'lodash-es';

import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

import defaultSightingSrc from '../../assets/defaultSighting.png';
import useEncounter from '../../models/encounter/useEncounter';
import useSiteSettings from '../../models/site/useSiteSettings';
import LocationIdViewer from '../../components/fields/view/LocationIdViewer';
import Text from '../../components/Text';
import Link from '../../components/Link';
import {
  formatDate,
  formatSpecifiedTime,
} from '../../utils/formatters';

export default function EncounterCard({ encounterGuid }) {
  const {
    data: siteSettings,
    siteSettingsVersion,
  } = useSiteSettings();

  const regionChoices = useMemo(
    () =>
      get(
        siteSettings,
        ['site.custom.regions', 'value', 'locationID'],
        [],
      ),
    [siteSettingsVersion, siteSettings],
  );

  const { data, loading, error } = useEncounter(encounterGuid);

  const sightingOwner = get(
    data,
    ['owner', 'full_name'],
    'Unknown User',
  );
  const ownerGuid = get(data, ['owner', 'guid']);
  const sightingTime = formatSpecifiedTime(
    data?.time,
    data?.timeSpecificity,
  );
  const dataReady = !loading && !error;

  return (
    <Paper style={{ margin: '12px 0 20px', maxWidth: 660 }}>
      <div style={{ display: 'flex', padding: 20 }}>
        {data ? (
          <img
            src={defaultSightingSrc}
            alt="Encounter"
            style={{ width: 200, height: 200, objectFit: 'cover' }}
          />
        ) : (
          <Skeleton variant="rect" width={200} height={200} />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '4px 0 0 16px',
          }}
        >
          {dataReady ? (
            <>
              <Text
                style={{ fontWeight: 'bold' }}
                id="SIGHTING_REPORTED_ON"
                values={{
                  date: formatDate(data?.createdHouston, true),
                }}
              />
              <Text
                variant="body2"
                id="ENTITY_HEADER_REGION"
                values={{
                  region: (
                    <LocationIdViewer
                      value={data?.locationId}
                      choices={regionChoices}
                    />
                  ),
                }}
              />
              <Text
                variant="body2"
                id="SIGHTING_TIME_COLON"
                values={{ date: sightingTime }}
              />
              <Text
                variant="body2"
                id="REPORTER_COLON"
                values={{
                  name: (
                    <Link newTab href={`/users/${ownerGuid}`}>
                      {sightingOwner}
                    </Link>
                  ),
                }}
              />
            </>
          ) : (
            <>
              <Skeleton variant="text" height={30} width={140} />
              <Skeleton variant="text" height={20} width={80} />
              <Skeleton variant="text" height={20} width={80} />
              <Skeleton variant="text" height={20} width={80} />
            </>
          )}
        </div>
      </div>
    </Paper>
  );
}
