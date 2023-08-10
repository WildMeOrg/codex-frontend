import React, { useState, useEffect, useRef } from 'react';
import { get, startCase } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircle';
import CheckIcon from '@material-ui/icons/Check';
import StarIcon from '@material-ui/icons/Star';
import CustomAlert from '../../../../components/Alert';

import useItisSearch from '../../../../utils/useItisSearch';
import DataDisplay from '../../../../components/dataDisplays/DataDisplay';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import StandardDialog from '../../../../components/StandardDialog';
import SelectionEditor from '../../../../components/fields/edit/SelectionEditor';
import { set } from 'date-fns';
import usePutSiteSetting from '../../../../models/site/usePutSiteSetting';


export default function SpeciesEditor(
  {
    data,
    onClose,
    onSubmit,
    siteSettings,
  }
) {
  const intl = useIntl(); 
  const species = get(data, ['site.species', 'suggestedValues'], []);
  const speciesOptions = species.map(s => {
    const mainCommonName = startCase(get(s, ['commonNames', 0]));
    const speciesLabel = mainCommonName
      ? `${mainCommonName} (${s.scientificName})`
      : s.scientificName;
    return {
      label: speciesLabel,
      value: s.itisTsn,
    };
  }); 

  const [ transformedSpecies, setTransformedSpecies ] = useState([]);
  const {
    mutate: putSiteSetting,
    error,
    clearError,
  } = usePutSiteSetting();

  // function getInitialFormState(siteSettings) {
  //   const regions = get(
  //     siteSettings,
  //     ['site.custom.regions', 'value'],
  //     [],
  //   );
  //   const species = get(siteSettings, ['site.species', 'value'], []);
  //   const relationships = get(
  //     siteSettings,
  //     ['relationship_type_roles', 'value'],
  //     [],
  //   );
  //   const socialGroups = get(
  //     siteSettings,
  //     ['social_group_roles', 'value'],
  //     [],
  //   );
  
  //   return { regions, species, relationships, socialGroups };
  // }  

  // useEffect(
  //   () => setFormSettings(getInitialFormState(siteSettings)),
  //   [siteSettings],
  // );
  const autogenerated_names = get(siteSettings, ['site.species', 'autogenerated_names'], []);
  
  const currentSpecies = get(siteSettings, ['site.species', 'value'], []);
  const suggestedValues = get(
    siteSettings,
    ['site.species', 'suggestedValues'],
    [],
  );

  const [ selectedSpecies, setSelectedSpecies ] = useState('');
  const [ newSpecies, setNewSpecies ] = useState(null);
  const [ prefixInput, setPrefixInput ] = useState('');

  const [result, setResult] = useState(null);

  console.log('result', result);
  return (
    <StandardDialog open onClose = {onClose} titleId="ADD_SPECIES">
    <DialogContent style={{ minWidth: 200 }}>            
        <Text
            variant="caption"
            style={{ marginBottom: 12 }}
            id="ADD_SPECIES_DESCRIPTION"
          />
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <SelectionEditor 
            schema={{
              labelId: 'SPECIES',
              choices: speciesOptions
            }}
            value={selectedSpecies}
            onChange={(e) => {
              console.log("selected species", e);
              setSelectedSpecies(e);
              setNewSpecies(suggestedValues.find(s => s.itisTsn === e));
              }
              
            }
          />          
          <TextField
            value={prefixInput}
            onChange={e => {
              setPrefixInput(e.target.value);
              setTransformedSpecies(currentSpecies.map(species => {
                const autogeneratedId = Object.keys(autogenerated_names)
                                              .find(id => autogenerated_names[id].reference_guid === species.id);         
              if (autogeneratedId) {
                  const autogeneratedInfo = autogenerated_names[autogeneratedId];
                  return {
                      ...species,
                      autogeneratedName: {
                          prefix: autogeneratedInfo.prefix,
                          guid: autogeneratedId,
                          type: autogeneratedInfo.type,
                          enabled: autogeneratedInfo.enabled
                      }
                  };
              } else {
                  return species;
              }
          }));
            setResult(
              [...transformedSpecies, {
                ...newSpecies,
                autogeneratedName: {
                    prefix: prefixInput,
                    type: "auto-species",
                    enabled: true
                }
            }],
            );
            console.log('result',result);
            console.log('transformedSpecies',transformedSpecies);
            }}
            label={intl.formatMessage({ id: 'PREFIX' })}
            variant="outlined"          
            style={{ width: 200, marginTop: 12, marginBottom: 12 }}
          />      
        </div>  
     
      {/* {stillGeneratingDisplay && !searchResultsError && (
        <Text
          component="p"
          variant="caption"
          style={{ margin: '8px 4px' }}
          id="STILL_GENERATING_LIST"
        />
      )}
      {isTimeoutError && (
        <CustomAlert
          style={{ marginTop: 12 }}
          severity="error"
          titleId="SEARCH_TIMED_OUT_WHILE_TRYING_TO_CONNECT_TO_ITIS"
        />
      )}
      {isNonTimeoutError && (
        <CustomAlert style={{ marginTop: 12 }} severity="error">
          {searchResultsError}
        </CustomAlert>
      )} */}
      
    </DialogContent>
    <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
      <Button 
        display="primary"
        onClick={async () =>
          {            
            console.log('result',result);
            const response = await putSiteSetting({
              property: 'site.species',
              data: result,
            });
            console.log('response', response);
            // if (response?.status === 200) onCloseEditor();
          }          
        }
        >
        <FormattedMessage id="FINISH" />
      </Button>
      <Button 
        display="primary"
        onClick={onClose} >
        <FormattedMessage id="CANCEL" />
      </Button>
    </DialogActions>
  </StandardDialog>
  );
}


// export function oldSpeciesEditor({
//   onClose,
//   onSubmit,
//   formSettings,
//   siteSettings,
//   setFormSettings,
// }) {
//   const intl = useIntl();
//   const [searchInput, setSearchInput] = useState('');
//   const [searchTerm, setSearchTerm] = useState(null);
//   const [stillGeneratingDisplay, setStillGeneratingDisplay] =
//     useState(false);
//   const {
//     data: searchResults,
//     loading: searchResultsLoading,
//     error: searchResultsError,
//     setError,
//   } = useItisSearch(searchTerm);

//   const timerRef = useRef(null);
//   useEffect(() => {
//     if (searchResultsLoading) {
//       timerRef.current = setTimeout(() => {
//         setStillGeneratingDisplay(true);
//       }, '5000');
//     } else {
//       setStillGeneratingDisplay(false);
//       clearTimeout(timerRef.current);
//     }
//     return () => {
//       clearTimeout(timerRef.current);
//     };
//   }, [searchResultsLoading]);
//   const currentSpecies = get(formSettings, 'species', []);
//   const suggestedValues = get(
//     siteSettings,
//     ['site.species', 'suggestedValues'],
//     [],
//   );

//   const isTimeoutError =
//     searchResultsError && searchResultsError?.indexOf('Timeout') > -1;
//   const isNonTimeoutError =
//     searchResultsError &&
//     searchResultsError?.indexOf('Timeout') === -1;

//   const tableColumns = [
//     {
//       name: 'scientificName',
//       label: intl.formatMessage({ id: 'SCIENTIFIC_NAME' }),
//       options: {
//         customBodyRender: (scientificName, species) => {
//           const suggested = suggestedValues.find(
//             suggestedValue =>
//               suggestedValue.itisTsn === species.itisTsn,
//           );

//           return (
//             <Text
//               variant="body2"
//               style={{
//                 fontStyle: 'italic',
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               {suggested && <StarIcon style={{ marginRight: 4 }} />}
//               {scientificName}
//             </Text>
//           );
//         },
//       },
//     },
//     {
//       name: 'commonNames',
//       label: intl.formatMessage({ id: 'COMMON_NAMES' }),
//       align: 'left',
//       options: {
//         customBodyRender: commonNames => commonNames.join(', '),
//       },
//     },
//     {
//       name: 'action',
//       label: intl.formatMessage({ id: 'ADD' }),
//       options: {
//         customBodyRender: (_, species) => {
//           if (
//             currentSpecies.find(s => s.itisTsn === species.itisTsn)
//           ) {
//             return (
//               <div style={{ padding: 12 }}>
//                 <CheckIcon />
//               </div>
//             );
//           }
//           return (
//             <IconButton
//               onClick={() =>
//                 setFormSettings({
//                   ...formSettings,
//                   species: [...currentSpecies, species],
//                 })
//               }
//             >
//               <AddIcon />
//             </IconButton>
//           );
//         },
//       },
//     },
//   ];

//   return (
//     <StandardDialog open onClose={onClose} titleId="EDIT_SPECIES">
//       <DialogContent style={{ minWidth: 200 }}>
//         <div style={{ marginBottom: 24 }}>
//           {currentSpecies.map(s => (
//             <Tooltip
//               key={s.itisTsn}
//               title={get(s, 'commonNames', []).join(', ')}
//             >
//               <Chip
//                 style={{ marginRight: 4, marginBottom: 8 }}
//                 label={s.scientificName}
//                 onDelete={() => {
//                   const newSpecies = currentSpecies.filter(
//                     c => c.itisTsn !== s.itisTsn,
//                   );

//                   setFormSettings({
//                     ...formSettings,
//                     species: newSpecies,
//                   });
//                 }}
//               />
//             </Tooltip>
//           ))}
//         </div>
//         <form
//           onSubmit={e => {
//             setSearchTerm(searchInput);
//             e.preventDefault();
//             setError(null);
//           }}
//           style={{ display: 'flex', alignItems: 'center' }}
//         >
//           <TextField
//             value={searchInput}
//             onChange={e => setSearchInput(e.target.value)}
//             label={intl.formatMessage({ id: 'SEARCH_ITIS_SPECIES' })}
//             variant="outlined"
//             InputProps={{ startAdornment: <SearchIcon /> }}
//             style={{ width: '100%' }}
//           />
//           <Button
//             onClick={() => {
//               setSearchTerm(searchInput);
//             }}
//             display="primary"
//             loading={searchResultsLoading}
//             style={{ marginLeft: 12 }}
//             type="submit"
//           >
//             <FormattedMessage id="SEARCH" />
//           </Button>
//         </form>
//         {stillGeneratingDisplay && !searchResultsError && (
//           <Text
//             component="p"
//             variant="caption"
//             style={{ margin: '8px 4px' }}
//             id="STILL_GENERATING_LIST"
//           />
//         )}
//         {isTimeoutError && (
//           <CustomAlert
//             style={{ marginTop: 12 }}
//             severity="error"
//             titleId="SEARCH_TIMED_OUT_WHILE_TRYING_TO_CONNECT_TO_ITIS"
//           />
//         )}
//         {isNonTimeoutError && (
//           <CustomAlert style={{ marginTop: 12 }} severity="error">
//             {searchResultsError}
//           </CustomAlert>
//         )}
//         <DataDisplay
//           cellStyles={{ padding: '0 8px 0 12px' }}
//           style={{ marginTop: 12 }}
//           noTitleBar
//           variant="secondary"
//           columns={tableColumns}
//           data={searchResults || suggestedValues}
//           idKey="itisTsn"
//           tableContainerStyles={{ maxHeight: 300 }}
//         />
//         <Text
//           component="p"
//           variant="caption"
//           style={{ margin: '8px 4px' }}
//           id="STAR_EXPLANATION"
//         />
//       </DialogContent>
//       <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
//         <Button display="primary" onClick={onSubmit}>
//           <FormattedMessage id="FINISH" />
//         </Button>
//       </DialogActions>
//     </StandardDialog>
//   );
// }