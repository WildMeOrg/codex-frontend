import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';
// import CollaborationsDialog from '../../components/cards/collaborations/CollaborationsDialog';

export default function UserManagersCollaborationEditTable({
  data,
  loading,
  error,
  refresh,
}) {
  const {
    patchCollaboration,
    loading: patchLoading,
    error: patchError,
    setError: patchSetError,
    success: patchSuccess,
    setSuccess: patchSetSuccess,
  } = usePatchCollaboration();
  async function processRevoke(collaboration) {
    const collaborationData = {
      op: 'replace',
      path: '/view_permission',
      value: 'revoked',
    };
    const response = await patchCollaboration(
      get(collaboration, 'guid'),
      collaborationData,
    );
    console.log('deleteMe response is: ');
    console.log(response);
    console.log(
      'delteMe processRevoke clicked and collaboration is: ',
    );
    console.log(collaboration);
  }

  function getNthAlphabeticalMemberObjAndMakeLodashReady(obj, n) {
    // derived from https://stackoverflow.com/questions/39483677/how-to-get-first-n-elements-of-an-object-using-lodash
    const memberObject = Object.keys(obj)
      .sort()
      .slice(n - 1, n)
      .reduce((memo, current) => obj[current], {});

    // Convert empty strings to undefined so that they get handled appropriately by lodash get later omg this is so silly
    if (get(memberObject, 'full_name') === '')
      memberObject.full_name = undefined;

    return memberObject;
  }
  function transformData(inputData) {
    if (!inputData || inputData.length === 0) return null;
    return inputData.map(entry => ({
      // Note: the collaboration API call returned a members OBJECT instead of array of objects, which made some tranformation gymnastics here necessary
      guid: get(entry, 'guid'),
      userOne: get(
        getNthAlphabeticalMemberObjAndMakeLodashReady(
          get(entry, 'members'),
          1,
        ),
        'full_name',
        get(
          getNthAlphabeticalMemberObjAndMakeLodashReady(
            get(entry, 'members'),
            1,
          ),
          'email',
        ),
      ),
      userTwo: get(
        getNthAlphabeticalMemberObjAndMakeLodashReady(
          get(entry, 'members'),
          2,
        ),
        'full_name',
        get(
          getNthAlphabeticalMemberObjAndMakeLodashReady(
            get(entry, 'members'),
            2,
          ),
          'email',
        ),
      ),
      viewStatusOne: get(
        getNthAlphabeticalMemberObjAndMakeLodashReady(
          get(entry, 'members'),
          1,
        ),
        'viewState',
      ),
      viewStatusTwo: get(
        getNthAlphabeticalMemberObjAndMakeLodashReady(
          get(entry, 'members'),
          2,
        ),
        'viewState',
      ),
      // editStatusOne: get(
      //   getNthAlphabeticalMemberObjAndMakeLodashReady(get(entry, 'members'), 1),
      //   'editState',
      // ),
      // editStatusTwo: get(
      //   getNthAlphabeticalMemberObjAndMakeLodashReady(get(entry, 'members'), 2),
      //   'editState',
      // ),
    }));
  }
  data = transformData(data);
  const intl = useIntl();
  const [editCollaboration, setEditCollaboration] = useState(null);
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
        data={data || []}
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
