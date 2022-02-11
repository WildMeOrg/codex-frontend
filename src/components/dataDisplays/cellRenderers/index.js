import DefaultRenderer from './DefaultRenderer';
import UserRenderer from './UserRenderer';
import LocationRenderer from './LocationRenderer';
import SpecifiedTimeRenderer from './SpecifiedTimeRenderer';
import DateRenderer from './DateRenderer';
import CapitalizedStringRenderer from './CapitalizedStringRenderer';

export const cellRendererTypes = {
  default: 'default',
  user: 'user',
  location: 'location',
  specifiedTime: 'specifiedTime',
  date: 'date',
  capitalizedString: 'capitalizedString',
};

export const cellRenderers = {
  [cellRendererTypes.default]: DefaultRenderer,
  [cellRendererTypes.user]: UserRenderer,
  [cellRendererTypes.location]: LocationRenderer,
  [cellRendererTypes.specifiedTime]: SpecifiedTimeRenderer,
  [cellRendererTypes.date]: DateRenderer,
  [cellRendererTypes.capitalizedString]: CapitalizedStringRenderer,
};
