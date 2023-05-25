import React from 'react';
import { range } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '../Button';
import Text from '../Text';
import Card from './Card';
import Grid from '@material-ui/core/Grid';
import { Paper, Link, Typography, Box } from '@material-ui/core';


export default function CustomControlCard({
  title,
  titleId,
  allSettings,
  handleClick,
}) {
  let count = 0;

  return (
    
      <Grid item xs={12} sm={6} md={4}>
      <Paper style={{margin: "20px, 20px, 20px", padding:20, minHeight: 700}}>
      <Typography 
                style={{
                  marginBottom: 20 }} 
                >
                Customization Control Center
                </Typography>  
                {
                  allSettings.map(data => {
                    return (
                      <div 
                        key = {count++} 
                        onClick = { () => {
                          handleClick(data.toLocaleLowerCase().replace(/\s/g, '_'));                                                
                        }}
                        >
                        <Link                           
                          href = "#" 
                          style={{ 
                            display: 'flex', 
                            marginBottom: '10%' 
                            }}>
                          <Box style={
                            {
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              pointer: 'cursor',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#7562C6',
                              backgroundColor: '#F3F1FE',
                              color: 'white',
                              marginBottom: '5px',
                              marginRight: '10px'
                            }
                          }>{count}</Box>
                          <Text>{data}</Text>                          
                        </Link>
                        </div>
                    )
                    
                  })
                }
      </Paper>
      </Grid>
  );
}
