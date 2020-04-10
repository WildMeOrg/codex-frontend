import React from 'react';
import MUIDataTable from 'mui-datatables';
import { format } from 'date-fns';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '../../components/Link';

export default function ResultsTable({ encounters }) {
  return (
    <div style={{ marginLeft: 16, width: '80%' }}>
      <MUIDataTable
        title={`${encounters.length} matching encounters`}
        columns={[
          {
            name: 'encounterDate',
            label: 'Encounter Date',
            options: {
              customBodyRender: value => format(value, 'M/dd/yy'),
            },
          },
          {
            name: 'submissionDate',
            label: 'Submission Date',
            options: {
              customBodyRender: value => format(value, 'M/dd/yy'),
            },
          },
          {
            name: 'individualId',
            label: 'Individual',
          },
          {
            name: 'user',
            label: 'Submitted By',
          },
          {
            name: 'photoCount',
            label: 'Photographs',
          },
        ]}
        data={encounters}
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
            const expandedEncounter = encounters[dataIndex];

            return (
              <tr>
                <td colSpan={999}>
                  <div style={{ display: 'flex' }}>
                    <img
                      src={expandedEncounter.profile}
                      alt="Expanded encounter"
                      style={{
                        width: 200,
                        height: 160,
                        padding: 20,
                      }}
                    />
                    <div style={{ padding: '20px 0' }}>
                      <Typography variant="subtitle1">
                        Encounter details
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
                        View Encounter
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
