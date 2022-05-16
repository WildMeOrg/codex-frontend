import useOptions from '../../hooks/useOptions';
import OptionTermFilter from '../../components/filterFields/OptionTermFilter';
import SubstringFilter from '../../components/filterFields/SubstringFilter';
import DateRangeFilter from '../../components/filterFields/DateRangeFilter';

export default function useSightingSearchSchemas() {
  const { regionOptions } = useOptions();
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
  ];
}
