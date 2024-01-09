import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { FormControl, MenuItem, Select } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import useGetUserSightings from '../../models/users/useGetUserSightings';
import useGetUserUnprocessedAssetGroupSightings from '../../models/users/useGetUserUnproccessedAssetGroupSightings';
// import { formatUserMessage } from '../../utils/formatters';

import MainColumn from '../../components/MainColumn';
import SightingsCard from '../../components/cards/SightingsCard';

import CardContainer from '../../components/cards/CardContainer';
import useGetMe from '../../models/users/useGetMe';
import Text from '../../components/Text';
import LoadingScreen from '../../components/LoadingScreen';

import useDeleteSighting from '../../models/sighting/useDeleteSighting';
import useDeleteAssetGroupSighting from '../../models/assetGroupSighting/useDeleteAssetGroupSighting';
import ConfirmDelete from '../../components/ConfirmDelete';
import Paginator from '../../components/dataDisplays/Paginator';

export default function DataPage() {
  const { data: userData, loading: userDataLoading } = useGetMe();

  const theme = useTheme();

  const history = useHistory();

  const rowsPerPagePendingSightings = 10;
  const [
    searchParamsPendingSightings,
    setSearchParamsPendingSightings,
  ] = useState({
    limit: rowsPerPagePendingSightings,
    offset: 0,
    sort: 'created',
    reverse: true,
  });

  const rowsPerPageSightings = 10;
  const [searchParamsSightings, setSearchParamsSightings] = useState({
    limit: rowsPerPageSightings,
    offset: 0,
    sort: 'created',
    reverse: true,
  });

  const userId = userData?.guid;
  const { data: sightingsDataObject, loading: sightingsLoading } =
    useGetUserSightings(userId, searchParamsSightings);
  const {
    results: sightingsData,
    resultCount: resultCountSightings,
  } = sightingsDataObject;

  const unapprovedSightingsData = sightingsData?.filter(
    sighting =>
      sighting.match_state === 'unreviewed' ||
      sighting.match_state === 'in_progress',
  );

  const [selected, setSelected] = React.useState('all_data');

  const intl = useIntl();

  const { data: agsDataObject, loading: agsLoading } =
    useGetUserUnprocessedAssetGroupSightings(
      userId,
      searchParamsPendingSightings,
    );

  const {
    results: agsData,
    resultCount: resultCountPendingSigtings,
  } = agsDataObject;

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

  if (userDataLoading) return <LoadingScreen />;

  return (
    <MainColumn fullWidth>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 0px' }}
        id="DATA_PAGE"
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
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
        <div
          style={{
            width: '100%',
            // marginRight: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <FormControl
            style={{
              width: 220,
              height: 40,
              display: 'flex',
              padding: 5,
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 10,
              marginRight: 30,
              borderRadius: 24,
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selected}
              label="Age"
              disableUnderline
              onChange={e => {
                setSelected(e.target.value);
              }}
              style={{
                color: theme.palette.common.white,
                fontSize: 16,
                fontWeight: 500,
                paddingLeft: 10,
              }}
            >
              <MenuItem value="all_data">
                <FormattedMessage id="MY_SIGHTINGS" />
              </MenuItem>
              <MenuItem value="unapproved_data">
                <FormattedMessage id="MY_UNAPPROVED_SIGHTINGS" />
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <CardContainer size="large" style={{ width: 200 }}>
          <div
            style={{
              width: '100%',
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text
              id={intl.formatMessage({ id: 'MY_PENDING_SIGHTINGS' })}
              variant="h6"
              // style={{ marginLeft: 8 }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SightingsCard
              id="pending-sightings-card"
              columns={[
                'date',
                'location',
                'numberAnnotations',
                'numberEncounters',
                'actions',
              ]}
              sightings={agsData || []}
              linkPath="pending-sightings"
              noSightingsMsg="NO_PENDING_SIGHTINGS"
              loading={agsLoading}
              searchParams={searchParamsPendingSightings}
              setSearchParams={setSearchParamsPendingSightings}
              onDelete={value => {
                setPending(true);
                setId(value);
                setDeleteDialogOpen(true);
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'row',
                marginTop: 20,
                alignItems: 'center',
              }}
            >
              <Paginator
                searchParams={searchParamsPendingSightings}
                setSearchParams={setSearchParamsPendingSightings}
                count={resultCountPendingSigtings}
              />
              <Text>
                {intl.formatMessage(
                  { id: 'TotalAccount' },
                  { totalAccount: resultCountPendingSigtings },
                )}
              </Text>
            </div>

            <Text
              id={
                selected === 'all_data'
                  ? intl.formatMessage({ id: 'MY_SIGHTINGS' })
                  : intl.formatMessage({
                      id: 'MY_UNAPPROVED_SIGHTINGS',
                    })
              }
              variant="h6"
              style={{
                marginLeft: 8,
                marginBottom: 20,
                marginTop: 20,
              }}
            />
            <SightingsCard
              id="sightings-card"
              noTitleBar
              columns={[
                'individual',
                'date',
                'locationIdValue',
                'match_state',
                'numberAnnotations',
                'numberEncounters',
                'actions',
              ]}
              hideSubmitted
              sightings={
                (selected === 'all_data'
                  ? sightingsData
                  : unapprovedSightingsData) || []
              }
              loading={sightingsLoading}
              noSightingsMsg="NO_SIGHTINGS"
              searchParams={searchParamsSightings}
              setSearchParams={setSearchParamsSightings}
              // dataCount={(selected === "all_data" ? sightingsData?.length : unapprovedSightingsData?.length)}
              onDelete={value => {
                setPending(false);
                setId(value);
                setDeleteDialogOpen(true);
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'row',
                marginTop: 20,
                alignItems: 'center',
              }}
            >
              <Paginator
                searchParams={searchParamsSightings}
                setSearchParams={setSearchParamsSightings}
                count={resultCountSightings}
              />
              <Text>
                {intl.formatMessage(
                  { id: 'TotalAccount' },
                  { totalAccount: resultCountSightings || 0 },
                )}
              </Text>
            </div>
          </div>
        </CardContainer>
      </div>
    </MainColumn>
  );
}
