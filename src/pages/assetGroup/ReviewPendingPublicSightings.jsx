import React from 'react';
import { useIntl } from 'react-intl';

import usePublicAGS from '../../models/assetGroupSighting/usePublicAGS';
import useDocumentTitle from '../../hooks/useDocumentTitle';

import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import EntityHeader from '../../components/EntityHeader';
import HoustonSightingsDisplay from '../../components/dataDisplays/HoustonSightingsDisplay';

const columns = [
  'date',
  'location',
  'submissionTime',
  'stage',
  'actions',
];

export default function ReviewPendingPublicSightings() {
  const intl = useIntl();

  const { data, loading, error, statusCode } = usePublicAGS();

  useDocumentTitle('REVIEW_PENDING_PUBLIC_SIGHTINGS');

  if (error) return <SadScreen statusCode={statusCode} />;
  if (loading) return <LoadingScreen />;

  return (
    <MainColumn fullWidth>
      <EntityHeader
        name={intl.formatMessage({
          id: 'REVIEW_PENDING_PUBLIC_SIGHTINGS',
        })}
      />
      <HoustonSightingsDisplay
        titleId="PENDING_PUBLIC_SIGHTINGS"
        noSightingsMsg="NO_PENDING_PUBLIC_SIGHTINGS"
        linkPath="pending-sightings"
        columns={columns}
        sightings={data || []}
        loading={loading}
      />
    </MainColumn>
  );
}
