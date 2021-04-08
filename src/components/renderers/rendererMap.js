import fieldTypes from '../../constants/fieldTypes';
import DateRenderer from './DateRenderer';
import GpsRenderer from './GpsRenderer';
import LocationIdRenderer from './LocationIdRenderer';
// import TaxonomyRenderer from './TaxonomyRenderer';
import DefaultRenderer from './DefaultRenderer';

const inputMap = {
  [fieldTypes.color]: DefaultRenderer,
  [fieldTypes.latlong]: GpsRenderer,
  [fieldTypes.area]: DefaultRenderer,
  [fieldTypes.file]: DefaultRenderer,
  [fieldTypes.treeview]: DefaultRenderer,
  [fieldTypes.locationIds]: LocationIdRenderer,
  [fieldTypes.individual]: DefaultRenderer,
  [fieldTypes.comparator]: DefaultRenderer,
  [fieldTypes.boolean]: DefaultRenderer,
  [fieldTypes.select]: DefaultRenderer,
  [fieldTypes.multiselect]: DefaultRenderer,
  [fieldTypes.date]: DateRenderer,
  [fieldTypes.daterange]: DefaultRenderer,
  [fieldTypes.feetmeters]: DefaultRenderer,
  [fieldTypes.relationships]: DefaultRenderer,
  [fieldTypes.string]: DefaultRenderer,
  [fieldTypes.longstring]: DefaultRenderer,
  [fieldTypes.password]: DefaultRenderer,
  [fieldTypes.integer]: DefaultRenderer,
  [fieldTypes.float]: DefaultRenderer,
  [fieldTypes.categorylist]: DefaultRenderer,
  [fieldTypes.projectId]: DefaultRenderer,
};

export default inputMap;
