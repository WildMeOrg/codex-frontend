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

export default function SpeciesEditor(props) {
  const intl = useIntl(); 
  const species = get(props.data, ['site.species', 'suggestedValues'], []);
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

  const [ selectedSpecies, setSelectedSpecies ] = useState(speciesOptions[0].value);

  return (
    <StandardDialog open onClose = {props.onClose} titleId="ADD_SPECIES">
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
              }
              
            }
          />
          
          <TextField
            // value={searchInput}
            // onChange={e => setSearchInput(e.target.value)}
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
        onClick={ () => {console.log("submitting", selectedSpecies)}} >
        <FormattedMessage id="FINISH" />
      </Button>
      <Button 
        display="primary"
        onClick={props.onClose} >
        <FormattedMessage id="CANCEL" />
      </Button>
    </DialogActions>
  </StandardDialog>
  );
}
