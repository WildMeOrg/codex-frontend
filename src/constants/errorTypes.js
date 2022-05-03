import nature from '../assets/nature.jpg';
import savanna from '../assets/savanna.jpeg';

const errorTypes = {
  notFound: 'notFound',
  noPermissions: 'noPermissions',
  notAuthenticated: 'notAuthenticated',
  serverError: 'serverError',
  genericError: 'genericError',
};

export const errorSchemas = {
  [errorTypes.genericError]: {
    photo: nature,
    photoUrl: 'https://unsplash.com/photos/-f0YLss50Bs',
    artistName: 'Kunal Shinde',
    artistUrl: 'https://unsplash.com/@editholic7',
    subtitleId: 'AN_ERROR_OCCURRED',
    descriptionId: 'UNKNOWN_ERROR_DESCRIPTION',
  },
  [errorTypes.serverError]: {
    photo: nature,
    photoUrl: 'https://unsplash.com/photos/-f0YLss50Bs',
    artistName: 'Kunal Shinde',
    artistUrl:
      'https://unsplash.com/@editholic7' /* This error is intentionally not translated. It can occur outside of the react-intl context. */,
    subtitle: 'Server unavailable',
    description:
      'The server could not be reached. Unfortunately, normal site functionality is currently unavailable. Check back at a later date or try refreshing the page.',
  },
  [errorTypes.notFound]: {
    photo: savanna,
    photoUrl: 'https://unsplash.com/photos/92MgFhlWD-8',
    artistName: 'David Clode',
    artistUrl: 'https://unsplash.com/@davidclode',
    title: '404',
    subtitleId: 'PAGE_NOT_FOUND',
    descriptionId: '404_DETAILS',
  },
  [errorTypes.noPermissions]: {
    photo: savanna,
    photoUrl: 'https://unsplash.com/photos/92MgFhlWD-8',
    artistName: 'David Clode',
    artistUrl: 'https://unsplash.com/@davidclode',
    subtitleId: 'NO_PERMISSIONS_ERROR_SUBTITLE',
    descriptionId: 'NO_PERMISSIONS_ERROR_DETAILS',
  },
  [errorTypes.notAuthenticated]: {
    photo: savanna,
    photoUrl: 'https://unsplash.com/photos/92MgFhlWD-8',
    artistName: 'David Clode',
    artistUrl: 'https://unsplash.com/@davidclode',
    subtitleId: 'NOT_AUTHENTICATED_ERROR_SUBTITLE',
    descriptionId: 'NOT_AUTHENTICATED_ERROR_DETAILS',
  },
};

export default errorTypes;
