import React, { useState } from 'react';

import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import useIndividualSearchSchemas from '../../models/individual/useIndividualSearchSchemas';
import useFilterIndividuals from '../../models/individual/useFilterIndividuals';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import Button from '../../components/Button';
import Text from '../../components/Text';
import IndividualsDisplay from '../../components/dataDisplays/IndividualsDisplay';

const drawerWidth = 280;
const rowsPerPage = 10;

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
  const [page, setPage] = useState(0);
  const [formFilters, setFormFilters] = useState([]);

  const {
    data: searchResults,
    hitCount,
    loading,
    updateFilters,
  } = useFilterIndividuals(formFilters, page, rowsPerPage);

  const schemas = useIndividualSearchSchemas();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useDocumentTitle('EXPLORE_INDIVIDUALS');

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
            formFilters={formFilters}
            setFormFilters={setFormFilters}
            updateFilters={updateFilters}
          />
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer open variant="permanent" PaperProps={paperProps}>
          <FilterPanel
            formFilters={formFilters}
            setFormFilters={setFormFilters}
            updateFilters={updateFilters}
          />
        </Drawer>
      </Hidden>
      <div style={{ marginTop: 64, width: '100%', overflow: 'auto' }}>
        <div
          style={{
            margin: '0 16px 16px 16px',
          }}
        >
          <Text
            variant="h3"
            component="h3"
            style={{ margin: '16px 0' }}
            id="EXPLORE_INDIVIDUALS"
          />
        </div>
        <SearchFilterList
          formFilters={formFilters}
          setFormFilters={setFormFilters}
          updateFilters={updateFilters}
          schema={schemas}
        />
        <Hidden smUp>
          <Button
            style={{ margin: 16 }}
            onClick={() => setMobileDrawerOpen(true)}
            id="SHOW_FILTERS"
          />
        </Hidden>
        <div style={{ margin: '40px 40px 20px 16px' }}>
          <IndividualsDisplay
            individuals={searchResults || []}
            hideFilterSearch
            paginated
            page={page}
            onChangePage={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            loading={loading}
            hitCount={hitCount}
          />
        </div>
      </div>
    </div>
  );
}
