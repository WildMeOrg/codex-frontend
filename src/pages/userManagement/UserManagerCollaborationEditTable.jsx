import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';
import { getNthAlphabeticalMemberObjAndMakeLodashReady } from '../../utils/manipulators';
export default function UserManagersCollaborationEditTable({
  data,
  loading,
  error,
  refresh,
}) {
  const intl = useIntl();
  const [editCollaboration, setEditCollaboration] = useState(null);
  const {
    patchCollaboration,
    loading: patchLoading,
    error: patchError,
    setError: patchSetError,
    success: patchSuccess,
    setSuccess: patchSetSuccess,
  } = usePatchCollaboration();
  async function processRevoke(collaboration) {
    // const collaborationData = { // TODO note that this is still in progress and will be resolved along with a few other things in the separate ticket DEX-527
    //   op: 'replace',
    //   path: '/view_permission',
    //   value: 'revoked',
    // };
    const collaborationData = {
      op: 'replace',
      path: '/managed_view_permission',
      value: {
        user_guid: get(collaboration, 'userOneGuid'),
        permission: 'revoked',
      },
    };
    // const collaborationData = {
    //   managed_view_permission: {
    //     user_guid: get(collaboration, 'userOneGuid'),
    //   },
    //   permission: 'revoked',
    // };
    const response = await patchCollaboration(
      get(collaboration, 'guid'),
      collaborationData,
    );
    // const collaborationDataTheOtherWay = {
    //   managed_view_permission: {
    //     user_guid: get(collaboration, 'userTwoGuid'),
    //   },
    //   permission: 'revoked',
    // };
    // const responseTheOtherWay = await patchCollaboration(
    //   get(collaboration, 'guid'),
    //   collaborationDataTheOtherWay,
    // );
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
        // editStatusOne: get(
        //   member1,
        //   'editState',
        // ),
        // editStatusTwo: get(
        //   member2,
        //   'editState',
        // ),
      };
    });
  }
  const tableFriendlyData = tranformDataForCollabTable(data);
  const tableColumns = [
    {
      name: 'userOne',
      align: 'right', // Alignments in this table don't look great, but they are grouped into visually meaningful chunks. I'm open to more aesthetically pleasing ideas
      label: intl.formatMessage({ id: 'USER_ONE' }),
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
    }, // {
    //   name: 'editStatusOne',
    //   label: intl.formatMessage({ id: 'USER_ONE_EDIT_STATUS' }),
    //   options: {
    //     customBodyRender: editStatusOne => (
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
    }, // {
    //   name: 'editStatusTwo',
    //   label: intl.formatMessage({ id: 'USER_TWO_EDIT_STATUS' }),
    //   options: {
    //     customBodyRender: editStatusTwo => (
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
            />
          </div>
        ),
      },
    },
  ];

  return (
    <Grid item>
      {/* <CollaborationsDialog
        open={Boolean(editCollaboration)}
        onClose={() => {
          setEditCollaboration(null);
        }}
        activeCollaboration={editCollaboration}
        refreshCollaborationData={refresh}
      /> */}
      <DataDisplay
        idKey="guid"
        title={<FormattedMessage id="EDIT_COLLABORATIONS" />}
        style={{ marginTop: 8 }}
        variant="secondary"
        columns={tableColumns}
        data={tableFriendlyData || []}
      />
      {loading ? (
        <Skeleton style={{ transform: 'unset' }} height={44} />
      ) : null}
      {error ? (
        <Text
          id="COLLABORATION_DATA_ERROR"
          variant="body2"
          style={{ margin: '8px 16px', display: 'block' }}
        />
      ) : null}
    </Grid>
  );
}
