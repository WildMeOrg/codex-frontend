import DefaultRenderer from './DefaultRenderer';
import UserRenderer from './UserRenderer';
import LocationRenderer from './LocationRenderer';
import SpecifiedTimeRenderer from './SpecifiedTimeRenderer';
import LastSightingRenderer from './LastSightingRenderer';
import CapitalizedStringRenderer from './CapitalizedStringRenderer';
import DateRenderer from './DateRenderer';

export const cellRendererTypes = {
  default: 'default',
  user: 'user',
  location: 'location',
  specifiedTime: 'specifiedTime',
  lastSighting: 'lastSighting',
  capitalizedString: 'capitalizedString',
  date: 'date',
};

export const cellRenderers = {
  [cellRendererTypes.default]: DefaultRenderer,
  [cellRendererTypes.user]: UserRenderer,
  [cellRendererTypes.location]: LocationRenderer,
  [cellRendererTypes.specifiedTime]: SpecifiedTimeRenderer,
  [cellRendererTypes.lastSighting]: LastSightingRenderer,
  [cellRendererTypes.capitalizedString]: CapitalizedStringRenderer,
  [cellRendererTypes.date]: DateRenderer,
};
