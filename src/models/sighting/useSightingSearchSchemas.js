import useOptions from '../../hooks/useOptions';
import OptionTermFilter from '../../components/filterFields/OptionTermFilter';
import PointDistanceFilter from '../../components/filterFields/PointDistanceFilter';
import SubstringFilter from '../../components/filterFields/SubstringFilter';
import DateRangeFilter from '../../components/filterFields/DateRangeFilter';
import useSiteSettings from '../site/useSiteSettings';
import IntegerFilter from '../../components/filterFields/IntegerFilter';
import autogenNameFilter from '../../components/filterFields/autogenNameFilter';
import useBuildFilter from '../../components/filterFields/useBuildFilter';
import sexOptions from '../../constants/sexOptions';

export default function useSightingSearchSchemas() {
  const {
    regionOptions,
    speciesOptions,
    pipelineStateOptions,
    stageOptions,
  } = useOptions();

  const labeledSexOptions = sexOptions.map(o => ({
    labelId: o?.filterLabelId || o.labelId,
    value: o.value,
  }));

  const { data: siteSettings } = useSiteSettings();
  const customSightingFields =
    siteSettings['site.custom.customFields.Sighting'].value
      .definitions || [];
  const customEncounterFields =
    siteSettings['site.custom.customFields.Encounter'].value
      .definitions || [];

  const sightingsField = useBuildFilter(
    customSightingFields,
    'sightings',
  );
  const encountersField = useBuildFilter(
    customEncounterFields,
    'encounters',
  );

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
      id: 'numberIndividuals',
      labelId: 'NUMBER_OF_INDIVIDUALS',
      FilterComponent: IntegerFilter,
      filterComponentProps: {
        filterId: 'numberIndividuals',
        queryTerm: 'numberIndividuals',
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
    {
      id: 'enounterspecies',
      labelId: 'ENCOUNTER_SPECIES',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        filterId: 'enounterspecies',
        queryTerm: 'encounters.taxonomy_guid',
        choices: speciesOptions,
      },
    },
    {
      id: 'encounterSex',
      labelId: 'ENCOUNTER_SEX',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryTerm: 'encounters.sex',
        filterId: 'encounterSex',
        choices: labeledSexOptions,
      },
    },

    ...sightingsField,
    ...encountersField,
  ];
}
