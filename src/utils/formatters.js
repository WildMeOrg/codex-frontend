import { get, round, find, some, map } from 'lodash-es';
import { format, formatDistance } from 'date-fns';
import timePrecisionMap from '../constants/timePrecisionMap';

export const isMutuallyRevoked = members => {
  const memberViewStates = map(members, member =>
    get(member, 'viewState'),
  );
  return (
    memberViewStates.filter(viewState => viewState === 'revoked')
      .length === 2
  );
};

export const collabContainsUsers = (collab, user1, user2) => {
  const members = get(collab, 'members');
  if (!members) return true; // err on the side of safety
  return (
    some(members, ['guid', user1]) &&
    some(members, ['guid', user2]) &&
    !isMutuallyRevoked(members)
  );
};

export const collabIsMutuallyRevoked = (collab, user1, user2) => {
  const members = get(collab, 'members');
  if (!members) return true; // err on the side of safety
  return (
    some(members, ['guid', user1]) &&
    some(members, ['guid', user2]) &&
    isMutuallyRevoked(members)
  );
};

export const mutuallyRevokedCollabExists = (
  existingCollaborations,
  user1,
  user2,
) =>
  some(existingCollaborations, collab =>
    collabIsMutuallyRevoked(collab, user1, user2),
  );

export const collaborationAlreadyExists = (
  existingCollaborations,
  user1,
  user2,
) =>
  some(existingCollaborations, collab =>
    collabContainsUsers(collab, user1, user2),
  );

export const formatFilename = (input, characterLimit = 40) => {
  // minimum character limit is 20, otherwise this will need to be redone
  if (!input) return '';
  const inputLength = input.length;
  if (inputLength < characterLimit) return input;
  const tail = input.substring(inputLength - 10, inputLength);
  const head = input.substring(0, characterLimit - 14);
  return `${head}...${tail}`;
};

export const formatDate = (input, fancy = false, fallback = '') => {
  const formatter = fancy ? 'PP' : 'yyyy-MM-dd HH:mm';
  try {
    const jsDate =
      typeof input === 'string' ? new Date(input) : input;
    const formattedDate = format(jsDate, formatter);
    return formattedDate;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

export const formatDateCustom = (input, formatSpecification) => {
  try {
    const jsDate =
      typeof input === 'string' ? new Date(input) : input;
    const formattedDate = format(jsDate, formatSpecification);
    return formattedDate;
  } catch (error) {
    console.error(error);
    return '';
  }
};

export function formatSpecifiedTime(time, timeSpecificity) {
  const formatSpecification = get(
    timePrecisionMap,
    [timeSpecificity, 'intlFormat'],
    'yyyy-MM-dd',
  );
  return formatDateCustom(time, formatSpecification);
}

const elapsedTimeCache = {};
export const getElapsedTimeInWords = (
  durationInSeconds,
  precision = 1,
) => {
  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 60 * 60;
  const SECONDS_PER_DAY = 3600 * 24;

  if (elapsedTimeCache[durationInSeconds])
    return elapsedTimeCache[durationInSeconds];

  let result;
  if (durationInSeconds < SECONDS_PER_MINUTE) {
    result = { value: durationInSeconds, unit: 'second' };
  } else if (
    durationInSeconds >= SECONDS_PER_MINUTE &&
    durationInSeconds < SECONDS_PER_HOUR
  ) {
    result = {
      value: round(durationInSeconds / SECONDS_PER_MINUTE, precision),
      unit: 'minute',
    };
  } else if (
    durationInSeconds >= SECONDS_PER_HOUR &&
    durationInSeconds < SECONDS_PER_DAY
  ) {
    result = {
      value: round(durationInSeconds / SECONDS_PER_HOUR, precision),
      unit: 'hour',
    };
  } else {
    result = {
      value: round(durationInSeconds / SECONDS_PER_DAY, precision),
      unit: 'day',
    };
  }

  elapsedTimeCache[durationInSeconds] = result;
  return result;
};

const possibleErrorPaths = [
  'response.data.message',
  'response.data.message.details',
  'data.message',
  'data.message.details',
];

export const formatError = error => {
  /* You can also throw the server response from a failed Houston
   * request at this thing. */
  const possibleServerErrors = possibleErrorPaths.map(p =>
    get(error, p),
  );
  const serverError = find(possibleServerErrors, e => e);
  const stringError = error instanceof Error && error.toString();
  const errorToPrint = serverError || stringError || error;
  return JSON.stringify(errorToPrint, null, 2);
};

export const formatHoustonTime = possibleTimeObject => {
  try {
    const houstonTime = format(
      possibleTimeObject,
      "yyyy-MM-dd'T'HH:mm:ssxxx",
    ); // ISO 8601 without "Z" timezones.
    return houstonTime;
  } catch (error) {
    console.log(
      'formatHoustonTime: possibleTimeObject not formatable, passing through',
      possibleTimeObject,
    );
    return possibleTimeObject;
  }
};

export const getNumDescendents = targetChoice => {
  let result = 0;
  if (!targetChoice.locationID) return result;
  const childCountsArr = targetChoice.locationID.map(child =>
    getNumDescendents(child),
  );
  result =
    targetChoice.locationID.length +
    childCountsArr.reduce((a, b) => a + b, 0);
  return result;
};

export const collapseChoices = (choices, depth) => {
  const result = choices.map(choice => {
    const numDescendants = getNumDescendents(choice);
    const numDescendantsAsString = numDescendants
      ? ` (${numDescendants})`
      : '';
    if (!choice.locationID) {
      return {
        depth,
        name: choice.name + numDescendantsAsString,
        id: choice.id,
      };
    }
    const subchoices = [
      {
        depth,
        name: choice.name + numDescendantsAsString,
        id: choice.id,
      },
    ];
    subchoices.push(collapseChoices(choice.locationID, depth + 1));
    return subchoices;
  });
  return result.flat(100);
};

export const calculatePrettyTimeElapsedSince = createdDate => {
  let formattedDistance = 'Unknown amount of time';
  try {
    formattedDistance = formatDistance(
      new Date(),
      new Date(createdDate),
    );
  } catch (error) {
    console.log('calculatePrettyTimeElapsedSince not formattable: ');
    console.log(error);
  }
  return (
    formattedDistance.charAt(0).toUpperCase() +
    formattedDistance.slice(1)
  );
};

export const formatLocationFromSighting = (
  sighting,
  regionOpts,
  intl,
) => {
  const currentSightingLocId = get(sighting, 'locationId', '');
  const currentLabelArray = regionOpts
    .filter(
      region => get(region, 'value', '') === currentSightingLocId,
    )
    .map(regionObj =>
      get(
        regionObj,
        'label',
        intl.formatMessage({
          id: 'REGION_NAME_REMOVED',
        }),
      ),
    );
  let currentLabel = null;
  if (currentLabelArray.length > 0)
    currentLabel = currentLabelArray[0];

  const currentSightingVerbatimLoc = get(
    sighting,
    'verbatimLocality',
    '',
  );
  const currentSightingLat = get(sighting, 'decimalLatitude', '');
  const currentSightingLong = get(sighting, 'decimalLongitude', '');
  if (currentSightingLocId && !currentSightingVerbatimLoc) {
    return (
      currentLabel ||
      intl.formatMessage({
        id: 'REGION_NAME_REMOVED',
      })
    );
  }

  if (!currentSightingLocId && currentSightingVerbatimLoc) {
    return currentSightingVerbatimLoc;
  }
  if (
    !currentSightingLocId &&
    !currentSightingVerbatimLoc &&
    currentSightingLat &&
    currentSightingLong
  )
    return intl.formatMessage({ id: 'VIEW_ON_MAP' });

  if (currentSightingLocId && currentSightingVerbatimLoc) {
    return currentLabel
      ? currentLabel + ' (' + currentSightingVerbatimLoc + ')'
      : intl.formatMessage({ id: 'REGION_NAME_REMOVED' });
  }
  return '';
};

export const sanitizeTwitterHandle = value => value.replace(/^@/, '');

export function formatUserMessage(user, intl) {
  const { fullName } = user || {};
  return fullName || intl.formatMessage({ id: 'UNNAMED_USER' });
}
