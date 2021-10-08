import React from 'react';
import { get } from 'lodash-es';

import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ButtonLink from './components/ButtonLink';
import Button from './components/Button';
import Text from './components/Text';
import savanna from './assets/savanna.jpeg';

const initialState = {
  hasError: false,
  errorName: '',
  errorMessage: '',
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorName: get(error, 'name', 'Unnamed Error'),
      errorMessage: get(error, 'message', 'No details available.'),
    };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          backgroundImage: `url(${savanna})`,
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <Paper
            style={{
              margin: '100px 20px 0 20px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffffc2',
              padding: 20,
            }}
          >
            <Text variant="h4">An error occurred</Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Button
                style={{
                  width: '100%',
                  marginTop: 12,
                }}
                display="primary"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reload the page
              </Button>
              <ButtonLink
                style={{
                  width: '100%',
                  marginTop: 8,
                }}
                display="secondary"
                onClick={() => this.setState(initialState)}
                to="/"
              >
                Return home
              </ButtonLink>
              <ButtonLink
                style={{
                  width: '100%',
                  marginTop: 8,
                }}
                href="https://community.wildme.org/"
                display="tertiary"
                external
                newTab
              >
                Report to community
              </ButtonLink>
            </div>
            <div
              style={{ marginTop: 20, width: '100%', maxWidth: 400 }}
            >
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Text variant="h6">View error details</Text>
                </AccordionSummary>
                <AccordionDetails
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Text variant="h5">{this.state.errorName}</Text>
                  <Text variant="body2">
                    {this.state.errorMessage}
                  </Text>
                </AccordionDetails>
              </Accordion>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
