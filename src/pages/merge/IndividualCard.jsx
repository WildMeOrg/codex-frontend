import React from 'react';

import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

import defaultIndividualPhoto from '../../assets/defaultIndividual.png';
import Text from '../../components/Text';
import sexOptions from '../../constants/sexOptions';

function deriveName(names, context) {
  const nameObject = names.find(n => n?.context === context) || {};
  return nameObject?.value;
}

export default function IndividualCard({ data, mergeConflicts }) {
  const safeNames = data?.names || [];
  const defaultName =
    deriveName(safeNames, 'defaultName') || 'Unnamed individual';
  const adoptionName = deriveName(safeNames, 'nickname');

  const showSex = mergeConflicts?.sex;
  const sexObject = sexOptions.find(
    option => option.value === data?.sex,
  );
  const sexLabelId = sexObject?.mergeLabelId || sexObject?.labelId;

  const individualPhoto = data?.featuredAssetGuid
    ? `/api/v1/assets/src/${data?.featuredAssetGuid}`
    : defaultIndividualPhoto;

  return (
    <Paper style={{ margin: '12px 0 20px', maxWidth: 660 }}>
      <div style={{ display: 'flex', padding: 20 }}>
        {data ? (
          <img
            src={individualPhoto}
            alt={defaultName}
            style={{ width: 200, height: 200 }}
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
            <Text style={{ fontWeight: 'bold' }}>{defaultName}</Text>
          ) : (
            <Skeleton variant="text" height={30} width={140} />
          )}
          {data ? (
            <Text variant="body2">{adoptionName || 'Steve'}</Text>
          ) : (
            <Skeleton variant="text" height={20} width={80} />
          )}
          {data && showSex && (
            <Text style={{ marginTop: 16 }}>
              <Text variant="body2" component="span">{`Sex: `}</Text>
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
