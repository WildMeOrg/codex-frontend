import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';


const data = 

[
    {
        "id": "d6ae1777-b03a-45cd-8cf9-216ed30de263",
        "name": "only"
    },
    {
        "id": "e955e661-cda0-4115-ab45-fab9b85c32fb",
        "name": "Asia",
        "locationID": [
            {
                "id": "829c5726-a4fe-4029-baea-ad25cf652579",
                "name": "ITEM2"
            },
            {
                "id": "e2b3b422-8ca9-45a7-b3e6-fe1d37b761bd",
                "name": "ITEM1"
            }
        ]
    },
    {
        "id": "abea08f3-6855-4dff-a872-4593faddbc35",
        "name": "Africa",
        "locationID": [
            {
                "id": "5030f593-bbbb-448c-a049-ed7012d55edb",
                "name": "sub4",
                "locationID": [
                    {
                        "id": "aa5ce705-3a39-4d30-83d3-89e6f200696d",
                        "name": "sub5"
                    }
                ]
            },
            {
                "id": "72a4fa59-b53c-4346-af37-8bae0f8991ff",
                "name": "sub2",
                "locationID": [
                    {
                        "id": "d8f6ac7d-1eca-40e2-817c-12c6be68c41c",
                        "name": "sub3"
                    }
                ]
            },
            {
                "id": "739452af-d1db-43ad-a57f-89293f39fa15",
                "name": "sub1"
            }
        ]
    }
];

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


// const renderTree = (nodes, searchText) => {
//   if (searchText && !nodes.name.toLowerCase().includes(searchText.toLowerCase())) {
//     return null;
//   }
//   const matchesSearch = searchText && nodes.name.toLowerCase().includes(searchText.toLowerCase());


//   return (
//     <TreeItem
//       key={nodes.id}
//       nodeId={nodes.id}
//       label={
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <Radio />
//           {nodes.name}
//         </div>
//       }
//     >
//       {/* {Array.isArray(nodes.locationID)
//         ? nodes.locationID.map((node) => renderTree(node, searchText))
//         : null} */}

//       {Array.isArray(nodes.locationID) && matchesSearch
//         ? nodes.locationID.map((node) => renderTree(node, searchText))
//         : null}
//     </TreeItem>
//   );
// };

// const TreeViewDemo = (props) => {
//   const {    
//     onChange,    
//   } = props;
//   const classes = useStyles();
//   const [searchText, setSearchText] = useState('');
//   const handleSearchChange = (event) => {
//     setSearchText(event.target.value);
//   };

//   const handleNodeSelect = (event, nodeId) => {
//     console.log('selected', nodeId);
//     onChange(nodeId);
//   };

//   return (
//     <Paper style={{maxHeight:200, width: '100%', overflow:"auto"}}>
//       <TextField
//         style={{ width:'100%' }}
//         label="Search"
//         value={searchText}
//         onChange={handleSearchChange}
//       />
//       <TreeView
//         onNodeSelect={handleNodeSelect}

//         className={classes.root}
//         defaultCollapseIcon={<ExpandMoreIcon />}
//         defaultExpandIcon={<ChevronRightIcon />}
//       >
//         {data.map((node) => renderTree(node, searchText))}
//       </TreeView>
//     </Paper>
//   );
// };

const renderTree = (nodes, searchText, expandedNodes, onNodeToggle) => {
  if (searchText && !nodes.name.toLowerCase().includes(searchText.toLowerCase())) {
    return null;
  }
  const matchesSearch = searchText && nodes.name.toLowerCase().includes(searchText.toLowerCase());

  const isExpanded = expandedNodes.includes(nodes.id);

  return (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Radio />
          {nodes.name}
        </div>
      }
      onIconClick={() => onNodeToggle(nodes.id)}
      onLabelClick={() => onNodeToggle(nodes.id)}
      icon={nodes.locationID && nodes.locationID.length > 0 ? (isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />) : null}
    >
      {Array.isArray(nodes.locationID) && matchesSearch && isExpanded
        ? nodes.locationID.map((node) => renderTree(node, searchText, expandedNodes, onNodeToggle))
        : null}
    </TreeItem>
  );
};

const TreeViewDemo = (props) => {
  // ... (unchanged code)

  const {    
        onChange,    
      } = props;
      const classes = useStyles();
      const [searchText, setSearchText] = useState('');
      const handleSearchChange = (event) => {
        setSearchText(event.target.value);
      };
    
      const handleNodeSelect = (event, nodeId) => {
        console.log('selected', nodeId);
        onChange(nodeId);
      };
    

  const [expandedNodes, setExpandedNodes] = useState([]);

  const handleNodeToggle = (nodeId) => {
    setExpandedNodes((prevExpandedNodes) => {
      if (prevExpandedNodes.includes(nodeId)) {
        return prevExpandedNodes.filter((id) => id !== nodeId);
      } else {
        return [...prevExpandedNodes, nodeId];
      }
    });
  };

  return (
    <Paper style={{maxHeight:200, width: '100%', overflow:"auto"}}>
      {/* ... (unchanged code) */}
      <TextField
        style={{ width:'100%' }}
        label="Search"
        value={searchText}
        onChange={handleSearchChange}
      />
      <TreeView
        onNodeSelect={handleNodeSelect}
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {data.map((node) => renderTree(node, searchText, expandedNodes, handleNodeToggle))}
      </TreeView>
    </Paper>
  );
};


export default TreeViewDemo;
