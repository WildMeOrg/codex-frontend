export const SET_NEEDS_FETCH = 'site/setNeedsFetch';
export const UPDATE_SITE_SETTINGS = 'site/updateSiteSettings';

export const setNeedsFetch = needsFetch => ({
  type: SET_NEEDS_FETCH,
  needsFetch,
});

export const updateSiteSettings = settings => {
  // axios.put(settings);
  // dispatch(setNeedsFetch(true));
};
