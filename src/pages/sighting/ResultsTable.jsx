import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import MUIDataTable from 'mui-datatables';
import { format } from 'date-fns';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ButtonLink from '../../components/ButtonLink';
import Link from '../../components/Link';

export default function ResultsTable({ sightings }) {
  const intl = useIntl();

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

  return (
    <div style={{ marginLeft: 16, width: '80%' }}>
      <MUIDataTable
        columns={[
          {
            name: 'id',
            label: intl.formatMessage({ id: 'SIGHTING_ID' }),
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
              customBodyRender: value => format(value, 'M/dd/yy'),
            },
          },
          {
            name: 'submissionDate',
            label: intl.formatMessage({ id: 'SUBMISSION_DATE' }),
            options: {
              customBodyRender: value => format(value, 'M/dd/yy'),
            },
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
        ]}
        data={tableData}
        options={{
          elevation: 0,
          pagination: false,
          filter: false,
          print: false,
          search: false,
          selectableRows: 'none',
          expandableRows: true,
          expandableRowsOnClick: true,
          renderExpandableRow: (_, { dataIndex }) => {
            const expandedSighting = sightings[dataIndex];

            return (
              <tr>
                <td colSpan={999}>
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
                      <Typography variant="subtitle1">
                        <FormattedMessage id="SIGHTING_DETAILS" />
                      </Typography>
                      <Typography>
                        Species: Megaptera novaeangliae
                      </Typography>
                      <Typography>Region: South Sahara</Typography>
                      <ButtonLink
                        variant="outlined"
                        color="secondary"
                        style={{ marginTop: 16 }}
                        href={`/sightings/${expandedSighting.id}`}
                      >
                        <FormattedMessage id="VIEW_SIGHTING" />
                      </ButtonLink>
                    </div>
                  </div>
                  <Divider />
                </td>
              </tr>
            );
          },
        }}
      />
    </div>
  );
}
