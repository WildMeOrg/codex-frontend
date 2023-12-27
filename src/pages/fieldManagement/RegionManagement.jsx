import React, { useEffect, useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import MainColumn from '../../components/MainColumn';
import TreeEditor from './settings/defaultFieldComponents/TreeEditor';
import useSiteSettings from '../../models/site/useSiteSettings';
import Button from '../../components/Button';
import Text from '../../components/Text';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import usePutSiteSetting from '../../models/site/usePutSiteSetting';
import CustomAlert from '../../components/Alert';

function getInitialFormState(siteSettings) {
  const regions = get(
    siteSettings,
    ['site.custom.regions', 'value'],
    [],
  );
  const species = get(siteSettings, ['site.species', 'value'], []);
  const relationships = get(
    siteSettings,
    ['relationship_type_roles', 'value'],
    [],
  );
  const socialGroups = get(
    siteSettings,
    ['social_group_roles', 'value'],
    [],
  );

  return { regions, species, relationships, socialGroups };
}

export default function RegionManagement() {
  const [formSettings, setFormSettings] = useState(null);
  const { data: siteSettings } = useSiteSettings();
  const history = useHistory();

  const {
    mutate: putSiteSetting,
    error: putError,
    loading,
    clearError,
  } = usePutSiteSetting();

  const onClose = () => {
    clearError();
    history.push('/settings/fields');
  };

  useEffect(
    () => setFormSettings(getInitialFormState(siteSettings)),
    [siteSettings],
  );

  const tree = get(formSettings, ['regions', 'locationID'], []);

  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="MANAGE_REGIONS"
      />
      <SettingsBreadcrumbs currentPageTextId="MANAGE_REGIONS" />
      <TreeEditor
        schema={{ labelId: 'REGIONS' }}
        value={tree}
        onChange={locationID => {
          const newRegions = {
            ...get(formSettings, 'regions', {}),
            locationID,
          };
          setFormSettings({
            ...formSettings,
            regions: newRegions,
          });
        }}
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0px 24px 24px 24px',
          marginTop: 54,
        }}
      >
        <Button
          display="tertiary"
          style={{ marginRight: 12 }}
          loading={loading}
          onClick={async () => {
            onClose();
            setFormSettings(getInitialFormState(siteSettings));
          }}
        >
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button
          display="primary"
          onClick={async () => {
            const response = await putSiteSetting({
              property: 'site.custom.regions',
              data: formSettings.regions,
            });
            if (response?.status === 200) {
              onClose();
            }
          }}
        >
          <FormattedMessage id="FINISH" />
        </Button>
      </div>
      <div>
        {putError ? (
          <CustomAlert
            style={{ margin: '20px 0 12px 0', maxWidth: 600 }}
            severity="error"
            description={putError}
          />
        ) : null}
      </div>
    </MainColumn>
  );
}
