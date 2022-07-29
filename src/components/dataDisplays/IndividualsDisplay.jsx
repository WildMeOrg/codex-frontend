import React from 'react';
// import { get } from 'lodash-es';

// import { formatDate } from '../../utils/formatters';
import DataDisplay from './DataDisplay';
import Link from '../Link';
// import ButtonLink from '../ButtonLink';
import { cellRendererTypes } from './cellRenderers';

export default function IndividualsDisplay({
  individuals,
  loading,
  dataCount,
  addColumns = [],
  removeColumns = [],
  ...rest
}) {
  const title = dataCount
    ? `${dataCount} matching individuals`
    : 'Matching individuals';

  const columns = [
    {
      name: 'firstName',
      sortName: 'elasticsearch.firstName_keyword',
      labelId: 'NAME',
      sortable: true,
      options: {
        customBodyRender: (firstName, individual) => (
          <Link to={`/individuals/${individual?.guid}`}>
            {firstName || 'Unnamed individual'}
          </Link>
        ),
      },
    },
    {
      name: 'role',
      labelId: 'ROLE',
      sortable: false,
      align: 'left',
      options: {
        cellRenderer: cellRendererTypes.socialGroupRole,
      },
    },
    {
      name: 'last_seen',
      labelId: 'LAST_SEEN',
      sortable: false,
      align: 'left',
      options: {
        cellRenderer: cellRendererTypes.date,
        cellRendererProps: { accessor: 'last_seen', fancy: true },
      },
    },
    {
      name: 'taxonomy_guid',
      labelId: 'SPECIES',
      align: 'left',
      sortable: false,
      options: { cellRenderer: cellRendererTypes.species },
    },
    {
      name: 'num_encounters',
      labelId: 'SIGHTING_COUNT',
      sortable: false,
      align: 'left',
    },
    {
      name: 'created',
      labelId: 'CREATION_DATE_RANGE',
      align: 'left',
      options: { cellRenderer: cellRendererTypes.date },
    },
    {
      name: 'adoptionName',
      labelId: 'ADOPTION_NAME',
      sortable: false,
      align: 'left',
    },
  ];

  const filteredColumns = columns.filter(
    c => !removeColumns.includes(c.name),
  );
  const amendedColumns = [...filteredColumns, ...addColumns];

  return (
    <DataDisplay
      idKey="guid"
      columns={amendedColumns}
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
