import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

import { deriveIndividualName } from '../../utils/nameUtils';
import defaultIndividualPhoto from '../../assets/defaultIndividual.png';
import useIndividual from '../../models/individual/useIndividual';
import Text from '../Text';
import sexOptions from '../../constants/sexOptions';

export default function IndividualCard({
  individualGuid,
  showSex = true,
  setIndividualData = Function.prototype,
}) {
  const intl = useIntl();

  const { data, loading, error } = useIndividual(individualGuid);
  const dataReady = !loading && !error;

  useEffect(() => {
    if (data) setIndividualData(data);
  }, [data]);

  const firstName = deriveIndividualName(
    data,
    'FirstName',
    'Unnamed individual',
  );
  const adoptionName = deriveIndividualName(data, 'AdoptionName');

  const sexObject = sexOptions.find(
    option => option.value === data?.sex,
  );
  const sexLabelId = sexObject?.mergeLabelId || sexObject?.labelId;

  const individualPhotoUrl = data?.featuredAssetGuid
    ? `/api/v1/assets/src/${data.featuredAssetGuid}`
    : defaultIndividualPhoto;

  return (
    <Paper style={{ margin: '12px 0 20px', maxWidth: 660 }}>
      <div style={{ display: 'flex', padding: 20 }}>
        {dataReady ? (
          <img
            src={individualPhotoUrl}
            alt={firstName}
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
            <Text style={{ fontWeight: 'bold' }}>{firstName}</Text>
          ) : (
            <Skeleton variant="text" height={30} width={140} />
          )}
          {adoptionName && dataReady && (
            <Text variant="body2">{adoptionName}</Text>
          )}
          {adoptionName && !dataReady && (
            <Skeleton variant="text" height={20} width={80} />
          )}
          {dataReady && showSex && (
            <Text style={{ marginTop: 16 }}>
              <Text variant="body2" component="span">
                {`${intl.formatMessage({ id: 'SEX' })}: `}
              </Text>
              <Text
                variant="body2"
                component="span"
                style={{ fontWeight: 'bold' }}
                id={sexLabelId}
              />
            </Text>
          )}
        </div>
      </div>
    </Paper>
  );
}
