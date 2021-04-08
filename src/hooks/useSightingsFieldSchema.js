import { get } from 'lodash-es';
import useSiteSettings from '../models/site/useSiteSettings';
import fieldTypes from '../constants/fieldTypes';

const defaultSightingCategories = {
  general: {
    name: 'general',
    labelId: 'GENERAL',
    individualFields: false,
  },
  location: {
    name: 'location',
    labelId: 'LOCATION',
    descriptionId: 'LOCATION_CATEGORY_DESCRIPTION',
    required: true,
    individualFields: false,
  },
  sightingDetails: {
    name: 'sightingDetails',
    labelId: 'SIGHTING_DETAILS',
    individualFields: false,
  },
};

const prototypeFieldSchema = {
  id: null,
  name: null,
  label: null,
  description: null,
  category: defaultSightingCategories.sightingDetails.name,
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
  rendererComponent: null,
  rendererComponentProps: {},
};

/* Todo: Derive components from fieldtype automatically */

export default function useSightingFieldSchema() {
  const { data, loading, error } = useSiteSettings();
  if (loading || error) return null;

  const regionChoices = get(
    data,
    ['site.custom.regions', 'value', 'locationID'],
    [],
  );

  return [
    {
      ...prototypeFieldSchema,
      name: 'locationId',
      labelId: 'REGION',
      category: defaultSightingCategories.location.name,
      fieldType: fieldTypes.treeview,
      defaultValue: '',
      multiselect: false,
      choices: regionChoices,
    },
  ];
}
