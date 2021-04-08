import { get } from 'lodash-es';

import useSiteSettings from '../models/site/useSiteSettings';
import fieldTypes from '../constants/fieldTypes';

import OptionRenderer from '../components/renderers/OptionRenderer';
import DateRenderer from '../components/renderers/DateRenderer';
import GpsRenderer from '../components/renderers/GpsRenderer';
import LocationIdRenderer from '../components/renderers/LocationIdRenderer';

import DateInput from '../components/inputs/DateInput';
import LatLongInput from '../components/inputs/LatLongInput';
import TextInput from '../components/inputs/TextInput';
import LocationIdInput from '../components/inputs/LocationIdInput';

import { prototypeFieldSchema } from '../utils/fieldUtils';

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

/* Todo: Derive components from fieldtype automatically */

export default function useSightingFieldSchema() {
  const { data, loading, error } = useSiteSettings();
  if (loading || error) return null;

  const regionChoices = get(
    data,
    ['site.custom.regions', 'value', 'locationID'],
    [],
  );

  const contextChoices = [
    {
      value: 'research-effort',
      labelId: 'RESEARCH_EFFORT',
    },
    {
      value: 'wildlife-tour',
      labelId: 'WILDLIFE_TOUR',
    },
    {
      value: 'opportunistic-sighting',
      labelId: 'OPPORTUNISTIC_SIGHTING',
    },
  ];

  return [
    {
      ...prototypeFieldSchema,
      name: 'context',
      labelId: 'SIGHTING_CONTEXT',
      defaultValue: '',
      rendererComponent: OptionRenderer,
      rendererComponentProps: {
        choices: contextChoices,
      },
    },
    {
      ...prototypeFieldSchema,
      name: 'startTime',
      labelId: 'SIGHTING_START',
      defaultValue: null,
      editComponent: DateInput,
      rendererComponent: DateRenderer,
    },
    {
      ...prototypeFieldSchema,
      name: 'endTime',
      labelId: 'SIGHTING_END',
      defaultValue: null,
      editComponent: DateInput,
      rendererComponent: DateRenderer,
    },
    {
      ...prototypeFieldSchema,
      name: 'locationId',
      labelId: 'REGION',
      defaultValue: '',
      rendererComponent: OptionRenderer,
      rendererComponentProps: {
        choices: regionChoices,
      },
      editComponent: LocationIdInput,
      editComponentProps: {
        choices: regionChoices,
      },
    },
    {
      ...prototypeFieldSchema,
      name: 'gps',
      labelId: 'EXACT_LOCATION',
      getValueFromSiteSettings: (_, settings) => {
        const lat = get(settings, 'decimalLatitude');
        const long = get(settings, 'decimalLongitude');
        return lat && long ? [lat, long] : null;
      },
      rendererComponent: GpsRenderer,
      editComponent: LatLongInput,
    },
    {
      ...prototypeFieldSchema,
      name: 'verbatimLocality',
      labelId: 'FREEFORM_LOCATION',
      editComponent: TextInput,
    },
    {
      ...prototypeFieldSchema,
      name: 'bearing',
      labelId: 'BEARING',
      editComponent: TextInput,
    },
    {
      ...prototypeFieldSchema,
      name: 'behavior',
      labelId: 'BEHAVIOR',
      editComponent: TextInput,
    },
    {
      ...prototypeFieldSchema,
      name: 'comments',
      labelId: 'NOTES',
      editComponent: TextInput,
    },
  ];
}
