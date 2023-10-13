import React from 'react';
import useReviewSighting from '../../models/sighting/useReviewSighting';
import Text from '../Text';
import Alert from '../Alert';
import ButtonMenu from '../ButtonMenu';

export default function ReviewSighting({
  sightingGuid,
  matchStatus,
}) {
  const {
    mutate: reviewSighting,
    error,
    clearError,
  } = useReviewSighting();

  const sendRequest = async status => {
    const operations = [
      {
        op: 'replace',
        path: '/match_state',
        value: status,
      },
    ];
    await reviewSighting({ sightingGuid, operations });
  };

  const buttonActions = [
    {
      id: 'mark-sighting-unreviewed',
      labelId: 'UNREVIEWED',
      onClick: async () => {
        sendRequest('unreviewed');
      },
    },
    {
      id: 'mark-sighting-in-progress',
      labelId: 'IN_PROGRESS',
      onClick: async () => {
        sendRequest('in_progress');
      },
    },
    {
      id: 'mark-sighting-reviewed',
      labelId: 'REVIEWED',
      onClick: async () => {
        sendRequest('reviewed');
      },
    },
    {
      id: 'mark-sighting-unidentifiable',
      labelId: 'UNIDENTIFIABLE',
      onClick: async () => {
        sendRequest('unidentifiable');
      },
    },
  ];

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}
    >
      <Text id="STATUS" />
      <ButtonMenu
        display="secondary"
        buttonId="match-actions"
        style={{ marginLeft: 24 }}
        actions={buttonActions}
        id={matchStatus?.toUpperCase()}
      />
      {error && (
        <Alert
          severity="error"
          onClose={clearError}
          style={{ margin: '16px 0' }}
        >
          {error}
        </Alert>
      )}
    </div>
  );
}
