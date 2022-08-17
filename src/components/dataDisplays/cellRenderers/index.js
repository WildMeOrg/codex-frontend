import DefaultRenderer from './DefaultRenderer';
import ActionGroupRenderer from './ActionGroupRenderer';
import UserRenderer from './UserRenderer';
import LocationRenderer from './LocationRenderer';
import SpecifiedTimeRenderer from './SpecifiedTimeRenderer';
import CapitalizedStringRenderer from './CapitalizedStringRenderer';
import DateRenderer from './DateRenderer';
import FloatRenderer from './FloatRenderer';
import ViewpointRenderer from './ViewpointRenderer';
import SpeciesRenderer from './SpeciesRenderer';
import SocialGroupRoleRenderer from './SocialGroupRoleRenderer';

export const cellRendererTypes = {
  default: 'default',
  actionGroup: 'actionGroup',
  user: 'user',
  location: 'location',
  specifiedTime: 'specifiedTime',
  capitalizedString: 'capitalizedString',
  date: 'date',
  float: 'float',
  viewpoint: 'viewpoint',
  species: 'species',
  socialGroupRole: 'socialGroupRole',
};

export const cellRenderers = {
  [cellRendererTypes.default]: DefaultRenderer,
  [cellRendererTypes.actionGroup]: ActionGroupRenderer,
  [cellRendererTypes.user]: UserRenderer,
  [cellRendererTypes.location]: LocationRenderer,
  [cellRendererTypes.specifiedTime]: SpecifiedTimeRenderer,
  [cellRendererTypes.capitalizedString]: CapitalizedStringRenderer,
  [cellRendererTypes.date]: DateRenderer,
  [cellRendererTypes.float]: FloatRenderer,
  [cellRendererTypes.viewpoint]: ViewpointRenderer,
  [cellRendererTypes.species]: SpeciesRenderer,
  [cellRendererTypes.socialGroupRole]: SocialGroupRoleRenderer,
};
