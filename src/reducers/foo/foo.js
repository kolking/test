import moment from 'moment';

export const UPDATE_FOO = 'foo/UPDATE';
export const CREATE_FOO = 'foo/CREATE';
export const SUBMIT_FOO = 'foo/SUBMIT';
export const SET_FOO_SENDABLE = 'foo/SET_SENDABLE';
export const SET_FOO_COMPLETED = 'foo/SET_FOO_COMPLETED';

const momentNow = () => moment().utc().format();

const initialState = {
  byId: {},
  allIds: [],
};

export const createFoo = (id, colour, size, speed) => {
  const createdAt = momentNow();

  return {
    type: CREATE_FOO,
    payload: {
      id,
      colour,
      size,
      speed,
      createdAt,
    },
  };
};

export const updateFooCompleted = (id) => {
  const completedAt = momentNow();

  return {
    type: SET_FOO_COMPLETED,
    payload: {
      id,
      completedAt,
    },
  };
};

export const updateFooSendable = (id, sendable) => ({
  type: SET_FOO_SENDABLE,
  payload: {
    id,
    sendable,
    errorMessage: undefined,
  },
});

export const updateFooSubmitted = (id) => {
  const submittedAt = momentNow();

  return {
    type: UPDATE_FOO,
    payload: {
      id,
      sendable: false,
      submittedAt,
    },
  };
};

export const submitFoo = (id) => ({
  type: SUBMIT_FOO,
  payload: {
    id,
  },
})

export const setError = (id, errorMessage) => ({
  type: UPDATE_FOO,
  payload: {
    id,
    errorMessage,
  },
});

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case CREATE_FOO: {
      const { id, colour, size, speed, createdAt} = action.payload;

      return ({
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            id,
            colour,
            size,
            speed,
            createdAt,
            sendable: false,
            completedAt: null,
            submittedAt: null,
          }
        },
        allIds: Array.from(new Set([...state.allIds, id]))
      });
    }

    case SET_FOO_SENDABLE:
    case SET_FOO_COMPLETED:
    case UPDATE_FOO: {
      const { payload } = action;
      const { id } = payload;
      const foo = state.byId[id];

      if (!foo) {
        return state;
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: {
            ...foo,
            ...payload,
          },
        },
      };
    }

    default: return state;
  }
}

// Selectors
export const getAllFoos = (state) => state.foo.allIds.map((id) => (
  state.foo.byId[id]
));
export const getFooById = (state, id) => state.foo.byId[id];
export const getSendableFooIds = (state) => state.foo.allIds.filter((id) => (
  state.foo.byId[id].sendable
));
