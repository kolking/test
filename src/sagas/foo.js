import { select, take, put, all } from 'redux-saga/effects';
import moment from 'moment';
import {
  getSendableFooIds,
  updateFooSendable,
  updateFooSubmitted,
  submitFoo,
  getFooById,
  setError,
  SET_FOO_COMPLETED,
  SET_FOO_SENDABLE,
  SUBMIT_FOO,
} from '../reducers/foo/foo';

export const SUBMISSION_COMPLETE = 'submission/COMPLETE';

export function* handleCompletedFoos() {
  while (true) {
    const { payload: { id }} = yield take(SET_FOO_COMPLETED);
    const foo = yield select(getFooById, id);

    if (foo && foo.completedAt) {
      if (moment(foo.completedAt).diff(moment(foo.createdAt), 'seconds') > 20) {
        yield put(updateFooSendable(id, true));
      } else {
        yield put(setError(id, "You can't complete this so soon!"));
      }
    }
  }
}

export function* submitSendableFoos() {
  while (true) {
    yield take(SET_FOO_SENDABLE);

    const sendableIds = yield select(getSendableFooIds);

    for (let i = 0; i < sendableIds.length; i++) {
      yield put(submitFoo(sendableIds[i]));
      yield take(SUBMISSION_COMPLETE);
    }
  }
}

export function* handleSubmitFoo() {
  while (true) {
    const { payload: { id }} = yield take(SUBMIT_FOO);

    // Some code would go here to make an API request
    // and ensure that the response indicated it was successful
    // For this test, we can assume it was successful

    yield put(updateFooSubmitted(id));
    yield put({ type: SUBMISSION_COMPLETE });
  }
}

export function* registerSagas() {
  yield all([
    handleSubmitFoo(),
    submitSendableFoos(),
    handleCompletedFoos(),
  ]);
}
