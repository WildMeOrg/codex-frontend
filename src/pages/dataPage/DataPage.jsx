import React, {useState} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import useGetUserSightings from '../../models/users/useGetUserSightings';
import useGetUserIndividuals from '../../models/users/useGetUserIndividuals';
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
import LoadingScreen from '../../components/LoadingScreen';

import useFilterIndividuals from '../../models/individual/useFilterIndividuals';
import useDeleteSighting from '../../models/sighting/useDeleteSighting';
import useDeleteAssetGroupSighting from '../../models/assetGroupSighting/useDeleteAssetGroupSighting';
import ConfirmDelete from '../../components/ConfirmDelete';
import { getAGSQueryKey, getSightingQueryKey } from '../../constants/queryKeys';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';


export default function DataPage() {
  const {
    data: userData,
    loading: userDataLoading,
    isFetching: userDataFetching,
  } = useGetMe();  

  const history = useHistory();
  const queryClient = useQueryClient();

  const userId = userData?.guid;
  const { data: sightingsData, loading: sightingsLoading } =
    useGetUserSightings(userId);

  const filteredSightingsData = sightingsData?.filter((sighting) => {
    sighting.match_state === "un_reviewed" || sighting.match_state === "in_progress"
  })

  const [selected, setSelected] = React.useState('all_data');

  // const { data: individualData, loading: individualDataLoading } =
  //   useGetUserIndividuals("dbc72f2c-8fd7-4615-896a-ed446335ec9f");

  // const {data: data1 } =  useFilterIndividuals('896a');
  // console.log('DataPage.jsx: data1: ', data1);
  
  // console.log('DataPage.jsx: individualData: ', individualData);

  // console.log('DataPage.jsx: sightingsData: ', sightingsData);
  const intl = useIntl();

  const { data: agsData, loading: agsLoading } =
    useGetUserUnprocessedAssetGroupSightings(userId);
  console.log('DataPage.jsx: agsData: ', agsData);

  function refreshData() {
    const queryKey = pending
      ? getAGSQueryKey(id)
      : getSightingQueryKey(id);
    queryClient.invalidateQueries(queryKey);
  }
  const {
    deleteSighting,
    loading: deleteInProgress,
    error: deleteSightingError,
    onClearError: deleteSightingOnClearError,
    vulnerableIndividual,
    onClearVulnerableIndividual,
  } = useDeleteSighting();
  const {
    deleteAssetGroupSighting,
    isLoading: deleteAgsInProgress,
    error: deleteAssetGroupSightingError,
    onClearError: deleteAsgOnClearError,
  } = useDeleteAssetGroupSighting();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [id, setId] = useState(null);

  const [pending, setPending] = useState('');

  const onClearError = pending
    ? deleteAsgOnClearError
    : deleteSightingOnClearError;

  if(userDataLoading) 
  return <LoadingScreen/>

  return (
    <MainColumn fullWidth>
      <div style={{ display: 'flex', 
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
        <ConfirmDelete
          open={deleteDialogOpen}
          onClose={() => {
            onClearVulnerableIndividual();
            onClearError();
            setDeleteDialogOpen(false);
          }}
          onDelete={async () => {
            let deleteResults;
            if (pending) {
              deleteResults = await deleteAssetGroupSighting(id);
            } else if (vulnerableIndividual) {
              deleteResults = await deleteSighting(id, true);
            } else {
              deleteResults = await deleteSighting(id);
            }
            const successful = pending
              ? deleteResults?.status === 204
              : deleteResults;
            if (successful) {
              setDeleteDialogOpen(false);
              history.push('/');
            }
          }}
          deleteInProgress={
            pending ? deleteAgsInProgress : deleteInProgress
          }
          error={
            pending
              ? deleteAssetGroupSightingError
              : deleteSightingError
          }
          errorTitleId={
            vulnerableIndividual
              ? 'REQUEST_REQUIRES_ADDITIONAL_CONFIRMATION'
              : undefined
          }
          alertSeverity={vulnerableIndividual ? 'warning' : 'error'}
          onClearError={onClearError}
          messageId={
            vulnerableIndividual
              ? 'SIGHTING_DELETE_VULNERABLE_INDIVIDUAL_MESSAGE'
              : 'CONFIRM_DELETE_SIGHTING_DESCRIPTION'
          }
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
            <div style={{width: 200}}>
              <FormControl fullWidth>
                {/* <InputLabel id="demo-select-small-label">Age12345</InputLabel> */}
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={selected}
                  label="Age"
                  onChange={(e) => {
                    console.log('DataPage.jsx: selected: ', selected);
                    setSelected(e.target.value)
                  }}
                >              
                  <MenuItem value={'all_data'}><FormattedMessage id="ALL_DATA"/></MenuItem>
                  <MenuItem value={'unapproved_data'}><FormattedMessage id="UNAPPROVED_DATA"/></MenuItem>
                </Select>
              </FormControl>
            </div>
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
            onDelete= {(value) => {
              console.log('DataPage.jsx: value: ', value);
              setPending(true);
              setId(value);
              setDeleteDialogOpen(true);
            }}
          />         
          
          <Text
            id= {selected==="all_data" ? 
              intl.formatMessage({ id: 'MY_SIGHTINGS' }) : 
              intl.formatMessage({ id: 'MY_UNAPPROVED_SIGHTINGS' })}
            variant="h6"
            style={{ marginLeft: 8 }}
          />
          <SightingsCard
            id="sightings-card"
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
            sightings={(selected === "all_data" ? sightingsData : filteredSightingsData) || []}
            loading={sightingsLoading}
            noSightingsMsg="NO_SIGHTINGS"
            onDelete= {(value) => {
              console.log('DataPage.jsx: value: ', value);
              setPending(false);
              setId(value);
              setDeleteDialogOpen(true);
            }}
          />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
