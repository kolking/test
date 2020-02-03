import React from 'react';
import TestRenderer from 'react-test-renderer';

/**
 * Under test
 */
import App from '../App';

const createElement = props => <App {...props} />;
const createRenderer = props => TestRenderer.create(createElement(props));

it('should render normally', done => {
  const tree = createRenderer({});

  setImmediate(() => {
    expect(tree).toMatchSnapshot();

    done();
  });
});
