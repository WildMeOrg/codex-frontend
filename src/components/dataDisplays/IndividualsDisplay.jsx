import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import { formatDate } from '../../utils/formatters';
import DataDisplay from './DataDisplay';
import Link from '../Link';
import ButtonLink from '../ButtonLink';
import Text from '../Text';
import { cellRendererTypes } from './cellRenderers';

export default function IndividualsDisplay({
  individuals,
  loading,
  hitCount,
  ...rest
}) {
  const intl = useIntl();
  const title = hitCount ? `${hitCount} matching individuals` : '';

  const columns = [
    {
      name: 'name',
      label: intl.formatMessage({
        id: 'NAME',
      }),
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
      label: intl.formatMessage({
        id: 'ALIAS',
      }),
      align: 'left',
      options: { cellRenderer: cellRendererTypes.capitalizedString },
    },
    {
      name: 'last_sighting',
      label: intl.formatMessage({ id: 'LAST_SEEN' }),
      align: 'left',
      options: {
        cellRenderer: cellRendererTypes.date,
        cellRendererProps: { accessor: 'lastSeen' },
      },
    },
    {
      name: 'taxonomy',
      label: intl.formatMessage({ id: 'SPECIES' }),
      align: 'left',
      options: { cellRenderer: cellRendererTypes.capitalizedString },
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
      loading={loading}
      // onPrint={() => {
      //   window.open('/individuals/picturebook', '_blank');
      // }}
      dataCount={hitCount}
      paginatedExternally
      showNoResultsBao
      renderExpandedRow={expandedIndividual => (
        <div style={{ display: 'flex' }}>
          {/* <img
              src={expandedIndividual.profile}
              alt="Expanded individual"
              style={{
                width: 200,
                height: 160,
                padding: 20,
              }}
            /> */}
          <div style={{ padding: '20px 0' }}>
            <Text variant="h6" style={{ marginBottom: 8 }}>
              Recent Activity
            </Text>
            {get(expandedIndividual, 'encounters', []).map(
              encounter => {
                const encounterDate = get(encounter, 'date_occurred');
                const formattedEncounterDate = encounterDate
                  ? formatDate(encounterDate, true)
                  : 'unknown date';
                const submitter = get(
                  encounter,
                  'submitter_id',
                  'unknown user',
                );

                return (
                  <Text variant="body2" key={encounter.id}>
                    {'Sighting on '}
                    <Link href={`/sightings/${encounter.id}`}>
                      {formattedEncounterDate}
                    </Link>
                    {' by '}
                    <Link href={`/users/${submitter}`}>
                      {submitter}
                    </Link>
                    .
                  </Text>
                );
              },
            )}
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
