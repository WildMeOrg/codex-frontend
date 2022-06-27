import React, { useState } from 'react';

import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import useDocumentTitle from '../hooks/useDocumentTitle';
import Button from './Button';
import Text from './Text';

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

export default function SearchPage({
  titleId,
  filterPanel,
  searchFilterList,
  children,
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useDocumentTitle(titleId);

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
          {filterPanel}
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer open variant="permanent" PaperProps={paperProps}>
          {filterPanel}
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
            id={titleId}
          />
        </div>
        {searchFilterList}
        <Hidden smUp>
          <Button
            style={{ margin: 16 }}
            onClick={() => setMobileDrawerOpen(true)}
            id="SHOW_FILTERS"
          />
        </Hidden>
        <div style={{ margin: '40px 40px 20px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
