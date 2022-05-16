import { isFinite } from 'lodash-es';
import {
  formatDuration,
  intervalToDuration,
  secondsToMilliseconds,
} from 'date-fns';

import { progressStatus } from '../constants/progress';

const labelIds = {
  [progressStatus.created]: 'PROGRESS_STATUS_QUEUED',
  [progressStatus.healthy]: 'PROGRESS_STATUS_PROCESSING',
  [progressStatus.completed]: 'PROGRESS_STATUS_COMPLETE',
  [progressStatus.cancelled]: 'PROGRESS_STATUS_CANCELLED',
  [progressStatus.failed]: 'PROGRESS_STATUS_FAILED',
};

function formatStatus(intl, status) {
  const labelId = labelIds[status];
  if (!labelId) return '';
  return intl.formatMessage({ id: labelId });
}

function formatAhead(intl, ahead) {
  if (!isFinite(ahead)) return '';

  return intl.formatMessage(
    { id: 'PROGRESS_QUEUED_BEHIND_JOBS' },
    { jobCount: ahead },
  );
}

// eta is in fractional seconds.
function formatEta(intl, eta) {
  if (eta === null) {
    return intl.formatMessage({
      id: 'PROGRESS_CALCULATING_TIME_REMAINING',
    });
  }

  if (!isFinite(eta)) return '';

  if (eta < 1) {
    return intl.formatMessage({ id: 'PROGRESS_WRAPPING_UP' });
  }

  const interval = {
    start: 0,
    end: secondsToMilliseconds(eta),
  };

  const duration = intervalToDuration(interval);
  const formattedDuration = formatDuration(duration);

  return intl.formatMessage(
    { id: 'PROGRESS_TIME_LEFT' },
    { timeRemaining: formattedDuration },
  );
}

export function formatProgressMetrics(intl, metrics = {}) {
  const { ahead, status, eta } = metrics;
  const aheadMessage = formatAhead(intl, ahead);

  const statusMessage =
    aheadMessage && status === progressStatus.created
      ? ''
      : formatStatus(intl, status);

  const etaMessage = formatEta(intl, eta);

  const formattedMetrics = [
    statusMessage,
    aheadMessage,
    etaMessage,
  ].filter(message => message);

  return formattedMetrics.join(' · ');
}

export function isProgressResolved(queryData, error) {
  return queryData?.complete || error?.statusCode === 404;
}

export function isProgressRejected(queryData, error) {
  const isError = error && error.statusCode !== 404;
  const { status } = queryData || {};

  return (
    isError ||
    status === progressStatus.failed ||
    status === progressStatus.cancelled
  );
}

export function isProgressSettled(queryData, error) {
  return (
    isProgressResolved(queryData, error) ||
    isProgressRejected(queryData, error)
  );
}
