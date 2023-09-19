import useOptions from '../../hooks/useOptions';
import OptionTermFilter from '../../components/filterFields/OptionTermFilter';
import SubstringFilter from '../../components/filterFields/SubstringFilter';
import DateRangeFilter from '../../components/filterFields/DateRangeFilter';
import IntegerFilter from '../../components/filterFields/IntegerFilter';
import autogenNameFilter from '../../components/filterFields/autogenNameFilter';
import sexOptions from '../../constants/sexOptions';
import useSocialGroups from '../socialGroups/useSocialGroups';
import useSiteSettings from '../site/useSiteSettings';
import useBuildFilter from '../../components/filterFields/useBuildFilter';

const labeledSexOptions = sexOptions.map(o => ({
  labelId: o?.filterLabelId || o.labelId,
  value: o.value,
}));

const hasAnnotationOptions = [
  {
    label: 'Yes',
    value: 'yes',
    queryValue: true,
  },
  {
    label: 'No',
    value: 'no',
    queryValue: true,
    clause: 'must_not',
  },
  {
    label: 'Either',
    value: '',
  },
];

export default function useIndividualSearchSchemas() {
  const {
    speciesOptions,
    socialGroupRolesOptions,
    relationshipOptions,
  } = useOptions();
  const { data: socialGroups } = useSocialGroups();
  const { data: siteSettings } = useSiteSettings();
  const customIndividualFields =
    siteSettings['site.custom.customFields.Individual'].value
      .definitions || [];
  const socialGroupOptions = socialGroups?.map(data => ({
    label: data.name,
    value: data.guid,
  }));

  const customFields = useBuildFilter(
    customIndividualFields,
    'individuals',
  );

  return [
    {
      id: 'firstName',
      labelId: 'INDIVIDUAL_NAME',
      FilterComponent: SubstringFilter,
      filterComponentProps: {
        filterId: 'firstName',
        queryTerms: ['firstName'],
      },
    },
    {
      id: 'codexId',
      labelId: 'CODEX_ID',
      FilterComponent: autogenNameFilter,
      filterComponentProps: {
        filterId: 'codexId',
        queryTerms: ['namesWithContexts'],
      },
    },
    {
      id: 'adoptionName',
      labelId: 'ADOPTION_NAME',
      FilterComponent: SubstringFilter,
      filterComponentProps: {
        filterId: 'adoptionName',
        queryTerms: ['adoptionName'],
      },
    },
    {
      id: 'sex',
      labelId: 'SEX',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryTerm: 'sex',
        filterId: 'sex',
        choices: labeledSexOptions,
      },
    },
    {
      id: 'hasAnnotations',
      labelId: 'HAS_ANNOTATIONS',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryType: 'term',
        queryTerm: 'has_annotations',
        filterId: 'annotation',
        choices: hasAnnotationOptions,
      },
    },
    {
      id: 'taxonomy',
      labelId: 'SPECIES',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryTerm: 'taxonomy_guid',
        filterId: 'taxonomy_guid',
        choices: speciesOptions,
      },
    }, //     queryTerm: 'encounters.point', //     nested: true, //   filterComponentProps: { //   FilterComponent: PointDistanceFilter, //   labelId: 'DISTANCE_FROM_POINT', //   id: 'gps', // {
    //     filterId: 'geodistance',
    //     style: {{ marginTop: 16 }},
    //   },
    // },
    {
      id: 'lastSeen',
      labelId: 'LAST_SIGHTING_DATE_RANGE',
      FilterComponent: DateRangeFilter,
      filterComponentProps: {
        queryTerm: 'last_seen',
        filterId: 'last_seen',
      },
    },
    {
      id: 'created',
      labelId: 'CREATION_DATE_RANGE',
      FilterComponent: DateRangeFilter,
      filterComponentProps: {
        queryTerm: 'created',
        filterId: 'created',
      },
    },
    {
      id: 'num_encounters',
      labelId: 'SIGHTING_COUNT',
      FilterComponent: IntegerFilter,
      filterComponentProps: {
        queryTerm: 'num_encounters',
        filterId: 'num_encounters',
      },
    },
    {
      id: 'relationship',
      labelId: 'RELATIONSHIP',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryTerm: 'relationships.type_guid',
        filterId: 'relationship',
        choices: relationshipOptions,
      },
    },
    {
      id: 'relationshipRoles',
      labelId: 'RELATIONSHIP_ROLES',
      dependency: 'relationship',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryTerm: 'relationships.role_guid',
        filterId: 'relationshipRoles',
        choices: [],
      },
    },
    {
      id: 'socialGroups',
      labelId: 'SOCIAL_GROUPS',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        queryTerm: 'social_groups.guid',
        filterId: 'socialGroups',
        choices: socialGroupOptions,
      },
    },
    {
      id: 'socialGroupsRoles',
      labelId: 'SOCIAL_GROUP_ROLES',
      FilterComponent: OptionTermFilter,
      filterComponentProps: {
        customField: 'social_group_roles',
        queryTerm: 'social_groups.role_guids',
        filterId: 'socialGroupsRoles',
        choices: socialGroupRolesOptions,
      },
    },
    ...customFields,
  ];
}
