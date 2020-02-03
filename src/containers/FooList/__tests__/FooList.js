import FooList from '../../../components/FooList';

const connect = jest.fn(() => Component => Component);

jest.doMock('react-redux', () => ({
  connect,
}));

const createFoo = jest.fn();
const getAllFoos = jest.fn();
const updateFooCompleted = jest.fn();

jest.doMock('../../../reducers/foo/foo', () => ({
  createFoo,
  getAllFoos,
  updateFooCompleted
}));

/**
 * Under test
 */
const { default: ConnectedFooList } = jest.requireActual('../FooList');

const foo = {
  id: 'id-1',
  colour: 'red',
  size: 'tiny',
  speed: 'fast',
  createdAt: '2020-20-20T02:02:02Z',
  sendable: false,
  completedAt: null,
  submittedAt: null
};

it('should connect to redux', () => {
  expect(ConnectedFooList).toBe(FooList);
  expect(connect).toHaveBeenCalledTimes(1);
  expect(connect).toBeCalledWith(expect.any(Function), {
    createFoo,
    updateFooCompleted
  });
});

it('should map state to props', () => {
  const [mapStateToProps] = connect.mock.calls[0];

  const state = {
    foo: {
      allIds: [],
      byId: {}
    }
  };

  const fooList = [foo];

  getAllFoos.mockReturnValueOnce(fooList);

  expect(mapStateToProps(state)).toEqual({ fooList });
  expect(getAllFoos).toBeCalledWith(state);
});
