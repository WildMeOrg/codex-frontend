import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import GeneralSettings from './settings/GeneralSettings';
import SplashSettings from './settings/SplashSettings';
import FieldSettings from './settings/FieldSettings';

export default function SiteSettings() {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'SITE_SETTINGS' }));

  // const [activeTab, setActiveTab] = useState('general');
  const [activeTab, setActiveTab] = useState('fields');
  return (
    <div style={{ marginTop: 20 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newTab) => setActiveTab(newTab)}
        aria-label="simple tabs example"
      >
        <Tab label="General" value="general" />
        <Tab label="Splash page" value="splash" />
        <Tab label="Fields" value="fields" />
      </Tabs>
      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'splash' && <SplashSettings />}
      {activeTab === 'fields' && <FieldSettings />}
    </div>
  );
}
