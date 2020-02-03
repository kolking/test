import moment from 'moment';

export const randomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

export const formatTime = (datetime) => moment(datetime).format('LTS');

export const formatDuration = (begin, end) => {
  const duration = moment.duration(moment(end).diff(moment(begin)));
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return minutes > 0 ? `${minutes}m, ${seconds}s` : `${seconds}s`;
}
