import { get } from 'lodash-es';

import DateRenderer from '../../../components/renderers/DateRenderer';
import GpsRenderer from '../../../components/renderers/GpsRenderer';
import TaxonomyRenderer from '../../../components/renderers/TaxonomyRenderer';

import DateInput from '../../../components/inputs/DateInput';
import LatLongInput from '../../../components/inputs/LatLongInput';
import TextInput from '../../../components/inputs/TextInput';
import LocationIdInput from '../../../components/inputs/LocationIdInput';

const metadataDefinitions = [
  {
    id: 'startTime',
    labelId: 'SIGHTING_START',
    getData: data => get(data, 'startTime'),
    renderer: DateRenderer,
    editor: DateInput,
    editable: true,
  },
  {
    id: 'endTime',
    labelId: 'SIGHTING_END',
    getData: data => get(data, 'endTime'),
    renderer: DateRenderer,
    editor: DateInput,
    editable: true,
  },
  {
    id: 'created',
    labelId: 'REPORTED_ON',
    getData: data => get(data, 'created'),
    renderer: DateRenderer,
    editable: false,
  },
  {
    id: 'modified',
    labelId: 'LAST_MODIFIED',
    getData: data => get(data, 'modified'),
    renderer: DateRenderer,
    editable: false,
  },
  {
    id: 'owner',
    labelId: 'REPORTED_BY',
    getData: data => get(data, 'owner'),
    editable: false,
  },
  {
    id: 'taxonomies',
    labelId: 'TAXONOMIES',
    getData: data => get(data, 'taxonomies'),
    renderer: TaxonomyRenderer,
    editor: TextInput,
    editable: true,
  },
  {
    id: 'locationId',
    labelId: 'REGION',
    getData: data => get(data, 'locationId'),
    editor: LocationIdInput,
    editable: true,
  },
  {
    id: 'gps',
    labelId: 'EXACT_LOCATION',
    getData: data => [
      get(data, 'decimalLatitude'),
      get(data, 'decimalLongitude'),
    ],
    renderer: GpsRenderer,
    editor: LatLongInput,
    editable: true,
  },
  {
    id: 'bearing',
    labelId: 'BEARING',
    getData: data => get(data, 'bearing'),
    editor: TextInput,
    editable: true,
  },
  {
    id: 'verbatimLocality',
    labelId: 'FREEFORM_LOCATION',
    getData: data => get(data, 'verbatimLocality'),
    editor: TextInput,
    editable: true,
  },
  {
    id: 'behavior',
    labelId: 'BEHAVIOR',
    getData: data => get(data, 'behavior'),
    editable: true,
  },
];

export default metadataDefinitions;
