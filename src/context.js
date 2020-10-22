import { createContext } from 'react';

export const AppContext = createContext({});
export const setSightingsNeedsFetch = data => ({
  type: 'SET_SIGHTINGS_NEEDS_FETCH',
  data,
});
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

export const setMe = data => ({
  type: 'SET_ME',
  data,
});

export const initialState = {
  me: null,
  siteSettings: null,
  siteSettingsSchema: null,
  siteSettingsNeedsFetch: true,
  sightingsNeedsFetch: true,
};
