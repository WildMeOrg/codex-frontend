import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Button from '../../components/Button';
import Text from '../../components/Text';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import SightingsDisplay from '../../components/dataDisplays/SightingsDisplay';

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
  const categories = [];
  const schema = [];
  const searchResults = [];

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [formValues, setFormValues] = useState(
    schema.reduce((memo, filter) => {
      memo[filter.name] = filter.defaultValue;
      return memo;
    }, {}),
  );

  useDocumentTitle('EXPLORE_SIGHTINGS');

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
      <div style={{ marginTop: 64, width: '100%', overflow: 'auto' }}>
        <Text
          variant="h3"
          component="h3"
          style={{ margin: '16px 0 16px 16px' }}
          id="EXPLORE_SIGHTINGS"
        />
        <SearchFilterList
          formValues={formValues}
          setFormValues={setFormValues}
          schema={schema}
        />
        <Hidden smUp>
          <Button
            style={{ margin: 16 }}
            display="panel"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <FormattedMessage id="SHOW_FILTERS" />
          </Button>
        </Hidden>
        <div style={{ margin: '40px 40px 20px 16px' }}>
          <SightingsDisplay sightings={searchResults} />
        </div>
      </div>
    </div>
  );
}
