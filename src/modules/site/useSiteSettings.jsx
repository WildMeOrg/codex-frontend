import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectSiteSettingsNeedsFetch } from './selectors';
import getAxiosResponse from '../../utils/getAxiosResponse';

export default function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [siteSettingsSchema, setSiteSettingsSchema] = useState(null);
  const [error, setError] = useState(null);

  const needsFetch = useSelector(selectSiteSettingsNeedsFetch);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schemaPacket = await axios(
          'https://nextgen.dev-wildbook.org/api/v0/configurationDefinition/__bundle_setup',
        );
        setSiteSettingsSchema(getAxiosResponse(schemaPacket));
      } catch (fetchError) {
        setError(fetchError);
        console.error('Error fetching site settings');
        console.error(fetchError);
      }
    };

    fetchData();
  }, []);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const setingsPacket = await axios(
            'https://nextgen.dev-wildbook.org/api/v0/configuration/__bundle_setup',
          );
          setSiteSettings(getAxiosResponse(setingsPacket));
        } catch (fetchError) {
          setError(fetchError);
          console.error('Error fetching site settings');
          console.error(fetchError);
        }
      };

      if (needsFetch) fetchData();
    },
    [needsFetch],
  );

  let mergedSettings = null;
  if (siteSettings && siteSettingsSchema) {
    mergedSettings = [];
    siteSettings.forEach(setting => {
      const matchingSchema = siteSettingsSchema.find(
        schema => schema.configurationId === setting.id,
      );
      mergedSettings.push({ ...setting, ...matchingSchema });
    });
  }

  return [mergedSettings, error];
}
