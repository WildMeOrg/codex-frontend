import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Skeleton from '@material-ui/lab/Skeleton';
import Button from '../../../components/Button';
import useAcmImageData from './useAcmImageData';
import AcmImage from './AcmImage';

function PairContainer(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
      {...props}
    />
  );
}

export default function JobModal({ open, onClose, acmId }) {
  const { data, loading, error } = useAcmImageData(acmId);

  const dataReady = !loading && !error;
  const annotations = data || [];

  return (
    <div>
      <Dialog maxWidth="xl" open={open} onClose={onClose}>
        <DialogTitle onClose={onClose}>
          {`Matching job ${acmId}`}
          <IconButton
            style={{ position: 'absolute', top: 8, right: 16 }}
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 24 }}>
          {loading && (
            <PairContainer>
              <Skeleton
                variant="rect"
                width="40vw"
                height={400}
                style={{ margin: 16 }}
              />
              <Skeleton variant="rect" width="200px" height={200} />
              <Skeleton
                variant="rect"
                width="40vw"
                height={400}
                style={{ margin: 16 }}
              />
            </PairContainer>
          )}
          {error && (
            <Typography>
              Something went wrong. Check the console for details.
            </Typography>
          )}
          {dataReady &&
            annotations.map(annotation => (
              <PairContainer key={annotation.id}>
                <AcmImage
                  annotation={annotation}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 300,
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ textDecoration: 'underline' }}
                  >
                    <FormattedMessage id="THIS_PAIR" />
                  </Typography>
                  <Typography>Hotspotter 0.52</Typography>
                  <Typography>Curvrank 0.74</Typography>
                  <Button display="primary" style={{ marginTop: 8 }}>
                    <FormattedMessage id="MATCH" />
                  </Button>
                </div>
                <AcmImage
                  annotation={annotation}
                />
              </PairContainer>
            ))}
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button
            display="basic"
            onClick={() => {
              onClose();
            }}
          >
            <FormattedMessage id="CANCEL" />
          </Button>
          <Button
            display="primary"
            onClick={() => {
              onClose();
            }}
          >
            <FormattedMessage id="CONFIRM" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
