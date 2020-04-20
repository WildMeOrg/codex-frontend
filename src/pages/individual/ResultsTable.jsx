import React from 'react';
import MUIDataTable from 'mui-datatables';
import { format } from 'date-fns';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Link from '../../components/Link';
import ButtonLink from '../../components/ButtonLink';

export default function ResultsTable({ individuals }) {
  return (
    <div style={{ marginLeft: 16, width: '80%' }}>
      <MUIDataTable
        columns={[
          {
            name: 'lastSeen',
            label: 'Last Seen',
            options: {
              customBodyRender: value => format(value, 'M/dd/yy'),
            },
          },
          {
            name: 'id',
            label: 'Individual',
          },
          {
            name: 'alias',
            label: 'Alias',
          },
          {
            name: 'encounterCount',
            label: 'Encounters',
          },
          {
            name: 'locationsSighted',
            label: 'Locations Sighted',
          },
        ]}
        data={individuals}
        options={{
          elevation: 0,
          pagination: false,
          filter: false,
          print: false,
          search: false,
          selectableRows: 'none',
          expandableRows: true,
          expandableRowsOnClick: true,
          responsive: 'scrollMaxHeight',
          renderExpandableRow: (_, { dataIndex }) => {
            const expandedIndividual = individuals[dataIndex];

            return (
              <tr>
                <td colSpan={999}>
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
                      <Typography variant="subtitle1">
                        Recent Activity
                      </Typography>
                      <Typography>
                        Encounter with{' '}
                        <Link href="google.com">Tanya</Link> on{' '}
                        <Link href="google.com">4/12/2019</Link>
                      </Typography>
                      <Typography>
                        Encounter with{' '}
                        <Link href="google.com">Drew</Link> on{' '}
                        <Link href="google.com">4/6/2019</Link>
                      </Typography>
                      <Typography>
                        Encounter with{' '}
                        <Link href="google.com">Colin</Link> on{' '}
                        <Link href="google.com">4/2/2019</Link>
                      </Typography>
                      <Typography>
                        Encounter with{' '}
                        <Link href="google.com">Jasonx</Link> on{' '}
                        <Link href="google.com">3/16/2019</Link>
                      </Typography>
                      <ButtonLink
                        variant="outlined"
                        color="secondary"
                        style={{ marginTop: 16 }}
                        href={`/individuals/${expandedIndividual.id}`}
                      >
                        View Profile
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
