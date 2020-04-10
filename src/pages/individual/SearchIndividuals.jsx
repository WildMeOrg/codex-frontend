import React, { useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FilterPanel from '../../components/FilterPanel';
import Link from '../../components/Link';
import {
  selectSearchResults,
  selectIndividualSearchCategories,
  selectIndividualSearchSchema,
} from '../../modules/individuals/selectors';

const drawerWidth = 280;

const paperProps = {
  style: {
    position: 'relative',
    minHeight: '100vh',
    padding: '64px 0',
    boxSizing: 'border-box',
    width: drawerWidth,
  },
};

export default function SearchIndividuals() {
  const individuals = useSelector(selectSearchResults);
  const categories = useSelector(selectIndividualSearchCategories);
  const schema = useSelector(selectIndividualSearchSchema);

  const [formValues, setFormValues] = useState(
    schema.reduce((memo, filter) => {
      memo[filter.name] = filter.defaultValue;
      return memo;
    }, {}),
  );

  console.log(formValues);

  return (
    <div style={{ display: 'flex' }}>
      <Hidden smUp>
        <Drawer
          open
          style={{ zIndex: 0 }}
          variant="temporary"
          PaperProps={paperProps}
        >
          <FilterPanel
            categories={categories}
            filters={schema}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer open variant="permanent" PaperProps={paperProps}>
          <FilterPanel
            categories={categories}
            filters={schema}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        </Drawer>
      </Hidden>
      <div style={{ marginTop: 64, width: '100%' }}>
        <Typography
          variant="h3"
          component="h3"
          style={{ margin: '16px 0 16px 16px' }}
        >
          Search Individuals
        </Typography>
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
      </div>
    </div>
  );
}
