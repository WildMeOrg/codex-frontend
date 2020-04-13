import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import {
  selectSearchResults,
  selectEncounterSearchCategories,
  selectEncounterSearchSchema,
} from '../../modules/encounters/selectors';
import ResultsTable from './ResultsTable';

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

export default function SearchEncounters() {
  const categories = useSelector(selectEncounterSearchCategories);
  const schema = useSelector(selectEncounterSearchSchema);

  const [formValues, setFormValues] = useState(
    schema.reduce((memo, filter) => {
      memo[filter.name] = filter.defaultValue;
      return memo;
    }, {}),
  );

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
          <FormattedMessage id="EXPLORE_ENCOUNTERS" />
        </Typography>
        <SearchFilterList
          formValues={formValues}
          setFormValues={setFormValues}
          schema={schema}
        />
        <ResultsTable encounters={useSelector(selectSearchResults)} />
      </div>
    </div>
  );
}
