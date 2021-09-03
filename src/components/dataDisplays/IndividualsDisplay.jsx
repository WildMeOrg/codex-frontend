import React from 'react';
import { useIntl } from 'react-intl';
import { get, capitalize } from 'lodash-es';

import { formatDate } from '../../utils/formatters';
import DataDisplay from './DataDisplay';
import Link from '../Link';
import ButtonLink from '../ButtonLink';
import Text from '../Text';

export default function IndividualsDisplay({ individuals, ...rest }) {
  const intl = useIntl();
  const title = `${individuals.length} matching individuals`;

  const columns = [
    {
      name: 'name',
      label: intl.formatMessage({ id: 'NAME' }),
      options: {
        customBodyRender: (name, individual) => {
          const id = get(individual, 'id', '');
          return (
            <Link href={`/individuals/${id}`}>
              <Text variant="body2">{name}</Text>
            </Link>
          );
        },
      },
    },
    {
      name: 'alias',
      label: intl.formatMessage({ id: 'ALIAS' }),
      align: 'left',
      options: {
        customBodyRender: alias => (
          <Text variant="body2">{capitalize(alias)}</Text>
        ),
      },
    },
    {
      name: 'last_sighting',
      label: intl.formatMessage({ id: 'LAST_SEEN' }),
      align: 'left',
      options: {
        customBodyRender: lastSightingTimestamp => (
          <Text variant="body2">
            {formatDate(lastSightingTimestamp)}
          </Text>
        ),
      },
    },
    {
      name: 'speciesString',
      label: intl.formatMessage({ id: 'SPECIES' }),
      align: 'left',
      options: {
        customBodyRender: (_, individual) => {
          const genusString = capitalize(
            get(individual, 'genus', ''),
          );
          const speciesString = `${genusString} ${get(
            individual,
            'species',
            '',
          )}`;
          return <Text variant="body2">{speciesString}</Text>;
        },
      },
    },
    {
      name: 'encounters',
      label: intl.formatMessage({ id: 'SIGHTINGS' }),
      align: 'left',
      options: {
        customBodyRender: encounters => (
          <Text variant="body2">
            {get(encounters, 'length', '-')}
          </Text>
        ),
      },
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
      {...rest}
    />
  );
}
