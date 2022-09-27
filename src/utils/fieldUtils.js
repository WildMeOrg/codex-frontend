import { get, pick } from 'lodash-es';
import fieldTypes from '../constants/fieldTypesNew';

import DefaultViewer from '../components/fields/view/DefaultViewer';
import LatLongViewer from '../components/fields/view/LatLongViewer';
import SelectViewer from '../components/fields/view/SelectViewer';
import MultiSelectViewer from '../components/fields/view/MultiSelectViewer';
import DateViewer from '../components/fields/view/DateViewer';
import DateRangeViewer from '../components/fields/view/DateRangeViewer';
import FloatViewer from '../components/fields/view/FloatViewer';
import LocationIdViewer from '../components/fields/view/LocationIdViewer';
import SpecifiedTimeViewer from '../components/fields/view/SpecifiedTimeViewer';

import TextEditor from '../components/fields/edit/TextEditor';
import SelectionEditor from '../components/fields/edit/SelectionEditor';
import LatLongEditor from '../components/fields/edit/LatLongEditor';
import DateEditor from '../components/fields/edit/DateEditor';
import DateRangeEditor from '../components/fields/edit/DateRangeEditor';
import BooleanEditor from '../components/fields/edit/BooleanEditor';
import LocationIdEditor from '../components/fields/edit/LocationIdEditor';
import IndividualEditor from '../components/fields/edit/IndividualEditor';
import FeetMetersEditor from '../components/fields/edit/FeetMetersEditor';
import SpecifiedTimeEditor from '../components/fields/edit/SpecifiedTimeEditor';

export const prototypeFieldSchema = {
  getValue: (schema, backendObject) =>
    get(
      backendObject,
      schema.name,
      get(schema, 'defaultValue', null),
    ),
  customField: false,
  category: null,
  categoryId: null,
  fieldType: null,
  defaultValue: null,
  icon: null,
  choices: null,
  required: false,
  editable: true,
  editComponent: null,
  editComponentProps: {},
  filterable: true,
  filterComponent: null,
  filterComponentProps: {},
  viewable: true,
  viewComponent: DefaultViewer,
  viewComponentProps: {},
};

// add file component
const componentMap = {
  [fieldTypes.string]: {
    defaultValue: '',
    fieldType: fieldTypes.string,
    viewComponent: DefaultViewer,
    editComponent: TextEditor,
    filterComponent: null,
  },
  [fieldTypes.longstring]: {
    defaultValue: '',
    fieldType: fieldTypes.longstring,
    viewComponent: DefaultViewer, // may need to truncate
    editComponent: TextEditor,
    filterComponent: null,
  },
  [fieldTypes.float]: {
    defaultValue: null,
    fieldType: fieldTypes.float,
    viewComponent: FloatViewer,
    editComponent: TextEditor,
    filterComponent: null,
  },
  [fieldTypes.integer]: {
    defaultValue: null,
    fieldType: fieldTypes.integer,
    viewComponent: DefaultViewer,
    editComponent: TextEditor,
    filterComponent: null,
  },
  [fieldTypes.feetmeters]: {
    defaultValue: null,
    fieldType: fieldTypes.feetmeters,
    viewComponent: FloatViewer,
    editComponent: FeetMetersEditor,
    filterComponent: null,
  },
  [fieldTypes.latlong]: {
    defaultValue: [null, null],
    fieldType: fieldTypes.latlong,
    viewComponent: LatLongViewer,
    editComponent: LatLongEditor,
    filterComponent: null,
  },
  [fieldTypes.specifiedTime]: {
    defaultValue: { time: null, timeSpecificity: '' },
    fieldType: fieldTypes.specifiedTime,
    viewComponent: SpecifiedTimeViewer,
    editComponent: SpecifiedTimeEditor,
    filterComponent: null,
  },
  [fieldTypes.date]: {
    defaultValue: null,
    fieldType: fieldTypes.date,
    viewComponent: DateViewer,
    editComponent: DateEditor,
    filterComponent: null,
  },
  [fieldTypes.daterange]: {
    defaultValue: [null, null],
    fieldType: fieldTypes.daterange,
    viewComponent: DateRangeViewer,
    editComponent: DateRangeEditor,
    filterComponent: null,
  },
  [fieldTypes.select]: {
    defaultValue: null,
    fieldType: fieldTypes.select,
    viewComponent: SelectViewer,
    editComponent: SelectionEditor,
    filterComponent: null,
    choices: [],
  },
  [fieldTypes.multiselect]: {
    defaultValue: [],
    fieldType: fieldTypes.multiselect,
    viewComponent: MultiSelectViewer,
    editComponent: SelectionEditor,
    filterComponent: null,
    choices: [],
  },
  [fieldTypes.boolean]: {
    defaultValue: null,
    fieldType: fieldTypes.boolean,
    viewComponent: DefaultViewer,
    viewComponentProps: {
      defaultLabel: 'Value not set',
    },
    editComponent: BooleanEditor,
    filterComponent: null,
  },
  [fieldTypes.locationId]: {
    defaultValue: '',
    fieldType: fieldTypes.locationId,
    viewComponent: LocationIdViewer,
    editComponent: LocationIdEditor,
    filterComponent: null,
  },
  [fieldTypes.individual]: {
    defaultValue: null,
    fieldType: fieldTypes.individual,
    viewComponent: DefaultViewer,
    editComponent: IndividualEditor,
    filterComponent: null,
  },
};

export function createCustomFieldSchema(houstonSchema) {
  const copiedFields = pick(houstonSchema, [
    'id',
    'required',
    'name',
  ]);
  const copiedSchemaFields = pick(houstonSchema.schema, [
    'label',
    'description',
    'choices',
  ]);

  const fieldType = get(houstonSchema, ['schema', 'displayType']);
  const fieldTypeProperties = get(componentMap, fieldType, {});
  const properSchema = {
    ...prototypeFieldSchema,
    ...fieldTypeProperties,
    ...copiedFields,
    ...copiedSchemaFields,
    categoryId: get(houstonSchema, ['schema', 'category']),
    customField: true,
    getValue: (schema, backendObject) =>
      get(
        backendObject,
        ['customFields', schema.id],
        get(schema, 'defaultValue', null),
      ),
  };

  const defaultValue = get(houstonSchema, 'default');
  if (defaultValue) {
    properSchema.defaultValue = defaultValue;
  }

  return properSchema;
}

export function createFieldSchema(fieldType, properties) {
  const fieldTypeProperties = get(componentMap, fieldType, {});

  return {
    ...prototypeFieldSchema,
    ...fieldTypeProperties,
    ...properties,
  };
}
