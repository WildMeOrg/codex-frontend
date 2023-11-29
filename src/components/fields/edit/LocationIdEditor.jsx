import React, { useEffect } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import { TextField } from '@material-ui/core';
import { get } from 'lodash-es';
import useDescription from '../../../hooks/useDescription';
import useEditLabel from '../../../hooks/useEditLabel';
import FormCore from './FormCore';
import { useState } from 'react';
import TreeViewComponent from './TreeViewComponent';
import _ from 'lodash-es';

export default function LocationIdEditor(props) {
  const {
    schema,
    // required,
    onChange,
    width,
    // value,
    // multiple,
    minimalLabels = false,
    // ...rest
  } = props;

  const editLabel = useEditLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;
  const [modalOpen, setModalOpen] = useState(false);  
  const [selected, setSelected] = useState(null);

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
  const filter = (orgData, text) => {
    if (_.isNil(text) || _.isEmpty(text)) {
      return orgData;
    }

    const validNodes = _.keys(nameToIdMap)
    .filter(name => name?.toLowerCase().includes(searchText.toLowerCase()))
    .map(name => {
      const id = nameToIdMap[name];
      const node1 = flatternedTree[id];
      return node1;
    })
    .filter(node => !_.isNil(node) && !_.isEmpty(node))
    
    return validNodes;
  }
  const handleSearchChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    const validNodes = filter(data, text);
    setShowData(validNodes);
  };
  
  const select = (event) => {
    const dropdown = document.querySelector('#treeViewDemo');
    if(event.target.classList.contains('MuiSvgIcon-root') || 
      dropdown.contains(event.target) || 
      event.target.parentNode.classList.contains('MuiSvgIcon-root')
      ) {
      setModalOpen(true);
    }else {
      setModalOpen(false);
    }
  }
  useEffect(() => {
    document.addEventListener('click', select);
    return () => {
      document.removeEventListener('click', select);
    }
  });  

  useEffect(() => {
    const selectedLabel = Object.keys(nameToIdMap).find(name => nameToIdMap[name] === selected);
    setSearchText(selectedLabel);
  }, [selected]);  

  return (
    <div
      id='treeViewDemo'
      >
      <FormCore schema={schema} width={width} >
        <TextField
          style={{ width:'100%' }}
          label={editLabel}
          value={searchText}
          onFocus={() => {setModalOpen(true)}}
          onChange={handleSearchChange}
        />
        {modalOpen && 
          <TreeViewComponent 
            onChange={onChange} 
            searchText={searchText}
            showData={showData}
            setSearchText={setSearchText}
            setModalOpen={setModalOpen}
            selected={selected}
            setSelected={setSelected}
          />}
        {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
      </FormCore>
    </div>
    )

}
