import React from 'react';

import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../../components/ActionIcon';

export default function SocialGroupsDisplay({
  onClickDelete,
  ...rest
}) {
  const columns = [
    {
      reference: 'name',
      name: 'name',
      labelId: 'SOCIAL_GROUP',
    },
    {
      reference: 'guid',
      name: 'guid',
      labelId: 'ACTIONS',
      options: {
        customBodyRender: (guid, socialGroup) => [
          <ActionIcon
            variant="view"
            href={`/social-groups/${guid}`}
            linkProps={{ newTab: true }}
          />,
          <ActionIcon
            variant="delete"
            onClick={() => onClickDelete(socialGroup)}
          />,
        ],
      },
    },
  ];

  return (
    <DataDisplay
      idKey="guid"
      tableSize="medium"
      columns={columns}
      {...rest}
    />
  );
}
