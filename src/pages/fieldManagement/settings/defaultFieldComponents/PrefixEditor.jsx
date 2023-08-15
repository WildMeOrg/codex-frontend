import React, { useState, useEffect, useRef } from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import StandardDialog from '../../../../components/StandardDialog';
import usePutSiteSetting from '../../../../models/site/usePutSiteSetting';
import CustomAlert from '../../../../components/Alert';

export default function PrefixEditor(  
  {onClose, species1, onSubmit, siteSettings, ...props}
) { 
  const intl = useIntl(); 
  const [prefixInput, setPrefixInput] = useState('');
  const [ prefixValid, setPrefixValid ] = useState(false);
  const [ showPrefixError, setShowPrefixError ] = useState(false);
  const [ result, setResult ] = useState(false);
  const autogenerated_names = get(siteSettings, ['autogenerated_names', 'value'], []);  
  const currentPrefixes = Object.values(autogenerated_names).map(item => item.prefix);
  const currentSpecies = get(siteSettings, ['site.species', 'value'], []).map(species => {
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
});
  useEffect(() => {    
    const newSpecies = currentSpecies.find(s => s.id === species1.id);
    newSpecies.autogeneratedName.prefix = prefixInput;
    const oldSpecies = currentSpecies.filter(s => s.id !== species1.id);
    setResult(oldSpecies.concat(newSpecies));
  },[siteSettings, prefixInput]);

  const {
    mutate: putSiteSetting,
    error,
    clearError,
  } = usePutSiteSetting();

  const checkPrefixValid = (prefix) => {
    const regex = /^[a-zA-Z0-9]+$/;
    const length = prefix.length;
    return regex.test(prefix) && length >= 3 && length <= 5 && !currentPrefixes.includes(prefix);
  } 

  return (
    <StandardDialog open onClose={onClose} titleId="EDIT_SPECIES">
    <DialogContent style={{ minWidth: 200 }}>       
        <Text
                variant="caption"
                style={{ marginBottom: 12 }}
                id="EDIT_SPECIES_PREFIX_DESCRIPTION"
        />            
        <Text>{species1.labelId}</Text>
        <TextField
          value={prefixInput}
          onChange={e => {
            setPrefixInput(e.target.value);
            setPrefixValid(checkPrefixValid(e.target.value));
          }}
          label={intl.formatMessage({ id: 'SPECIES_PREFIX' })}
          variant="outlined"          
          style={{ width: '100%', marginTop: 12 }}
        />    
        {showPrefixError && (
        <CustomAlert
          style={{ marginTop: 12 }}
          severity="error"
          titleId="PREFIX_INVALID"
        />
      )}
     
    </DialogContent>
    <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
      <Button 
        display="primary"
        onClick={async() => {
          setTimeout(async () => {
            setShowPrefixError(!prefixValid);
            if(prefixValid) {
              const response = await putSiteSetting({
                property: 'site.species',
                data: result,
                });
              if (response?.status === 200) {
                clearError();
                onClose();
              }
            }
          }, 200);
        }} >
        <FormattedMessage id="FINISH" />
      </Button>
      <Button 
        display="primary"
        onClick={onClose}
        >
        <FormattedMessage id="CANCEL" />
      </Button>
    </DialogActions>
  </StandardDialog>
  );
}
