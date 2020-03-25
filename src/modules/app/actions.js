export const TOGGLE_SIDE_PANEL = 'app/toggleSidePanel';
export const TOGGLE_AUTHENTICATED = 'app/toggleAuthenticated';
export const SET_LOCALE = 'app/setLocale';

export const toggleSidePanel = () => ({
  type: TOGGLE_SIDE_PANEL,
});

export const toggleAuthenticated = () => ({
  type: TOGGLE_SIDE_PANEL,
});

export const setLocale = locale => ({
  type: SET_LOCALE,
  data: locale,
});
