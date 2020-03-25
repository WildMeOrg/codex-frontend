import PropTypes from 'prop-types';

export const ChildrenPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.func,
  PropTypes.object,
]);
