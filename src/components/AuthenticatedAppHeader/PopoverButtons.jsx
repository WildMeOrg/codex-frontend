import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Select from '@material-ui/core/Select';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
// import ProjectsIcon from '@material-ui/icons/GroupWork';
import SearchIcon from '@material-ui/icons/Search';
import SightingsIcon from '@material-ui/icons/PhotoCamera';
import AddIcon from '@material-ui/icons/Add';

import FilterBar from '../FilterBar';
import Button from '../Button';
import ButtonLink from '../ButtonLink';
import Text from '../Text';
import Link from '../Link';
// import fakeProjects from './fakeProjects';
import fakeSightings from './fakeSightings';
import IndividualsButton from './IndividualsButton';

// function ProjectsButton({ titleId }) {
//   const intl = useIntl();
//   const theme = useTheme();
//   const title = intl.formatMessage({ id: titleId });
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [selectedProject, setSelectedProject] = React.useState('abc');

//   const handleClick = event => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;

//   return (
//     <div>
//       <Button
//         aria-describedby={id}
//         display="basic"
//         onClick={handleClick}
//         style={{ color: theme.palette.common.white }}
//       >
//         {title}
//       </Button>
//       <Popover
//         onClose={handleClose}
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'center',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'center',
//         }}
//         PaperProps={{
//           style: {
//             width: 300,
//             padding: '20px 20px 8px 20px',
//           },
//         }}
//       >
//         <InputLabel shrink>Active project</InputLabel>
//         <Select
//           value="abc"
//           style={{ width: '100%', marginBottom: 24 }}
//         >
//           {fakeProjects.map(project => (
//             <MenuItem value={project.id}>{project.name}</MenuItem>
//           ))}
//         </Select>
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>
//             Your projects
//           </Text>
//           <IconButton onClick={handleClose} size="small">
//             <AddIcon />
//           </IconButton>
//         </div>

//         <List
//           dense
//           style={{ width: 260, height: 210, overflow: 'scroll' }}
//         >
//           {fakeProjects.map(project => {
//             const selected = selectedProject === project.id;
//             return (
//               <ListItem
//                 style={{
//                   background: selected
//                     ? theme.palette.grey['300']
//                     : theme.palette.grey['100'],
//                 }}
//               >
//                 <ListItemText
//                   primary={
//                     <Link href="/projects/noaa" onClick={handleClose}>
//                       {project.name}
//                     </Link>
//                   }
//                   secondary={
//                     <Text variant="caption">{project.pid}</Text>
//                   }
//                 />
//               </ListItem>
//             );
//           })}
//         </List>
//         <ButtonLink
//           onClick={handleClose}
//           href="/projects"
//           display="basic"
//           style={{ margin: '4px 0 12px' }}
//         >
//           View all projects
//         </ButtonLink>
//       </Popover>
//     </div>
//   );
// }

function EntityButton({
  titleId,
  entities,
  noAvatar,
  exploreHref,
  exploreButtonId,
  createHref,
}) {
  const intl = useIntl();
  const theme = useTheme();
  const title = intl.formatMessage({ id: titleId });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        display="primary"
        onClick={handleClick}
        style={{
          backgroundColor: theme.palette.grey.A100,
          color: theme.palette.grey.A400,
          marginLeft: 8,
        }}
        startIcon={<SearchIcon />}
      >
        {title}
      </Button>
      <Popover
        onClose={handleClose}
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            width: 300,
            padding: '20px 20px 8px 20px',
          },
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>
            {title}
          </Text>
          <Link href={createHref}>
            <IconButton onClick={handleClose} size="small">
              <AddIcon />
            </IconButton>
          </Link>
        </div>
        <FilterBar
          value=""
          style={{ with: 160, margin: '12px 0 4px 0' }}
        />
        <List
          dense
          style={{ width: 260, height: 210, overflow: 'scroll' }}
        >
          {entities.map(entity => (
            <ListItem
              style={{
                background: theme.palette.grey['100'],
              }}
              key={entity.id}
            >
              {!noAvatar && (
                <ListItemAvatar>
                  <Avatar>A</Avatar>
                </ListItemAvatar>
              )}
              <ListItemText
                primary={
                  <Link
                    onClick={handleClose}
                    href="/individuals/teddy"
                  >
                    {entity.name}
                  </Link>
                }
                secondary={
                  <Text variant="caption">{entity.pid}</Text>
                }
              />
            </ListItem>
          ))}
        </List>
        <ButtonLink
          onClick={handleClose}
          href={exploreHref}
          display="primary"
          style={{ margin: '8px 0 12px' }}
        >
          <FormattedMessage id={exploreButtonId} />
        </ButtonLink>
      </Popover>
    </div>
  );
}

export default function PopoverButtons() {
  return (
    <div style={{ display: 'flex' }}>
      <IndividualsButton />
      <EntityButton
        titleId="SIGHTINGS"
        exploreButtonId="EXPLORE_SIGHTINGS"
        exploreHref="/sightings"
        createHref="/report"
        Icon={SightingsIcon}
        value="sightings"
        entities={fakeSightings}
        noAvatar
      />
      {/* <ProjectsButton
        titleId="PROJECTS"
        href="/projects"
        Icon={ProjectsIcon}
        value="projects"
      /> */}
    </div>
  );
}
