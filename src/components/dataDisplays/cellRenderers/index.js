import DefaultRenderer from './DefaultRenderer';
import UserRenderer from './UserRenderer';
import LocationRenderer from './LocationRenderer';
import SpecifiedTimeRenderer from './SpecifiedTimeRenderer';

export const cellRendererTypes = {
  default: 'default',
  user: 'user',
  location: 'location',
  specifiedTime: 'specifiedTime',
};

export const cellRenderers = {
  [cellRendererTypes.default]: DefaultRenderer,
  [cellRendererTypes.user]: UserRenderer,
  [cellRendererTypes.location]: LocationRenderer,
  [cellRendererTypes.specifiedTime]: SpecifiedTimeRenderer,
};
