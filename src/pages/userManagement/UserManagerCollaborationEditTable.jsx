import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

import CustomAlert from '../../components/Alert';
import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';
import { getNthAlphabeticalMemberObjAndMakeLodashReady } from '../../utils/manipulators';
import queryKeys from '../../constants/queryKeys';

export default function UserManagersCollaborationEditTable({
  inputData,
  collaborationLoading,
  collaborationError,
  // collaborationRefresh,
}) {
  const queryClient = useQueryClient();
  const intl = useIntl();
  const [dismissed, setDismissed] = useState(false);
  const [editCollaboration, setEditCollaboration] = useState(null);
  const [revokesLoading, setRevokesLoading] = useState(false);
  const {
    collabPatchArgs,
    data: patchData,
    error,
    isError,
    isLoading,
    isSuccess,
  } = usePatchCollaboration();
  const collabEditPath = '/managed_view_permission';
  const collabEditOp = 'replace';
  const revokedPermission = 'revoked';
  async function processRevoke(collaboration) {
    setRevokesLoading(true);
    setDismissed(false);
    const collaborationData = [
      {
        op: collabEditOp,
        path: collabEditPath,
        value: {
          user_guid: get(collaboration, 'userOneGuid'),
          permission: revokedPermission,
        },
      },
    ];
    const collaborationDataTheOtherWay = [
      {
        op: collabEditOp,
        path: collabEditPath,
        value: {
          user_guid: get(collaboration, 'userTwoGuid'),
          permission: revokedPermission,
        },
      },
    ];
    collabPatchArgs(
      get(collaboration, 'guid'),
      collaborationData,
      collaborationDataTheOtherWay,
    );
    setRevokesLoading(false);
  }

  function tranformDataForCollabTable(inputData) {
    if (!inputData || inputData.length === 0) return null;
    return inputData.map(entry => {
      const member1 = getNthAlphabeticalMemberObjAndMakeLodashReady(
        get(entry, 'members'),
        1,
      );
      const member2 = getNthAlphabeticalMemberObjAndMakeLodashReady(
        get(entry, 'members'),
        2,
      );
      // Note: the collaboration API call returned a members OBJECT instead of array of objects, which made some tranformation gymnastics here necessary
      return {
        guid: get(entry, 'guid'),
        userOne: get(member1, 'full_name', get(member1, 'email')),
        userOneGuid: get(member1, 'guid'),
        userTwo: get(member2, 'full_name', get(member2, 'email')),
        userTwoGuid: get(member2, 'guid'),
        viewStatusOne: get(member1, 'viewState'),
        viewStatusTwo: get(member2, 'viewState'),
      };
      // editStatusOne: get(
      //   member1,
      //   'editState',
      // ),
      // editStatusTwo: get(
      //   member2,
      //   'editState',
      // ),
    });
  }
  const tableFriendlyData = tranformDataForCollabTable(
    inputData,
  )?.filter(
    collab =>
      get(collab, 'viewStatusOne') !== revokedPermission ||
      get(collab, 'viewStatusTwo') !== revokedPermission,
  );
  // console.log('deleteMe tableFriendlyData is: ');
  // console.log(tableFriendlyData);
  const tableColumns = [
    {
      name: 'userOne',
      align: 'right',
      label: intl.formatMessage(
        // Alignments in this table don't look great, but they are grouped into visually meaningful chunks. I'm open to more aesthetically pleasing ideas
        { id: 'USER_ONE' },
      ),
      options: {
        customBodyRender: userOne => (
          <Text variant="body2">{userOne}</Text>
        ),
      },
    },
    {
      name: 'viewStatusOne',
      align: 'left',
      label: intl.formatMessage({ id: 'USER_ONE_VIEW_STATUS' }),
      options: {
        customBodyRender: viewStatusOne => (
          <Text variant="body2">{viewStatusOne}</Text>
        ),
      },
    }, //     customBodyRender: editStatusOne => ( //   options: { //   label: intl.formatMessage({ id: 'USER_ONE_EDIT_STATUS' }), //   name: 'editStatusOne', // {
    //       <Text variant="body2">{editStatusOne}</Text>
    //     ),
    //   },
    // },
    {
      name: 'userTwo',
      align: 'right',
      label: intl.formatMessage({
        id: 'USER_TWO',
      }),
      options: {
        customBodyRender: userTwo => (
          <Text variant="body2">{userTwo}</Text>
        ),
      },
    },
    {
      name: 'viewStatusTwo',
      align: 'left',
      label: intl.formatMessage({ id: 'USER_TWO_VIEW_STATUS' }),
      options: {
        customBodyRender: viewStatusTwo => (
          <Text variant="body2">{viewStatusTwo}</Text>
        ),
      },
    }, //     customBodyRender: editStatusTwo => ( //   options: { //   label: intl.formatMessage({ id: 'USER_TWO_EDIT_STATUS' }), //   name: 'editStatusTwo', // {
    //       <Text variant="body2">{editStatusTwo}</Text>
    //     ),
    //   },
    // },
    {
      name: 'actions',
      align: 'left',
      label: intl.formatMessage({
        id: 'ACTIONS',
      }),
      options: {
        displayInFilter: false,
        customBodyRender: (_, collaboration) => (
          <div style={{ display: 'flex' }}>
            <ActionIcon
              variant="revoke"
              onClick={() => processRevoke(collaboration)}
              loading={false}
            />
          </div>
        ),
      },
    },
  ];
  // if (isSuccess || isError) {
  //   queryClient.invalidateQueries(queryKeys.collaborations);
  // }
  return [
    <Grid item>
      <DataDisplay
        idKey="guid"
        title={<FormattedMessage id="EDIT_COLLABORATIONS" />}
        style={{ marginTop: 8 }}
        variant="secondary"
        columns={tableColumns}
        data={tableFriendlyData || []}
      />
      {collaborationLoading ? (
        <Skeleton style={{ transform: 'unset' }} height={44} />
      ) : null}
      {collaborationError ? (
        <Text
          id="COLLABORATION_DATA_ERROR"
          variant="body2"
          style={{ margin: '8px 16px', display: 'block' }}
        />
      ) : null}
      {isError && !dismissed ? (
        <CustomAlert
          severity="error"
          titleId="COLLABORATION_REVOKE_ERROR"
          onClose={() => {
            queryClient.invalidateQueries(queryKeys.collaborations);
            setDismissed(true);
          }}
        >
          {error
            ? error.toJSON().message +
              '. ' +
              intl.formatMessage({
                id: 'COLLAB_REVOKE_ERROR_SUPPLEMENTAL',
              })
            : intl.formatMessage({ id: 'UNKNOWN_ERROR' })}
        </CustomAlert>
      ) : null}
      {isSuccess && !dismissed ? (
        <CustomAlert
          severity="success"
          titleId="COLLABORATION_REVOKE_SUCCESS"
          onClose={() => {
            queryClient.invalidateQueries(queryKeys.collaborations);
            setDismissed(true);
          }}
        />
      ) : null}
    </Grid>,
  ];
}
