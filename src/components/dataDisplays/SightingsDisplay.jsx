import React from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import DataDisplay from './DataDisplay';
import Link from '../Link';
import ButtonLink from '../ButtonLink';
import Text from '../Text';
import { cellRendererTypes } from '../dataDisplays/cellRenderers';

export default function SightingsDisplay({ sightings }) {
  const intl = useIntl();
  const title = `${sightings.length} matching sightings`;

  const tableData = sightings.map(sighting => {
    const photoCount = sighting.encounters.reduce((memo, e) => {
      memo += e.images.length;
      return memo;
    }, 0);

    const individuals = sighting.encounters.reduce((memo, e) => {
      const individual = get(e, 'individual.id', null);
      return individual ? [...memo, individual] : null;
    }, []);

    return {
      ...sighting,
      photoCount,
      individuals,
    };
  });

  const columns = [
    {
      name: 'id',
      label: intl.formatMessage({
        id: 'SIGHTING_ID',
      }),
      options: {
        customBodyRender: value => (
          <Link href={`/sightings/${value}`}>{value}</Link>
        ),
      },
    },
    {
      name: 'individuals',
      label: intl.formatMessage({ id: 'INDIVIDUALS' }),
      options: {
        customBodyRender: individuals => (
          <span>
            {individuals.map((id, i) => (
              <span key={id}>
                {i !== 0 && ', '}
                <Link href={`/individuals/${id}`}>{id}</Link>
              </span>
            ))}
          </span>
        ),
      },
    },
    {
      name: 'sightingDate',
      label: intl.formatMessage({ id: 'SIGHTING_DATE' }),
      options: {
        cellRenderer: cellRendererTypes.date,
        cellRendererProps: { accessor: 'lastSeen' },
      },
    },
    {
      name: 'submissionDate',
      label: intl.formatMessage({ id: 'SUBMISSION_DATE' }),
      options: { cellRenderer: cellRendererTypes.date },
    },
    {
      name: 'submitter',
      label: intl.formatMessage({ id: 'SUBMITTED_BY' }),
      options: {
        customBodyRender: value => (
          <Link href={`/users/${value}`}>{value}</Link>
        ),
      },
    },
    {
      name: 'photoCount',
      label: intl.formatMessage({ id: 'PHOTOGRAPHS' }),
    },
  ];

  return (
    <DataDisplay
      columns={columns}
      data={tableData}
      title={title}
      renderExpandedRow={expandedSighting => (
        <div style={{ display: 'flex' }}>
          <img
            src={expandedSighting.profile}
            alt="Expanded sighting"
            style={{
              width: 200,
              height: 160,
              padding: 20,
            }}
          />
          <div style={{ padding: '20px 0' }}>
            <Text variant="subtitle1" id="SIGHTING_DETAILS" />
            <Text>Species: Megaptera novaeangliae</Text>
            <Text>Region: South Sahara</Text>
            <ButtonLink
              display="panel"
              style={{ marginTop: 16 }}
              href={`/sightings/${expandedSighting.id}`}
            >
              <FormattedMessage id="VIEW_SIGHTING" />
            </ButtonLink>
          </div>
        </div>
      )}
    />
  );
}
