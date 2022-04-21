import OptionTermFilter from '../../components/filterFields/OptionTermFilter';
import SubstringFilter from '../../components/filterFields/SubstringFilter';
import DateRangeFilter from '../../components/filterFields/DateRangeFilter';

export default function useSightingSearchSchemas() {
  return [
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
        queryTerm: 'locationId_id',
        filterId: 'locationId_id',
        choices: [],
      },
    },
    {
      id: 'verbatimLocality',
      labelId: 'LOCATION',
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
        queryTerms: ['coments'],
      },
    },
    {
      id: 'time',
      labelId: 'SIGHTING_DATE_RANGE',
      FilterComponent: DateRangeFilter,
      filterComponentProps: { queryTerm: 'time', filterId: 'time' },
    },
  ];
}
