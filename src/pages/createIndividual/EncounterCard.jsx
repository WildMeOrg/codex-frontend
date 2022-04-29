import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { get } from 'lodash-es';

import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

import defaultSightingSrc from '../../assets/defaultSighting.png';
import useEncounter from '../../models/encounter/useEncounter';
import Text from '../../components/Text';
import { formatDate } from '../../utils/formatters';

export default function EncounterCard({ encounterGuid })
{
  const {
    data,
    loading,
    error,
  } = useEncounter(encounterGuid);

  console.log(data);

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
          {data ? (
            <Text style={{ fontWeight: 'bold' }} id="SIGHTING_REPORTED_ON" values={{ date: formatDate(data?.createdHouston, true) }} />
          ) : (
            <Skeleton variant="text" height={30} width={140} />
          )}
          {data ? (
            <Text variant="body2" id="ENTITY_HEADER_REGION" values={{ region: data?.locationId }} />
          ) : (
            <Skeleton variant="text" height={20} width={80} />
          )}
          {data ? (
            <Text variant="body2" id="ENTITY_HEADER_SPECIES" values={{ species: data?.taxonomy }} />
          ) : (
            <Skeleton variant="text" height={20} width={80} />
          )}
          {/* {data && showSex && (
            <Text style={{ marginTop: 16 }}>
              <Text
                variant="body2"
                component="span"
              >{`${intl.formatMessage({ id: 'SEX' })}: `}</Text>
              <Text
                variant="body2"
                component="span"
                style={{ fontWeight: 'bold' }}
                id={sexLabelId}
              />
            </Text>
          )} */}
        </div>
      </div>
    </Paper>
  )
}