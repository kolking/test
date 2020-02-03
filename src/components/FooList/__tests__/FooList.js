import React from 'react';
import TestRenderer from 'react-test-renderer';

/**
 * Under test
 */
import FooList from '../FooList';

const createElement = (props) => <FooList {...props} />;
const createRenderer = (props) => TestRenderer.create(createElement(props));

const fooList = [
  {
    id: 'uno',
    colour: 'red',
    size: 'big',
    speed: 'fast',
    createdAt: '2020-01-01T01:01:01Z',
  },
  {
    id: 'dos',
    colour: 'green',
    size: 'small',
    speed: 'slow',
    createdAt: '2020-02-02T02:02:02Z',
  },
  {
    id: 'tres',
    colour: 'blue',
    size: 'medium',
    speed: 'very fast',
    createdAt: '2020-03-03T03:03:03Z',
  },
];

it('should render empty list', () => {
  expect(createRenderer({})).toMatchSnapshot();
});

it('should render list of foos', () => {
  expect(createRenderer({ fooList })).toMatchSnapshot();
});

it('should call createFoo', () => {
  const createFoo = jest.fn();
  const tree = createRenderer({ createFoo });
  const button = tree.root.findAllByType('button')[0];

  button.props.onClick();

  expect(createFoo).toBeCalled();
});

it('should call toggleCompleteFoo', () => {
  const toggleCompleteFoo = jest.fn();
  const tree = createRenderer({ fooList, toggleCompleteFoo });
  const button = tree.root.findAllByType('button')[1];

  button.props.onClick();

  expect(toggleCompleteFoo).toBeCalled();
});
