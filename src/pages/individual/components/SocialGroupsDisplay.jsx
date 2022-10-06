import React from 'react';
import { get } from 'lodash-es';

import { cellRendererTypes } from '../../../components/dataDisplays/cellRenderers';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../../components/ActionIcon';

export default function SocialGroupsDisplay({
  individualGuid,
  data = [],
  onClickDelete,
  ...rest
}) {
  const dataWithRoles = data.map(datum => {
    const members = get(datum, 'members', {});
    const membershipData = members[individualGuid];
    return {
      ...datum,
      role: get(membershipData, ['role_guids', 0]),
    };
  });

  const columns = [
    {
      reference: 'name',
      name: 'name',
      labelId: 'SOCIAL_GROUP',
    },
    {
      name: 'role',
      labelId: 'ROLE',
      options: {
        cellRenderer: cellRendererTypes.socialGroupRole,
      },
    },
    {
      reference: 'guid',
      name: 'guid',
      labelId: 'ACTIONS',
      options: {
        customBodyRender: (guid, socialGroup) => (
          <>
            <ActionIcon
              variant="view"
              href={`/social-groups/${guid}`}
              linkProps={{ newTab: true }}
            />
            <ActionIcon
              variant="delete"
              onClick={() => onClickDelete(socialGroup)}
            />
          </>
        ),
      },
    },
  ];

  return (
    <DataDisplay
      idKey="guid"
      tableSize="medium"
      data={dataWithRoles}
      columns={columns}
      {...rest}
    />
  );
}
