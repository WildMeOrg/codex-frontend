import React from 'react';
import MUIDataTable from 'mui-datatables';
import { format } from 'date-fns';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ButtonLink from '../../components/ButtonLink';

export default function ResultsTable({ encounters }) {
  return (
    <div style={{ marginLeft: 16, width: '80%' }}>
      <MUIDataTable
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
                        Species: Megaptera novaeangliae
                      </Typography>
                      <Typography>Region: South Sahara</Typography>
                      <ButtonLink
                        variant="outlined"
                        color="secondary"
                        style={{ marginTop: 16 }}
                        href={`/encounters/${expandedEncounter.id}`}
                      >
                        View Encounter
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
