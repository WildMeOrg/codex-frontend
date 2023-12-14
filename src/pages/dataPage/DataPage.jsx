import React from 'react';
import { useIntl } from 'react-intl';

import useGetUserSightings from '../../models/users/useGetUserSightings';
import useGetUserUnprocessedAssetGroupSightings from '../../models/users/useGetUserUnproccessedAssetGroupSightings';
// import { formatUserMessage } from '../../utils/formatters';

import MainColumn from '../../components/MainColumn';
import SightingsCard from '../../components/cards/SightingsCard';

import CardContainer from '../../components/cards/CardContainer';
import useGetMe from '../../models/users/useGetMe';
import Text from '../../components/Text';
import HomeBreadcrumbs from '../home/HomeBreadcrumbs';
import ButtonLink from '../../components/ButtonLink';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';


export default function DataPage() {
  const {
    data: userData,
    loading: userDataLoading,
    isFetching: userDataFetching,
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
      <div style={{ display: 'flex', 
        // flexWrap: 'wrap' 
        flexDirection: 'column',
        }}>
        <ButtonLink
            href={"/"}
            display="back"
            id="DATA_PAGE"
          />
        <HomeBreadcrumbs 
          currentPageText={'Data'}
          currentPageTextId="DATA_PAGE"
        />
        <CardContainer size="large" style={{width:200}}>
          <div style={{
            width: "100%",
            marginBottom: 20, 
            display: "flex",
            justifyContent: "space-between"}}>          
            <Text
              id={intl.formatMessage({ id: 'MY_PENDING_SIGHTINGS' })}
              variant="h6"
              style={{ marginLeft: 8 }}
            />
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Age</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={10}
              label="Age"
              // onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          </div>
          <SightingsCard
            id="pending-sightings-card"
            // title={intl.formatMessage({ id: 'PENDING_SIGHTINGS' })}
            columns={[
              'date', 
              'location',
              'numberAnnotations',
              'numberEncounters', 
              'actions' 
            ]}
            sightings={agsData || []}
            linkPath="pending-sightings"
            noSightingsMsg="NO_PENDING_SIGHTINGS"
            loading={agsLoading}
          />
          <Text
            id={intl.formatMessage({ id: 'MY_SIGHTINGS' })}
            variant="h6"
            style={{ marginLeft: 8 }}
          />
          <SightingsCard
            id="sightings-card"
            // title={intl.formatMessage({ id: 'SIGHTINGS' })}
            columns={[
              'individual',
              'date',
              'locationIdValue',
              'state',
              'numberAnnotations',
              'numberEncounters',
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
