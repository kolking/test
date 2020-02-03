import { connect } from 'react-redux';
import { getAllFoos, createFoo, updateFooCompleted } from '../../reducers/foo/foo';
import FooList from '../../components/FooList';

const mapStateToProps = (state) => ({
  fooList: getAllFoos(state),
});

const mapDispatchToProps = {
  createFoo,
  updateFooCompleted,
};

export default connect(mapStateToProps, mapDispatchToProps)(FooList);