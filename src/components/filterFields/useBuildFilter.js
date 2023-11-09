import OptionTermFilter from './OptionTermFilter';
import SubstringFilter from './SubstringFilter';
import IntegerFilter from './IntegerFilter';
import FloatFilter from './FloatFilter';
import MultiSelectFilter from './MultiSelectFilter';
import DateRangeFilter from './DateRangeFilter';
import PointDistanceFilter from './PointDistanceFilter';
import useOptions from '../../hooks/useOptions';

const excludedFieldTypes = [
  'individual',
  'feetmeters',
  'date',
  'daterange',
];

export default function useBuildFilter(fields, component) {
  const { booleanChoices } = useOptions();
  let queryTerm;
  let queryTerms;
  if (
    component === 'sightings' ||
    component === 'individuals' ||
    !component
  ) {
    queryTerm = 'customFields';
    queryTerms = 'customFields';
  } else if (component === 'encounters') {
    queryTerm = 'encounters.customFields';
    queryTerms = 'encounters.customFields';
  }

  return fields
    .filter(
      data => !excludedFieldTypes.includes(data.schema.displayType),
    )
    .map(data => {
      let customFilter;
      switch (data.schema.displayType) {
        case 'select':
          customFilter = OptionTermFilter;
          break;
        case 'string':
          customFilter = SubstringFilter;
          break;
        case 'integer':
          customFilter = IntegerFilter;
          break;
        case 'float':
          customFilter = FloatFilter;
          break;
        case 'multiselect':
          customFilter = MultiSelectFilter;
          break;
        case 'daterange':
          customFilter = DateRangeFilter;
          break;
        case 'boolean':
          customFilter = OptionTermFilter;
          break;
        case 'latlong':
          customFilter = PointDistanceFilter;
          break;
        case 'longstring':
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
          queryTerm: `${queryTerm}.${data.id}`,
          queryTerms: [`${queryTerms}.${data.id}`],
          choices: data.schema.choices
            ? data.schema.choices
            : booleanChoices,
        },
      };
    });
}
