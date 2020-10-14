import fieldTypes from '../../constants/fieldTypes';
import FileInput from './FileInput';
import FeetMetersInput from './FeetMetersInput';
import IndividualInput from './IndividualInput';
import SelectInput from './SelectInput';
import BooleanInput from './BooleanInput';
import TextInput from './TextInput';
import TreeViewInput from './TreeViewInput';
import LatLongInput from './LatLongInput';
import AreaInput from './AreaInput';
import TreeViewEditor from './TreeViewEditor';
import LocationIdInput from './LocationIdInput';
import ComparatorInput from './ComparatorInput';
import DateInput from './DateInput';
import DateRangeInput from './DateRangeInput';
import RelationshipsInput from './RelationshipsInput';
import ColorInput from './ColorInput';
import CategoryListInput from './CategoryListInput';

const inputMap = {
  [fieldTypes.color]: ColorInput,
  [fieldTypes.latlong]: LatLongInput,
  [fieldTypes.area]: AreaInput,
  [fieldTypes.file]: FileInput,
  [fieldTypes.treeview]: TreeViewInput,
  [fieldTypes.treeeditor]: TreeViewEditor,
  [fieldTypes.locationIds]: LocationIdInput,
  [fieldTypes.individual]: IndividualInput,
  [fieldTypes.comparator]: ComparatorInput,
  [fieldTypes.boolean]: BooleanInput,
  [fieldTypes.select]: SelectInput,
  [fieldTypes.multiselect]: SelectInput,
  [fieldTypes.date]: DateInput,
  [fieldTypes.daterange]: DateRangeInput,
  [fieldTypes.feetmeters]: FeetMetersInput,
  [fieldTypes.relationships]: RelationshipsInput,
  [fieldTypes.string]: TextInput,
  [fieldTypes.longstring]: TextInput,
  [fieldTypes.integer]: TextInput,
  [fieldTypes.float]: TextInput,
  [fieldTypes.categorylist]: CategoryListInput,
};

export default inputMap;
