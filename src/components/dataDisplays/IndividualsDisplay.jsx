import React from 'react';
import { useIntl } from 'react-intl';
// import { get } from 'lodash-es';

// import { formatDate } from '../../utils/formatters';
import { deriveIndividualName } from '../../utils/nameUtils';
import DataDisplay from './DataDisplay';
import Link from '../Link';
// import ButtonLink from '../ButtonLink';
import Text from '../Text';
// import { cellRendererTypes } from './cellRenderers';

export default function IndividualsDisplay({
  individuals,
  loading,
  dataCount,
  ...rest
}) {
  const intl = useIntl();
  const title = dataCount
    ? `${dataCount} matching individuals`
    : 'Matching individuals';

  const columns = [
    {
      name: 'name',
      sortName: 'firstName',
      label: intl.formatMessage({
        id: 'NAME',
      }),
      options: {
        customBodyRender: (_, individual) => {
          const name = deriveIndividualName(
            individual,
            'FirstName',
            'Unnamed Individual',
          );
          return (
            <Link href={`/individuals/${individual?.guid}`}>
              <Text variant="body2">{name}</Text>
            </Link>
          );
        },
      },
    },
    {
      name: 'adoptionName',
      labelId: 'ADOPTION_NAME',
      align: 'left',
      options: {
        customBodyRender: (_, individual) => {
          const adoptionName = deriveIndividualName(
            individual,
            'AdoptionName',
            '-',
          );
          return <Text variant="body2">{adoptionName}</Text>;
        },
      },
    },
    // {
    //   name: 'last_sighting',
    //   label: intl.formatMessage({ id: 'LAST_SEEN' }),
    //   align: 'left',
    //   options: {
    //     cellRenderer: cellRendererTypes.date,
    //     cellRendererProps: { accessor: 'lastSeen' },
    //   },
    // },
    // {
    //   name: 'taxonomy',
    //   label: intl.formatMessage({ id: 'SPECIES' }),
    //   align: 'left',
    //   options: { cellRenderer: cellRendererTypes.capitalizedString },
    // },
    // {
    //   name: 'encounters',
    //   label: intl.formatMessage({ id: 'SIGHTINGS' }),
    //   align: 'left',
    //   options: {
    //     customBodyRender: encounters => (
    //       <Text variant="body2">
    //         {get(encounters, 'length', '-')}
    //       </Text>
    //     ),
    //   },
    // },
  ];

  return (
    <DataDisplay
      columns={columns}
      data={individuals}
      title={title}
      loading={loading}
      // onPrint={() => {
      //   window.open('/individuals/picturebook', '_blank');
      // }}
      showNoResultsBao
      // renderExpandedRow={expandedIndividual => (
      //   <div style={{ display: 'flex' }}>
      //     {/* <img
      //         src={expandedIndividual.profile}
      //         alt="Expanded individual"
      //         style={{
      //           width: 200,
      //           height: 160,
      //           padding: 20,
      //         }}
      //       /> */}
      //     <div style={{ padding: '20px 0' }}>
      //       <Text variant="h6" style={{ marginBottom: 8 }}>
      //         Recent Activity
      //       </Text>
      //       {get(expandedIndividual, 'encounters', []).map(
      //         encounter => {
      //           const encounterDate = get(encounter, 'date_occurred');
      //           const formattedEncounterDate = encounterDate
      //             ? formatDate(encounterDate, true)
      //             : 'unknown date';
      //           const submitter = get(
      //             encounter,
      //             'submitter_id',
      //             'unknown user',
      //           );

      //           return (
      //             <Text variant="body2" key={encounter.id}>
      //               {'Sighting on '}
      //               <Link href={`/sightings/${encounter.id}`}>
      //                 {formattedEncounterDate}
      //               </Link>
      //               {' by '}
      //               <Link href={`/users/${submitter}`}>
      //                 {submitter}
      //               </Link>
      //               .
      //             </Text>
      //           );
      //         },
      //       )}
      //       <ButtonLink
      //         style={{ marginTop: 16 }}
      //         href={`/individuals/${expandedIndividual.id}`}
      //       >
      //         View Profile
      //       </ButtonLink>
      //     </div>
      //   </div>
      // )}
      {...rest}
    />
  );
}
