import { get, pick } from 'lodash-es';
import DefaultRenderer from '../components/renderers/DefaultRenderer';

export const prototypeFieldSchema = {
  getValueFromSiteSettings: (schema, settings) =>
    get(settings, [schema.name]),
  defaultValue: null,
  required: false,
  editable: true,
  editComponent: null,
  editComponentProps: {},
  filterable: true,
  filterComponent: null,
  filterComponentProps: {},
  visible: true,
  rendererComponent: DefaultRenderer,
  rendererComponentProps: {},
};

export function createCustomFieldSchema(houstonSchema) {
  return {
    ...prototypeFieldSchema,
  };
}
