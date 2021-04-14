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

import TextEditor from '../components/fields/edit/TextEditor';
import SelectionEditor from '../components/fields/edit/SelectionEditor';
import LatLongEditor from '../components/fields/edit/LatLongEditor';
import DateEditor from '../components/fields/edit/DateEditor';
import DateRangeEditor from '../components/fields/edit/DateRangeEditor';
import BooleanEditor from '../components/fields/edit/BooleanEditor';
import LocationIdEditor from '../components/fields/edit/LocationIdEditor';

export const prototypeFieldSchema = {
  getValue: (schema, backendObject) =>
    get(
      backendObject,
      [schema.name],
      get(schema, 'defaultValue', null),
    ),
  customField: false,
  defaultValue: null,
  icon: null,
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

const componentMap = {
  [fieldTypes.string]: {
    defaultValue: '',
    viewComponent: DefaultViewer,
    editComponent: TextEditor,
    editComponentProps: {
      variant: 'string',
    },
    filterComponent: null,
  },
  [fieldTypes.longstring]: {
    defaultValue: '',
    viewComponent: DefaultViewer, // may need to truncate
    editComponent: TextEditor,
    editComponentProps: {
      variant: 'longstring',
    },
    filterComponent: null,
  },
  [fieldTypes.float]: {
    defaultValue: null,
    viewComponent: FloatViewer,

    editComponent: TextEditor,
    editComponentProps: {
      variant: 'float',
    },
    filterComponent: null,
  },
  [fieldTypes.integer]: {
    defaultValue: null,
    viewComponent: DefaultViewer,
    editComponent: TextEditor,
    editComponentProps: {
      variant: 'integer',
    },
    filterComponent: null,
  },
  [fieldTypes.feetmeters]: {
    defaultValue: null,
    viewComponent: FloatViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.latlong]: {
    defaultValue: [null, null],
    viewComponent: LatLongViewer,
    editComponent: LatLongEditor,
    filterComponent: null,
  },
  [fieldTypes.date]: {
    defaultValue: null,
    viewComponent: DateViewer,
    editComponent: DateEditor,
    filterComponent: null,
  },
  [fieldTypes.daterange]: {
    defaultValue: [null, null],
    viewComponent: DateRangeViewer,
    editComponent: DateRangeEditor,
    filterComponent: null,
  },
  [fieldTypes.select]: {
    defaultValue: '',
    viewComponent: SelectViewer,
    editComponent: SelectionEditor,
    editComponentProps: {
      variant: 'one',
    },
    filterComponent: null,
  },
  [fieldTypes.multiselect]: {
    defaultValue: [],
    viewComponent: MultiSelectViewer,
    editComponent: SelectionEditor,
    editComponentProps: {
      variant: 'multiple',
    },
    filterComponent: null,
  },
  [fieldTypes.boolean]: {
    defaultValue: null,
    viewComponent: DefaultViewer,
    viewComponentProps: {
      defaultLabel: 'Value not set',
    },
    editComponent: BooleanEditor,
    filterComponent: null,
  },
  [fieldTypes.locationId]: {
    defaultValue: '',
    viewComponent: LocationIdViewer,
    editComponent: LocationIdEditor,
    filterComponent: null,
  },
  [fieldTypes.individual]: {
    defaultValue: null,
    viewComponent: DefaultViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.relationships]: {
    defaultValue: [],
    viewComponent: DefaultViewer,
    editComponent: null,
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
    ...copiedFields,
    ...copiedSchemaFields,
    ...fieldTypeProperties,
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
