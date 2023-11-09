import useOptions from '../../hooks/useOptions';
import OptionTermFilter from '../../components/filterFields/OptionTermFilter';
import PointDistanceFilter from '../../components/filterFields/PointDistanceFilter';
import SubstringFilter from '../../components/filterFields/SubstringFilter';
import DateRangeFilter from '../../components/filterFields/DateRangeFilter';
import useSiteSettings from '../site/useSiteSettings';
import autogenNameFilter from '../../components/filterFields/autogenNameFilter';
import useBuildFilter from '../../components/filterFields/useBuildFilter';

export default function useSightingSearchSchemas() {
  const { regionOptions, speciesOptions, stateOptions } =
    useOptions();

  const { data: siteSettings } = useSiteSettings();

  const customEncounterFields =
    siteSettings['site.custom.customFields.Encounter'].value
      .definitions || [];

  const encountersField = useBuildFilter(customEncounterFields);

  return [
    {
      id: 'name',
      labelId: 'NAME',
      FilterComponent: SubstringFilter,
      filterComponentProps: {
        filterId: 'name',
        queryTerms: ['individualNamesWithContexts.FirstName'],
      },
    },
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
      id: 'locationId',
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
        queryTerms: ['verbatimLocality'],
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
      id: 'match_state',
      labelId: 'STATE',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        filterId: 'match_state',
        queryTerm: 'match_state',
        choices: stateOptions,
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
    ...encountersField,
  ];
}
