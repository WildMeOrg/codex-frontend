import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import MainColumn from '../../components/MainColumn';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import SiteSettings from './SiteSettings';

export default function Administration() {
  /* eslint-disable */
  const unusedVariable = useParams(); // hack to enable rerender on route changes
  /* eslint-enable */

  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'ADMINISTRATION' }));
  const activeTab = window.location.hash || '#settings';

  return (
    <MainColumn>
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        <FormattedMessage id="ADMINISTRATION" />
      </Typography>
      <Tabs
        value={activeTab.replace('#', '')}
        onChange={(_, newValue) => {
          window.location.hash = newValue;
        }}
      >
        <Tab
          label={<FormattedMessage id="SETTINGS" />}
          value="settings"
        />
        <Tab label={<FormattedMessage id="JOBS" />} value="jobs" />
        <Tab
          label={<FormattedMessage id="ACTIONS" />}
          value="actions"
        />
        <Tab label={<FormattedMessage id="LOGS" />} value="logs" />
      </Tabs>
      {activeTab === '#settings' && <SiteSettings />}
      {activeTab === '#jobs' && <div>Jobs</div>}
      {activeTab === '#actions' && <div>Actions</div>}
      {activeTab === '#logs' && <div>Logs</div>}
    </MainColumn>
  );
}
