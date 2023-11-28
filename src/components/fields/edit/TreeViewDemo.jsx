import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Radio from '@material-ui/core/Radio';
import _ from 'lodash-es';


const useStyles = makeStyles((theme) => ({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  radio: {
    marginRight: theme.spacing(1),
    fontSize: '0.8rem',
  },
  endIcon: {
    width: 24,
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));


const TreeViewDemo = (props) => {
  const {    
    onChange,    
    searchText,
    showData,
    selected,
    setSelected,
  } = props;
  const classes = useStyles();
  

  const handleNodeSelect = (event, nodeId) => {
    onChange(nodeId);
    setSelected(nodeId);
  };

  const renderItem = (node) => {
    return (
      <TreeItem
        key={node.id}
        nodeId={node.id}        
        label={
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center',
            }}>
            <Radio checked={selected===node.id}/>
            {node.name}            
          </div>
        }
      >
        {Array.isArray(node.locationID)
          ? node.locationID.map((node) => renderItem(node, searchText))
          : null}
      </TreeItem>
    )
  }


  return (
    <div 
      
      style={{maxHeight:1200, width: '100%', overflow:"auto"}}
      data-testid="treeViewDemo"
      >
      <TreeView
        onNodeSelect={handleNodeSelect}
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {(_.isNil(showData) || !_.isArray(showData) || _.isEmpty(showData)) 
          ? <></> 
          : showData.map(node => renderItem(node))}
      </TreeView>
    </div>
  );
};

export default TreeViewDemo;
