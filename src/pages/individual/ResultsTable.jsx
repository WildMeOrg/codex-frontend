import React from 'react';
import MUIDataTable from 'mui-datatables';
import { format } from 'date-fns';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '../../components/Link';

export default function SearchIndividuals({ individuals }) {
  return (
    <div style={{ marginLeft: 16, width: '80%' }}>
      <MUIDataTable
        title={`${individuals.length} matching individuals`}
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
                        Encounter with <Link>Tanya</Link> on{' '}
                        <Link>4/12/2019</Link>
                      </Typography>
                      <Typography>
                        Encounter with <Link>Drew</Link> on{' '}
                        <Link>4/6/2019</Link>
                      </Typography>
                      <Typography>
                        Encounter with <Link>Colin</Link> on{' '}
                        <Link>4/2/2019</Link>
                      </Typography>
                      <Typography>
                        Encounter with <Link>Jasonx</Link> on{' '}
                        <Link>3/16/2019</Link>
                      </Typography>
                      <Button
                        variant="outlined"
                        color="secondary"
                        style={{ marginTop: 16 }}
                      >
                        View Profile
                      </Button>
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
