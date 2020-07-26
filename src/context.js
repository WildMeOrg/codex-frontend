import { createContext } from 'react';

export const AppContext = createContext({});
export const setSiteSettingsNeedsFetch = data => ({
  type: 'SET_SITE_SETTINGS_NEEDS_FETCH',
  data,
});
export const setSiteSettingsSchema = data => ({
  type: 'SET_SITE_SETTINGS_SCHEMA',
  data,
});
export const setSiteSettings = data => ({
  type: 'SET_SITE_SETTINGS',
  data,
});

export const initialState = {
  siteSettings: null,
  siteSettingsSchema: null,
  siteSettingsNeedsFetch: true,
};
