import React from 'react';
import { get } from 'lodash-es';

import DateRenderer from '../../../components/renderers/DateRenderer';
import GpsRenderer from '../../../components/renderers/GpsRenderer';
// import TaxonomyRenderer from '../../../components/renderers/TaxonomyRenderer';

import DateInput from '../../../components/inputs/DateInput';
import LatLongInput from '../../../components/inputs/LatLongInput';
import TextInput from '../../../components/inputs/TextInput';
import LocationIdInput from '../../../components/inputs/LocationIdInput';

const metadataDefinitions = [
  {
    id: 'startTime',
    titleId: 'SIGHTING_START',
    getData: data => get(data, 'startTime'),
    renderValue: value => <DateRenderer value={value} />,
    editor: DateInput,
    editable: true,
  },
  {
    id: 'endTime',
    titleId: 'SIGHTING_END',
    getData: data => get(data, 'endTime'),
    renderValue: value => <DateRenderer value={value} />,
    editor: DateInput,
    editable: true,
  },
  // {
  //   id: 'created',
  //   titleId: 'REPORTED_ON',
  //   getData: data => get(data, 'created'),
  //   renderer: DateRenderer,
  //   editable: false,
  // },
  // {
  //   id: 'modified',
  //   titleId: 'LAST_MODIFIED',
  //   getData: data => get(data, 'modified'),
  //   renderer: DateRenderer,
  //   editable: false,
  // },
  // {
  //   id: 'owner',
  //   titleId: 'REPORTED_BY',
  //   getData: data => get(data, 'owner'),
  //   editable: false,
  // },
  // {
  //   id: 'taxonomies',
  //   titleId: 'TAXONOMIES',
  //   getData: data => get(data, 'taxonomies'),
  //   renderer: TaxonomyRenderer,
  //   editor: TextInput,
  //   editable: true,
  // },
  {
    id: 'locationId',
    titleId: 'REGION',
    getData: data => get(data, 'locationId'),
    editor: LocationIdInput,
    editable: true,
  },
  {
    id: 'gps',
    titleId: 'EXACT_LOCATION',
    getData: data => [
      get(data, 'decimalLatitude'),
      get(data, 'decimalLongitude'),
    ],
    renderValue: value => <GpsRenderer value={value} />,
    editor: LatLongInput,
    editable: true,
  },
  {
    id: 'bearing',
    titleId: 'BEARING',
    getData: data => get(data, 'bearing'),
    editor: TextInput,
    editable: true,
  },
  {
    id: 'verbatimLocality',
    titleId: 'FREEFORM_LOCATION',
    getData: data => get(data, 'verbatimLocality'),
    editor: TextInput,
    editable: true,
  },
  {
    id: 'behavior',
    titleId: 'BEHAVIOR',
    getData: data => get(data, 'behavior'),
    editable: true,
  },
];

export default metadataDefinitions;
