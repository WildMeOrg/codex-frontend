import DefaultRenderer from './DefaultRenderer';
import UserRenderer from './UserRenderer';
import LocationRenderer from './LocationRenderer';
import SpecifiedTimeRenderer from './SpecifiedTimeRenderer';
import CapitalizedStringRenderer from './CapitalizedStringRenderer';
import DateRenderer from './DateRenderer';
import FloatRenderer from './FloatRenderer';
import ViewpointRenderer from './ViewpointRenderer';

export const cellRendererTypes = {
  default: 'default',
  user: 'user',
  location: 'location',
  specifiedTime: 'specifiedTime',
  capitalizedString: 'capitalizedString',
  date: 'date',
  float: 'float',
  viewpoint: 'viewpoint',
};

export const cellRenderers = {
  [cellRendererTypes.default]: DefaultRenderer,
  [cellRendererTypes.user]: UserRenderer,
  [cellRendererTypes.location]: LocationRenderer,
  [cellRendererTypes.specifiedTime]: SpecifiedTimeRenderer,
  [cellRendererTypes.capitalizedString]: CapitalizedStringRenderer,
  [cellRendererTypes.date]: DateRenderer,
  [cellRendererTypes.float]: FloatRenderer,
  [cellRendererTypes.viewpoint]: ViewpointRenderer,
};
