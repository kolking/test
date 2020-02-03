import moment from 'moment';

import { formatDuration } from '../helpers';

describe('formatDuration', () => {
  it('should display duration shorter than a minute', () => {
    const begin = moment();
    const end = moment().add(5, 'seconds');

    expect(formatDuration(begin, end)).toEqual('5s');
  })

  it('should display duration longer than a minute', () => {
    const begin = moment();
    const end = moment().add(95, 'seconds');

    expect(formatDuration(begin, end)).toEqual('1m, 35s');
  })
})
