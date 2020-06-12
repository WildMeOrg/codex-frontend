export const TOGGLE_SIDE_PANEL = 'app/toggleSidePanel';
export const TOGGLE_AUTHENTICATED = 'app/toggleAuthenticated';
export const SET_LOCALE = 'app/setLocale';
export const SET_LOGIN_REDIRECT = 'app/setLoginRedirect';

export const toggleSidePanel = () => ({
  type: TOGGLE_SIDE_PANEL,
});

export const toggleAuthenticated = () => ({
  type: TOGGLE_AUTHENTICATED,
});

export const setLocale = locale => ({
  type: SET_LOCALE,
  data: locale,
});

export const setLoginRedirect = url => ({
  type: SET_LOGIN_REDIRECT,
  data: url,
});
