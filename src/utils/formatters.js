import { get, round } from 'lodash-es';

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

export function formatError(error) {
  /* You can also throw the server response from a failed Houston
   * request at this thing. */
  const serverError = get(error, ['data', 'message', 'details']);
  const stringError = error instanceof Error && error.toString();
  const errorToPrint = serverError || stringError || error;
  return JSON.stringify(errorToPrint, null, 2);
}
