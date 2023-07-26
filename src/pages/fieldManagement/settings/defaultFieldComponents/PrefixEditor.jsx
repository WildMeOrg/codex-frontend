import React, { useState, useEffect, useRef } from 'react';
import { get } from 'lodash-es';
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

export default function PrefixEditor(  
  props
) {
  console.log('species ID',props);
  const intl = useIntl();
  

  return (
    <StandardDialog open titleId="EDIT_SPECIES">
    <DialogContent style={{ minWidth: 200 }}>      
      
        <TextField
          // value={searchInput}
          // onChange={e => setSearchInput(e.target.value)}
          label={intl.formatMessage({ id: 'SEARCH_ITIS_SPECIES' })}
          variant="outlined"          
          style={{ width: '100%' }}
        />        
     
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
      <Button display="primary" >
        <FormattedMessage id="FINISH" />
      </Button>
      <Button display="primary" >
        <FormattedMessage id="CANCEL" />
      </Button>
    </DialogActions>
  </StandardDialog>
  );
}
