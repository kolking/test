import moment from 'moment';
import { take, put, select } from 'redux-saga/effects';

import * as sagas from '../foo';

import {
  getFooById,
  getSendableFooIds,
  updateFooSubmitted,
  updateFooCompleted,
  updateFooSendable,
  setError,
  submitFoo,
  SUBMIT_FOO,
  SET_FOO_COMPLETED,
  SET_FOO_SENDABLE,
} from '../../reducers/foo/foo';

describe('handleCompletedFoos*', () => {
  const gen = sagas.handleCompletedFoos();

  const foo = {
    id: 'some-id',
    createdAt: moment().toISOString()
  };

  it('should handle valid foo', () => {
    expect(gen.next().value).toEqual(take(SET_FOO_COMPLETED));
    expect(gen.next(updateFooCompleted(foo.id)).value).toEqual(select(getFooById, foo.id));

    const validFoo = {
      ...foo,
      completedAt: moment().add(21, 'seconds').toISOString()
    };

    expect(gen.next(validFoo).value).toEqual(put(updateFooSendable(foo.id, true)));
  });

  it('should handle invalid foo', () => {
    expect(gen.next().value).toEqual(take(SET_FOO_COMPLETED));
    expect(gen.next(updateFooCompleted(foo.id)).value).toEqual(select(getFooById, foo.id));

    const invalidFoo = {
      ...foo,
      completedAt: foo.createdAt,
    };

    expect(gen.next(invalidFoo).value).toEqual(put(setError(foo.id, "You can't complete this so soon!")));
  });

  it('should ignore not existing foo', () => {
    expect(gen.next().value).toEqual(take(SET_FOO_COMPLETED));
    expect(gen.next(updateFooCompleted(foo.id)).value).toEqual(select(getFooById, foo.id));

    expect(gen.next(null).value).toEqual(take(SET_FOO_COMPLETED));
  });
});

describe('submitSendableFoos*', () => {
  const gen = sagas.submitSendableFoos();

  const sendableFoos = [{
    id: 'id-1',
  }, {
    id: 'id-2',
  }];

  it('should handle sendable foos', () => {
    expect(gen.next().value).toEqual(take(SET_FOO_SENDABLE));
    expect(gen.next().value).toEqual(select(getSendableFooIds));

    sendableFoos.forEach((foo, i) => {
      expect(gen.next(i === 0 ? sendableFoos : undefined).value).toEqual(put(submitFoo(foo)));
      expect(gen.next().value).toEqual(take(sagas.SUBMISSION_COMPLETE));
    })
  });
})

describe('handleSubmitFoo*', () => {
  const gen = sagas.handleSubmitFoo();

  it('should handle submit foo', () => {
    const id = 'some-id';

    expect(gen.next().value).toEqual(take(SUBMIT_FOO));
    expect(gen.next(submitFoo(id)).value).toEqual(put(updateFooSubmitted(id)));
    expect(gen.next().value).toEqual(put({ type: sagas.SUBMISSION_COMPLETE }));
  });
})
