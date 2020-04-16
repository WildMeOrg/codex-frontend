import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import {
  selectSearchResults,
  selectIndividualSearchCategories,
  selectIndividualSearchSchema,
} from '../../modules/individuals/selectors';
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

export default function SearchIndividuals() {
  const categories = useSelector(selectIndividualSearchCategories);
  const schema = useSelector(selectIndividualSearchSchema);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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
          open={mobileDrawerOpen}
          style={{ zIndex: 300 }}
          variant="temporary"
          PaperProps={paperProps}
          onClose={() => setMobileDrawerOpen(false)}
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
          <FormattedMessage id="EXPLORE_INDIVIDUALS" />
        </Typography>
        <SearchFilterList
          formValues={formValues}
          setFormValues={setFormValues}
          schema={schema}
        />
        <Hidden smUp>
          <Button style={{ margin: 16 }} variant="outlined" onClick={() => setMobileDrawerOpen(true)}><FormattedMessage id="SHOW_FILTERS" /></Button>
        </Hidden>
        <ResultsTable
          individuals={useSelector(selectSearchResults)}
        />
      </div>
    </div>
  );
}
