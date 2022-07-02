import { get, isObject } from 'lodash-es';
import compareAsc from 'date-fns/compareAsc';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import subHours from 'date-fns/subHours';

const updateLastHourData = (obj, job, dateLimit) => {
  if (!job.time_completed) return;

  const timeCompleted = parse(
    job.time_completed.substring(0, 19),
    'yyyy-MM-dd HH:mm:ss',
    new Date(),
  );
  if (!isValid(timeCompleted)) {
    console.error('Invalid "time_completed" date');
    obj.lastHour.error = true;
    return;
  }

  if (compareAsc(timeCompleted, dateLimit) === -1) return;

  obj.lastHour.totalTurnaroundTime += get(
    job,
    'time_turnaround_sec',
    0,
  );
  obj.lastHour.totalRunTime += get(job, 'time_runtime_sec', 0);
  obj.lastHour.jobsProcessed += 1;
};

const updateTwoWeekData = (obj, job) => {
  obj.twoWeeks.totalTurnaroundTime += get(
    job,
    'time_turnaround_sec',
    0,
  );
  obj.twoWeeks.totalRunTime += get(job, 'time_runtime_sec', 0);
  if (job.time_completed) obj.twoWeeks.jobsProcessed += 1;
  if (['received', 'accepted', 'queued'].includes(job.status)) {
    obj.twoWeeks.jobsInQueue += 1;
  }
};

const categorizeJob = (obj, job) => {
  let category;
  switch (job.status) {
    case 'completed':
      category = 'completed';
      break;
    case 'received':
    case 'accepted':
    case 'queued':
      if (job.endpoint.includes('/api/engine/detect')) {
        category = 'inDetectionQueue';
      } else if (job.endpoint.includes('/api/engine/query'))
        category = 'inIdentificationQueue';
      break;
    case 'working':
    case 'publishing':
      category = 'inProgress';
      break;
    case 'exception':
    case 'suppressed':
    case 'corrupted':
      category = 'error';
      break;
    default:
      break;
  }

  if (obj.byStatus[category]) obj.byStatus[category].push(job);
};

export function getSageJobsStatistics(jobs) {
  const statistics = {
    lastHour: {
      totalTurnaroundTime: 0,
      totalRunTime: 0,
      jobsProcessed: 0,
      error: false,
    },
    twoWeeks: {
      totalTurnaroundTime: 0,
      totalRunTime: 0,
      jobsProcessed: 0,
      jobsInQueue: 0,
    },
    byStatus: {
      inDetectionQueue: [],
      inIdentificationQueue: [],
      error: [],
      completed: [],
      inProgress: [],
    },
  };

  if (!isObject(jobs)) return statistics;

  const oneHourAgo = subHours(Date.now(), 1);

  Object.entries(jobs).forEach(([jobId, job]) => {
    updateLastHourData(statistics, job, oneHourAgo);
    updateTwoWeekData(statistics, job);
    categorizeJob(statistics, { ...job, job_id: jobId });
  });

  return statistics;
}
