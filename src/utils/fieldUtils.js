import { get, pick } from 'lodash-es';
import fieldTypes from '../constants/fieldTypesNew';
import DefaultViewer from '../components/fields/view/DefaultViewer';
import LatLongViewer from '../components/fields/view/LatLongViewer';
import SelectViewer from '../components/fields/view/SelectViewer';
import MultiSelectViewer from '../components/fields/view/MultiSelectViewer';
import DateViewer from '../components/fields/view/DateViewer';
import DateRangeViewer from '../components/fields/view/DateRangeViewer';
import FloatViewer from '../components/fields/view/FloatViewer';

export const prototypeFieldSchema = {
  getValue: (schema, backendObject) =>
    get(
      backendObject,
      [schema.name],
      get(schema, 'defaultValue', null),
    ),
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
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.longstring]: {
    defaultValue: '',
    viewComponent: DefaultViewer, // may need to truncate
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.float]: {
    defaultValue: null,
    viewComponent: FloatViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.integer]: {
    defaultValue: null,
    viewComponent: DefaultViewer,
    editComponent: null,
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
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.area]: {
    defaultValue: null,
    viewComponent: DefaultViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.date]: {
    defaultValue: null,
    viewComponent: DateViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.daterange]: {
    defaultValue: [null, null],
    viewComponent: DateRangeViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.select]: {
    defaultValue: '',
    viewComponent: SelectViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.multiselect]: {
    defaultValue: [],
    viewComponent: MultiSelectViewer,
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.boolean]: {
    defaultValue: null,
    viewComponent: DefaultViewer,
    viewComponentProps: {
      defaultLabel: 'Value not set',
    },
    editComponent: null,
    filterComponent: null,
  },
  [fieldTypes.locationId]: {
    defaultValue: '',
    viewComponent: DefaultViewer,
    editComponent: null,
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
    'description',
    'label',
  ]);
  const fieldType = get(houstonSchema, ['schema', 'displayType']);
  const fieldTypeProperties = get(componentMap, fieldType, {});
  const properSchema = {
    ...prototypeFieldSchema,
    ...copiedFields,
    ...copiedSchemaFields,
    ...fieldTypeProperties,
  };

  const defaultValue = get(houstonSchema, 'default');
  if (defaultValue) {
    properSchema.defaultValue = defaultValue;
  }

  // need to copy choices

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
