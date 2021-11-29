import React from 'react';
import { get } from 'lodash-es';

import { withTheme } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import BaoSpills from './components/svg/BaoSpills';
import ButtonLink from './components/ButtonLink';
import Button from './components/Button';
import Text from './components/Text';

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

    const { theme } = this.props;
    const themeColor = theme.palette.primary.main;
    const themeColorLight = lighten(themeColor, 0.35);

    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <BaoSpills
          style={{
            maxWidth: 580,
            width: '80vw',
            margin: '60px 0 40px 0',
          }}
          themeColor={theme.palette.primary.main}
          themeColorLight={themeColorLight}
        />
        <div>
          <Text variant="h4" id="AN_ERROR_OCCURRED" />
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
              id="RELOAD_THE_PAGE"
            />
            <ButtonLink
              style={{
                width: '100%',
                marginTop: 8,
              }}
              display="secondary"
              onClick={() => this.setState(initialState)}
              href="/"
              id="RETURN_HOME"
            />
            <ButtonLink
              style={{
                width: '100%',
                marginTop: 8,
              }}
              href="https://community.wildme.org/"
              display="tertiary"
              external
              newTab
              id="REPORT_TO_COMMUNITY"
            />
          </div>
          <div
            style={{ marginTop: 20, width: '100%', maxWidth: 400 }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Text variant="h6" id="VIEW_ERROR_DETAILS" />
              </AccordionSummary>
              <AccordionDetails
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Text variant="h5">{this.state.errorName}</Text>
                <Text variant="body2">{this.state.errorMessage}</Text>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    );
  }
}

export default withTheme(ErrorBoundary);
