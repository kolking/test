import moment from 'moment';

import reducer, {
  // Action creators
  createFoo,
  setError,
  submitFoo,
  updateFooSendable,
  updateFooSubmitted,
  updateFooCompleted,
  // Actions types
  CREATE_FOO,
  UPDATE_FOO,
  SUBMIT_FOO,
  SET_FOO_SENDABLE,
  SET_FOO_COMPLETED,
  // Selectors
  getAllFoos,
  getFooById,
  getSendableFooIds
} from '../foo';

const now = moment().utc().valueOf();
const spyOnNow = jest.spyOn(Date, 'now').mockReturnValue(now);

const foo1 = {
  id: 'id-1',
  colour: 'red',
  size: 'tiny',
  speed: 'fast',
  createdAt: '2020-01-01T01:01:01Z',
  sendable: false,
  completedAt: null,
  submittedAt: null
};

const foo2 = {
  id: 'id-2',
  colour: 'green',
  size: 'big',
  speed: 'slow',
  createdAt: '2020-02-02T02:02:02Z',
  sendable: false,
  completedAt: null,
  submittedAt: null
};

describe('createFoo', () => {
  it('should dispatch action', () => {
    const id = 'some-id';
    const colour = 'red';
    const size = 'tiny';
    const speed = 'fast';
    const result = createFoo(id, colour, size, speed);
    expect(result).toEqual({
      type: CREATE_FOO,
      payload: {
        id,
        colour,
        size,
        speed,
        createdAt: moment(now).utc().format()
      },
    });
  });
});

describe('updateFooCompleted', () => {
  it('should dispatch action', () => {
    const result = updateFooCompleted('some-id');
    expect(result).toEqual({
      type: SET_FOO_COMPLETED,
      payload: {
        id: 'some-id',
        completedAt: moment(now).utc().format()
      },
    });
  });
});

describe('updateFooSendable', () => {
  it('should dispatch action', () => {
    const id = 'some-id';
    const sendable = true;
    const result = updateFooSendable(id, sendable);
    expect(result).toEqual({
      type: SET_FOO_SENDABLE,
      payload: {
        id,
        sendable,
        errorMessage: undefined
      },
    });
  });
});

describe('updateFooSubmitted', () => {
  it('should dispatch action', () => {
    const id = 'some-id';
    const result = updateFooSubmitted(id);
    expect(result).toEqual({
      type: UPDATE_FOO,
      payload: {
        id,
        sendable: false,
        submittedAt: moment(now).utc().format()
      },
    });
  });
});

describe('submitFoo', () => {
  it('should dispatch action', () => {
    const id = 'some-id';
    const result = submitFoo(id);
    expect(result).toEqual({
      type: SUBMIT_FOO,
      payload: {
        id,
      },
    });
  });
});

describe('setError', () => {
  it('should dispatch action', () => {
    const id = 'some-id';
    const errorMessage = 'Error Message';
    const result = setError(id, errorMessage);
    expect(result).toEqual({
      type: UPDATE_FOO,
      payload: {
        id,
        errorMessage
      },
    });
  });
});

describe('reducer', () => {
  let initialState;

  beforeAll(() => {
    initialState = reducer(undefined, {});
  });

  it('should have initial state', () => {
    expect(initialState).toEqual({
      allIds: [],
      byId: {},
    });
  });

  describe('foo/CREATE_FOO', () => {
    it('should create foo', () => {
      spyOnNow.mockReturnValueOnce(new Date(foo1.createdAt).getTime());
      spyOnNow.mockReturnValueOnce(new Date(foo2.createdAt).getTime());
      const action1 = createFoo(foo1.id, foo1.colour, foo1.size, foo1.speed);
      const action2 = createFoo(foo2.id, foo2.colour, foo2.size, foo2.speed);
      const nextState = reducer(initialState, action1);
      expect(nextState).toEqual({
        allIds: [foo1.id],
        byId: {
          [foo1.id]: foo1
        }
      });
      expect(reducer(nextState, action2)).toEqual({
        allIds: [foo1.id, foo2.id],
        byId: {
          [foo1.id]: foo1,
          [foo2.id]: foo2,
        }
      });
    });
  });

  describe('foo/SET_FOO_COMPLETED', () => {
    it('should set completedAt', () => {
      const state = {
        allIds: [foo1.id, foo2.id],
        byId: {
          [foo1.id]: foo1,
          [foo2.id]: foo2,
        }
      };
      const nextState = reducer(state, updateFooCompleted(foo2.id));
      expect(nextState).toEqual({
        allIds: [foo1.id, foo2.id],
        byId: {
          [foo1.id]: foo1,
          [foo2.id]: {
            ...foo2,
            completedAt: moment(now).utc().format(),
          }
        }
      });
    });
  });

  describe('foo/SET_FOO_SENDABLE', () => {
    it('should set sendable', () => {
      const state = {
        allIds: [foo1.id, foo2.id],
        byId: {
          [foo1.id]: foo1,
          [foo2.id]: foo2,
        }
      };
      const nextState = reducer(state, updateFooSendable(foo2.id, true));
      expect(nextState).toEqual({
        allIds: [foo1.id, foo2.id],
        byId: {
          [foo1.id]: foo1,
          [foo2.id]: {
            ...foo2,
            sendable: true,
            errorMessage: undefined
          }
        }
      });
    });
  });

  describe('foo/UPDATE_FOO', () => {
    it('should update foo', () => {
      const state = {
        allIds: [foo1.id, foo2.id],
        byId: {
          [foo1.id]: foo1,
          [foo2.id]: foo2,
        }
      };
      const payload = {
        ...foo2,
        colour: 'blue',
        size: 'tiny',
        speed: 'very fast'
      };
      const nextState = reducer(state, { type: UPDATE_FOO, payload });
      expect(nextState).toEqual({
        allIds: [foo1.id, foo2.id],
        byId: {
          [foo1.id]: foo1,
          [foo2.id]: {
            ...foo2,
            ...payload,
          }
        }
      });
    });

    it('should ignore not existing foo', () => {
      expect(reducer(initialState, { type: UPDATE_FOO, payload: foo1 })).toBe(initialState);
    });
  });
});

describe('selectors', () => {
  describe('getAllFoos', () => {
    const state = {
      allIds: [foo1.id, foo2.id],
      byId: {
        [foo1.id]: foo1,
        [foo2.id]: foo2,
      }
    };

    it('should return all foos', () => {
      expect(getAllFoos({ foo: state })).toEqual([foo1, foo2]);
    });
  });

  describe('getFooById', () => {
    const state = {
      allIds: [foo1.id, foo2.id],
      byId: {
        [foo1.id]: foo1,
        [foo2.id]: foo2,
      }
    };

    it('should return foo by id', () => {
      expect(getFooById({ foo: state }, foo1.id)).toBe(foo1);
      expect(getFooById({ foo: state }, foo2.id)).toBe(foo2);
    });
  });

  describe('getSendableFooIds', () => {
    const state = {
      allIds: [foo1.id, foo2.id],
      byId: {
        [foo1.id]: foo1,
        [foo2.id]: { ...foo2, sendable: true }
      }
    };

    it('should return sendable foos', () => {
      expect(getSendableFooIds({ foo: state })).toEqual([foo2.id]);
    });
  });
});
