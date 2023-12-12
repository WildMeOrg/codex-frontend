import React from 'react';
import { useIntl } from 'react-intl';

import useGetUserSightings from '../../models/users/useGetUserSightings';
import useGetUserUnprocessedAssetGroupSightings from '../../models/users/useGetUserUnproccessedAssetGroupSightings';
// import { formatUserMessage } from '../../utils/formatters';

import MainColumn from '../../components/MainColumn';
import SightingsCard from '../../components/cards/SightingsCard';

import CardContainer from '../../components/cards/CardContainer';
import useGetMe from '../../models/users/useGetMe';

export default function DataPage() {
  const {
    data: userData,
    // loading: userDataLoading,
    // isFetching: userDataFetching,
  } = useGetMe();

  const userId = userData?.guid;
  const { data: sightingsData, loading: sightingsLoading } =
    useGetUserSightings(userId);

  console.log('DataPage.jsx: sightingsData: ', sightingsData);
  const intl = useIntl();

  const { data: agsData, loading: agsLoading } =
    useGetUserUnprocessedAssetGroupSightings(userId);
  console.log('DataPage.jsx: agsData: ', agsData);

  // const name = formatUserMessage(
  //   { fullName: userData?.full_name },
  //   intl,
  // );

  return (
    <MainColumn fullWidth>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="large">
          <SightingsCard
            id="pending-sightings-card"
            title={intl.formatMessage({ id: 'PENDING_SIGHTINGS' })}
            columns={['date', 'location', 'actions']}
            sightings={agsData || []}
            linkPath="pending-sightings"
            noSightingsMsg="NO_PENDING_SIGHTINGS"
            loading={agsLoading}
          />
          <SightingsCard
            id="sightings-card"
            title={intl.formatMessage({ id: 'SIGHTINGS' })}
            columns={[
              'individual',
              'date',
              'locationIdValue',
              'actions',
            ]}
            hideSubmitted
            sightings={sightingsData || []}
            loading={sightingsLoading}
            noSightingsMsg="NO_SIGHTINGS"
          />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
