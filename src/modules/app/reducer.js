import {
  TOGGLE_SIDE_PANEL,
  TOGGLE_AUTHENTICATED,
  SET_LOCALE,
} from './actions';

const initialState = {
  locale: 'en',
  authenticated: false,
  sidePanelOpen: false,
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
    default:
      return state;
  }
}
