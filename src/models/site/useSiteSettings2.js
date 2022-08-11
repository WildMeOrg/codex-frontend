import { useMemo } from 'react';
import { get, merge } from 'lodash-es';
import axios from 'axios';
import { useQuery } from 'react-query';

import queryKeys from '../../constants/queryKeys';

export default function useSiteSettings() {

  const settingsResult = useQuery(
    queryKeys.settingsSchema,  // Howard so what does this actually achieve? it seems to be a text string. Is it for debug or something?
    async () => {
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/data`,
        timeout: 2000,
      });
      return get(response, 'data');
    },
    {
      staleTime: Infinity,
    },
  );

  // Howard I have no idea why the previous code did this.
  // I strongly suspect this could be improved, probably by using Fetch rather than Query
  const {
    data: settingData,
    loading: settingLoading,
    error: settingError,
  } = settingsResult;


  // Howard If the FE actually uses this for anything, we need to know as it's no longer populated with anything sane now EDM has gone
  // (and it wasn't particularly sane beforehand) 
  const siteSettingsVersion = {};

  // Howard Regard this basically as prototype code. I wanted to prove that this was the same as the 'old parsed data' and I think it is
    
  console.log('new parsed data', settingData , siteSettingsVersion, );
  return useMemo(
    () => ({ settingData, settingLoading, settingError, siteSettingsVersion }),
    [settingData, settingLoading, settingError, siteSettingsVersion],
  );

}
