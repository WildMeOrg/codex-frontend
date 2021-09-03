import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import useFilterIndividuals from '../../models/individual/useFilterIndividuals';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import FilterPanel from '../../components/FilterPanel';
import SearchFilterList from '../../components/SearchFilterList';
import {
  selectIndividualSearchCategories,
  selectIndividualSearchSchema,
} from '../../modules/individuals/selectors';
import Button from '../../components/Button';
import Text from '../../components/Text';
import IndividualsDisplay from '../../components/dataDisplays/IndividualsDisplay';

const drawerWidth = 280;
const rowsPerPage = 5;

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
  const intl = useIntl();
  const [page, setPage] = useState(0);

  const {
    data: searchResults,
    loading,
    error,
  } = useFilterIndividuals([], 0);

  const categories = useSelector(selectIndividualSearchCategories);
  const schema = useSelector(selectIndividualSearchSchema);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [formValues, setFormValues] = useState(
    schema.reduce((memo, filter) => {
      memo[filter.name] = filter.defaultValue;
      return memo;
    }, {}),
  );

  useDocumentTitle(intl.formatMessage({ id: 'EXPLORE_INDIVIDUALS' }));

  /* not fetching from API because API is not ready */

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
          formValues={formValues}
          setFormValues={setFormValues}
          schema={schema}
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
            paginated
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
