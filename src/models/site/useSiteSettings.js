import { useContext, useEffect, useState } from 'react';
import { merge } from 'lodash-es';
import axios from 'axios';
import getAxiosResponse from '../../utils/getAxiosResponse';
import getResponseVersion from '../../utils/getResponseVersion';
import { formatError } from '../../utils/formatters';
import {
  AppContext,
  setSiteSettingsNeedsFetch,
  setSiteSettingsSchema,
  setSiteSettingsVersion,
  setSiteSettings,
  setSiteSettingsSchemaNeedsFetch,
} from '../../context';

export default function useSiteSettings() {
  const { state, dispatch } = useContext(AppContext);
  const {
    siteSettings,
    siteSettingsSchema,
    siteSettingsVersion,
    siteSettingsNeedsFetch,
    siteSettingsSchemaNeedsFetch,
  } = state;

  const [error, setError] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(
    siteSettingsNeedsFetch,
  );
  const [schemaLoading, setSchemaLoading] = useState(
    siteSettingsSchemaNeedsFetch,
  );

  const loading = settingsLoading || schemaLoading;

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          console.log('got here');
          const schemaPacket = await axios({
            url: `${__houston_url__}/api/v1/configurationDefinition/default/__bundle_setup`,
            timeout: 2000,
          });
          dispatch(setSiteSettingsSchemaNeedsFetch(false));
          dispatch(
            setSiteSettingsSchema(getAxiosResponse(schemaPacket)),
          );
          console.log('reached the end');
          setSchemaLoading(false);
        } catch (fetchError) {
          setError(formatError(fetchError));
          setSchemaLoading(false);
          console.error('Error fetching site settings schema');
          console.error(fetchError);
        }
      };

      if (siteSettingsSchemaNeedsFetch) fetchData();
    },
    [siteSettingsSchemaNeedsFetch],
  );

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const settingsPacket = await axios(
            `${__houston_url__}/api/v1/configuration/default/__bundle_setup`,
          );
          const responseVersion = getResponseVersion(settingsPacket);
          const axiosResponse = getAxiosResponse(settingsPacket);
          if (!responseVersion || !axiosResponse)
            throw Error('Axios response was unreadable.');
          dispatch(setSiteSettingsVersion(responseVersion));
          dispatch(setSiteSettings(axiosResponse));
          dispatch(setSiteSettingsNeedsFetch(false));
          setSettingsLoading(false);
        } catch (fetchError) {
          setError(formatError(fetchError));
          setSettingsLoading(false);
          console.error('Error fetching site settings');
          console.error(fetchError);
        }
      };

      if (siteSettingsNeedsFetch) fetchData();
    },
    [siteSettingsNeedsFetch],
  );

  let data = null;
  if (siteSettings && siteSettingsSchema) {
    /* Order of this merge is crucial. Values from the settings object must
     * override values from the schema object. If the order ever needs to be
     * changed for some reason, extensive QA of the RegionEditor component
     * will be necesssary. */
    data = merge(siteSettings, siteSettingsSchema);
  }

  return { data, loading, error, siteSettingsVersion };
}
