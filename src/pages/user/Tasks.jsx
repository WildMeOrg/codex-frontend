import React from 'react';
import { FormattedMessage } from 'react-intl';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '../../components/Button';
import DataDisplay from '../../components/dataDisplays/DataDisplay';

const fakeData = [
  {
    id: '123',
    name: 'Jonathan Moore sent you a collaboration request',
    new: true,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '231',
    name: 'Finished identifying individuals for sighting #251',
    new: true,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '452',
    name: 'Vanessa Moreno wants to join Indocet',
    new: false,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '521',
    name: 'Jake Frydman wants to join Indocet',
    new: false,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '663',
    name: 'Finished identifying individuals for sighting #250',
    new: false,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '444',
    name: 'Dani Replogle wants to join Indocet',
    new: false,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '212',
    name: 'Tyler Hogstrom wants to join Indocet',
    new: false,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
];

export default function Tasks() {
  return (
    <div style={{ margin: '0 12px' }}>
      <DataDisplay
        columns={[
          {
            name: 'name',
            label: 'Task',
            options: {
              customBodyRender: (task, datum) => (
                <Typography
                  variant="body2"
                  style={
                    datum.new ? { fontWeight: 'bold' } : undefined
                  }
                >
                  {task}
                </Typography>
              ),
            },
          },
          {
            name: 'display',
            label: 'Action',
            options: {
              customBodyRender: display => {
                if (display.type === 'button') {
                  return (
                    <Button size="small">
                      <FormattedMessage id={display.data} />
                    </Button>
                  );
                }

                if (display.type === 'progress') {
                  return (
                    <LinearProgress
                      color="secondary"
                      style={{ margin: '16px 0' }}
                      variant="determinate"
                      value={display.data}
                    />
                  );
                }

                return null;
              },
            },
          },
        ]}
        data={fakeData}
      />
    </div>
  );
}
