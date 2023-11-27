import React, { useEffect, useMemo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { filter, get } from 'lodash-es';
import Radio from '@material-ui/core/Radio';
import useDescription from '../../../hooks/useDescription';
import useEditLabel from '../../../hooks/useEditLabel';
import FormCore from './FormCore';
import { collapseChoices } from '../../../utils/formatters';
import { flattenDeep } from 'lodash-es';
import { set, sub } from 'date-fns';
import { useState } from 'react';
import TreeViewDemo from './TreeViewDemo';


export default function LocationIdEditor(props) {
  const {
    schema,
    required,
    onChange,
    width,
    value,
    multiple,
    minimalLabels = false,
    ...rest
  } = props;

  const editLabel = useEditLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const collapsedChoices = useMemo(
    () => collapseChoices(get(schema, 'choices', []), 0),
    [get(schema, 'choices.length')],
  );

  const currentRegionArray = value
    ? collapsedChoices.filter(choice => get(choice, 'id') === value)
    : null;
  const currentRegion = get(currentRegionArray, [0], null);

  const [modalOpen, setModalOpen] = useState(false);

  

  // const filterOptions = (options, { inputValue }) => {
  //   const subRegion = [];
  //   if (inputValue) {
  //     const filteredOptions = options.filter(option =>
  //       option.name.toLowerCase().includes(inputValue.toLowerCase())
  //     );
      
  //     if (filteredOptions) {
  //       filteredOptions.forEach(data => {
  //         subRegion.push(data);
  //         subRegion.push(...getSubRegion(data));
  //         console.log('subRegion', subRegion);
  //       });
        
  //     }    
  //     const uniqueArray = Array.from(new Set(subRegion.map(obj => obj.id)))
  //      .map(id => subRegion.find(obj => obj.id === id));
  //     console.log('uniqueArray', uniqueArray);
  //     return uniqueArray
    
  //   }

  //   return options;
  // };

  // return (
  //   <FormCore schema={schema} width={width}>
  //     <Autocomplete
  //       value={currentRegion}
  //       options={collapsedChoices}
  //       disableCloseOnSelect
  //       // filterOptions={filterOptions}        
  //       // renderOption={option => (
  //       //   <Text
  //       //     style={{ paddingLeft: option.depth * 10 }}
  //       //     value={option.id}
  //       //   >
  //       //     {option.name}
  //       //   </Text>
  //       // )}
  //       renderOption={(option, { selected, inputValue }) => {
  //         // const searchResult = option.name
  //         //   .toLowerCase()
  //         //   .includes(inputValue.toLowerCase() || 'A');
          

  //         return (
  //           <>
  //             <Radio
  //               style={{
  //                 paddingLeft: option.depth * 10,
  //               }}
  //               checked={selected}
  //               value={option.id}
  //               onChange={() => {}}
  //               color="primary"
  //               size="small"
  //               inputProps={{ 'aria-labelledby': option.id }}
  //             />

  //               <span                   
  //                 style={{ paddingLeft: option.depth * 10 }}>
  //                 {option.name}
  //               </span>

  //           </>
  //         );
  //       }}
  //       onChange={(_, newValue) => {
  //         if (multiple) {
  //           onChange(
  //             newValue.map(location => get(location, 'id', '')),
  //           );
  //         } else {
  //           onChange(get(newValue, 'id', ''));
  //         }
  //       }}
  //       getOptionLabel={option => get(option, 'name', '')}
  //       getOptionSelected={option =>
  //         option.id ? option.id === get(currentRegion, 'id') : false
  //       }
  //       renderInput={params => (
  //         <div>
  //           <TextField
  //             {...params}
  //             style={{ width: 280 }}
  //             variant="standard"
  //             label={editLabel}
  //           />
  //         </div>
  //       )}
  //       multiple={multiple}
  //       {...rest}
  //     />
  //     {showDescription ? (
  //       <FormHelperText>{description}</FormHelperText>
  //     ) : null}
  //   </FormCore>
  // );

  const data = get(schema, 'choices', []);

  const flatternedTree = {};
  const nameToIdMap = {};

  const flatternTree = (tree) => {
    if(_.isNil(tree) || !_.isArray(tree) || _.isEmpty(tree)) return;
    
    tree.map(node => {
      flatternedTree[node.id] = node;
      nameToIdMap[node.name] = node.id;
      if(!_.isNil(node, 'locationID') && _.isArray(node.locationID) && !_.isEmpty(node.locationID)) {
        flatternTree(node.locationID);
      }
    })
  }

  flatternTree(data);

  const [searchText, setSearchText] = useState('');
  const [showData, setShowData] = useState(data);
  const handleSearchChange = (event) => {
    const searchText = event.target.value;
    setSearchText(searchText);
    const validNodes = filter(data, searchText);
    setShowData(validNodes);
  };
  const filter = (orgData, searchText) => {
    if (_.isNil(searchText) || _.isEmpty(searchText)) {
      return orgData;
    }

    const validNodes = _.keys(nameToIdMap)
    .filter(name => name.toLowerCase().includes(searchText.toLowerCase()))
    .map(name => {
      const id = nameToIdMap[name];
      const node = flatternedTree[id];
      return node;
    })
    .filter(node => !_.isNil(node) && !_.isEmpty(node))
    
    return validNodes;
  }

  return (
    <FormCore schema={schema} width={width}>
      <TextField
        style={{ width:'100%' }}
        label={editLabel}
        value={searchText}
        onFocus={() => {setModalOpen(true)}}
        onBlur={() => {setModalOpen(false)}}
        onChange={handleSearchChange}
      />
      {modalOpen && 
        <TreeViewDemo 
          onChange={onChange} 
          searchText={searchText}
          showData={showData}
        />}
    </FormCore>)

}
