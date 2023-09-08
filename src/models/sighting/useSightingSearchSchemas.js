import useOptions from '../../hooks/useOptions';
import OptionTermFilter from '../../components/filterFields/OptionTermFilter';
import PointDistanceFilter from '../../components/filterFields/PointDistanceFilter';
import SubstringFilter from '../../components/filterFields/SubstringFilter';
import DateRangeFilter from '../../components/filterFields/DateRangeFilter';
import useSiteSettings from '../../models/site/useSiteSettings';
import IntegerFilter from '../../components/filterFields/IntegerFilter';
import FloatFilter from '../../components/filterFields/FloatFilter';
import MultiSelectFilter from '../../components/filterFields/MultiSelectFilter';
import autogenNameFilter from '../../components/filterFields/autogenNameFilter';

export default function useSightingSearchSchemas() {
  const { regionOptions, speciesOptions, pipelineStateOptions, stageOptions, booleanChoices } = useOptions();
  const { data: siteSettings } = useSiteSettings();
  const customSightingFields = siteSettings['site.custom.customFields.Sighting'].value.definitions || [];
  let customFilter;
  let isMultiple = false;
  let isFloat = false;
  const excludedFieldTypes = ['individual', 'feetmeters'];
  const customFields = customSightingFields.filter(data => 
    !excludedFieldTypes.includes(data.schema.displayType))
    .map(data => {
    switch (data.schema.displayType) {
      case "select":
        customFilter = OptionTermFilter;
        break;
      case "string":
        customFilter = SubstringFilter;
        break;
      case "integer":
        customFilter = IntegerFilter;
        break;
      case "float":
        customFilter = FloatFilter;
        break;
      case "multiselect":
        customFilter = MultiSelectFilter;
        break; 
      case "daterange":
        customFilter = DateRangeFilter;
        break;  
      case "boolean":
        customFilter = OptionTermFilter;
        break; 
      case "latlong":
        customFilter = PointDistanceFilter;
        break;  
      case "longstring":
        customFilter = SubstringFilter;
        break;     
      default:
        customFilter = SubstringFilter;
        break;
    }
    return {
      id: data.name,
      labelId: data.schema.label,
      FilterComponent: customFilter,
      filterComponentProps: {
        filterId: data.name,
        queryTerm: `customFields.${data.id}`,
        queryTerms: [`customFields.${data.id}`],
        choices: data.schema.choices? data.schema.choices : booleanChoices,
    },
    };
  })

  return [
    {
      id: 'codexId',
      labelId: 'CODEX_ID',
      FilterComponent: autogenNameFilter,
      filterComponentProps: {
        filterId: 'codexId',
        queryTerms: ['individualNamesWithContexts'],
      },
    },
    {
      id: 'owner',
      labelId: 'OWNER',
      FilterComponent: SubstringFilter,
      filterComponentProps: {
        filterId: 'owner',
        queryTerms: ['owners.full_name'],
      },
    },
    {
      id: 'region',
      labelId: 'REGION',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryTerm: 'locationId',
        filterId: 'locationId',
        choices: regionOptions,
      },
    },
    {
      id: 'verbatimLocality',
      labelId: 'FREEFORM_LOCATION',
      FilterComponent: SubstringFilter,
      filterComponentProps: {
        filterId: 'verbatimLocality',
        queryTerms: ['verbatimLocality', 'locationId_value'],
      },
    },
    {
      id: 'comments',
      labelId: 'NOTES',
      FilterComponent: SubstringFilter,
      filterComponentProps: {
        filterId: 'comments',
        queryTerms: ['comments'],
      },
    },
    {
      id: 'time',
      labelId: 'SIGHTING_DATE_RANGE',
      FilterComponent: DateRangeFilter,
      filterComponentProps: { queryTerm: 'time', filterId: 'time' },
    },
    {
      id: 'species',
      labelId: 'SPECIES',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
      filterId: 'species',
      queryTerm: 'taxonomy_guids',
      choices: speciesOptions,
      },
    },
    {
      id: 'pipelineState',
      labelId: 'PIPELINE_STATE',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
      filterId: 'pipelineState',
      queryTerm: 'pipelineState',
      choices: pipelineStateOptions,
      },
    },
    {
      id: 'numberEncounters',
      labelId: 'NUMBER_ENCOUNTERS',
      FilterComponent: IntegerFilter,
      filterComponentProps: {
        filterId: 'numberEncounters',
        queryTerm: 'numberEncounters',
      },
    },
    {
      id: 'numberImages',
      labelId: 'NUMBER_IMAGES',
      FilterComponent: IntegerFilter,
      filterComponentProps: {
        filterId: 'numberImages',
        queryTerm: 'numberImages',
      },
    },
    {
      id: 'numberAnnotations',
      labelId: 'NUMBER_ANNOTATIONS',
      FilterComponent: IntegerFilter,
      filterComponentProps: {
        filterId: 'numberAnnotations',
        queryTerm: 'numberAnnotations',
      },
    },
    {
      id: 'stage',
      labelId: 'SIGHTING_STATE',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        filterId: 'Stage',
        queryTerm: 'stage',
        choices: stageOptions,
      },
    },
    {
      id: 'latlong',
      labelId: 'EXACT_LOCATION',
      FilterComponent: PointDistanceFilter,
      filterComponentProps: {
        filterId: 'latlong',
        queryTerm: 'location_geo_point',
      },
    },
    ...customFields
  ];
}
