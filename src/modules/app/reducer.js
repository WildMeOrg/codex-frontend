import {
  TOGGLE_SIDE_PANEL,
  TOGGLE_AUTHENTICATED,
  SET_LOCALE,
  SET_LOGIN_REDIRECT,
} from './actions';

const initialState = {
  locale: 'en',
  authenticated: false,
  sidePanelOpen: false,
  loginRedirect: '/',
};

export function appReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case TOGGLE_SIDE_PANEL:
      return {
        ...state,
        sidePanelOpen: !state.sidePanelOpen,
      };
    case TOGGLE_AUTHENTICATED:
      return {
        ...state,
        authenticated: !state.authenticated,
      };
    case SET_LOCALE:
      return {
        ...state,
        locale: action.data,
      };
    case SET_LOGIN_REDIRECT:
      return {
        ...state,
        loginRedirect: action.data,
      };
    default:
      return state;
  }
}
