import { useMemo } from 'react';
import { get, merge } from 'lodash-es';
import axios from 'axios';
import { useQuery } from 'react-query';

import queryKeys from '../../constants/queryKeys';


export default function useSiteSettings() {
  const settingsSchemaResult = useQuery(
    queryKeys.settingsSchema,
    async () => {
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/definition/main/block`,
        timeout: 2000,
      });
      return get(response, 'data.response.configuration');
    },
    {
      staleTime: Infinity,
    },
  );

  const settingsConfigResult = useQuery(
    queryKeys.settingsConfig,
    async () => {
      const response = await axios(
        `${__houston_url__}/api/v1/site-settings/main/block`,
      );
      return get(response, 'data.response');
    },
    {
      staleTime: Infinity,
    },
  );

  const {
    data: schemaData,
    isLoading: schemaLoading,
    isError: schemaError,
  } = settingsSchemaResult;

  const {
    data: configData,
    isLoading: configLoading,
    isError: configError,
  } = settingsConfigResult;

  const loading = schemaLoading || configLoading;
  const error = schemaError || configError;
  const { version: siteSettingsVersion, configuration } =
    configData || {};

  let data = null;
  if (schemaData && configuration) {
    /* Order of this merge is crucial. Values from the settings object must
     * override values from the schema object. If the order ever needs to be
     * changed for some reason, extensive QA of the RegionEditor component
     * will be necesssary. */
    data = merge(configuration, schemaData);
  }
  console.log('old parsed data', data, siteSettingsVersion, );

  return useMemo(
    () => ({ data, loading, error, siteSettingsVersion }),
    [data, loading, error, siteSettingsVersion],
  );
}
