import React from 'react';
import { format } from 'date-fns';
import DataDisplay from './DataDisplay';
import Link from '../Link';
import ButtonLink from '../ButtonLink';
import Text from '../Text';

export default function IndividualsDisplay({ individuals }) {
  const title = `${individuals.length} matching individuals`;

  const columns = [
    {
      name: 'id',
      label: 'Individual',
      options: {
        customBodyRender: value => (
          <Link href={`/individuals/${value}`}>{value}</Link>
        ),
      },
    },
    {
      name: 'lastSeen',
      label: 'Last Seen',
      options: {
        customBodyRender: value => format(value, 'M/dd/yy'),
      },
    },
    {
      name: 'alias',
      label: 'Alias',
    },
    {
      name: 'species',
      label: 'Species',
    },
    {
      name: 'encounterCount',
      label: 'Encounters',
    },
  ];

  return (
    <DataDisplay
      columns={columns}
      data={individuals}
      title={title}
      onPrint={() => {
        window.open('/individuals/picturebook', '_blank');
      }}
      renderExpandedRow={expandedIndividual => (
        <div style={{ display: 'flex' }}>
          <img
            src={expandedIndividual.profile}
            alt="Expanded individual"
            style={{
              width: 200,
              height: 160,
              padding: 20,
            }}
          />
          <div style={{ padding: '20px 0' }}>
            <Text variant="subtitle1">Recent Activity</Text>
            <Text>
              Encounter with <Link href="google.com">Tanya</Link> on{' '}
              <Link href="google.com">4/12/2019</Link>
            </Text>
            <Text>
              Encounter with <Link href="google.com">Drew</Link> on{' '}
              <Link href="google.com">4/6/2019</Link>
            </Text>
            <Text>
              Encounter with <Link href="google.com">Colin</Link> on{' '}
              <Link href="google.com">4/2/2019</Link>
            </Text>
            <Text>
              Encounter with <Link href="google.com">Jasonx</Link> on{' '}
              <Link href="google.com">3/16/2019</Link>
            </Text>
            <ButtonLink
              style={{ marginTop: 16 }}
              href={`/individuals/${expandedIndividual.id}`}
            >
              View Profile
            </ButtonLink>
          </div>
        </div>
      )}
    />
  );
}
