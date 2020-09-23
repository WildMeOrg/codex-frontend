import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { debounce } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import useAcmImageData from './useAcmImageData';
import useCandidates from './useCandidates';
import AcmImage from './AcmImage';
import ActionButton from './ActionButton';
import AlertModal from './AlertModal';

const actionAreaWidth = 160;

function PairContainer(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
      }}
      {...props}
    />
  );
}

export default function JobModal({ open, onClose, acmId, taskId }) {
  const [screenWidth, setScreenWidth] = useState(null);

  useEffect(() => {
    const recordScreenWidth = () => setScreenWidth(window.innerWidth);
    const debouncedRecordScreenWidth = debounce(
      recordScreenWidth,
      200,
    );
    window.addEventListener('resize', debouncedRecordScreenWidth);
    recordScreenWidth();

    return () => {
      window.removeEventListener(
        'resize',
        debouncedRecordScreenWidth,
      );
    };
  }, []);

  const modalWidth = screenWidth * 0.9;
  const imageWidth = 0.5 * (modalWidth - actionAreaWidth);

  const {
    data: targetAnnotation,
    loading: targetLoading,
    error: fetchTargetError,
    setLoading: setTargetLoading,
  } = useAcmImageData(acmId);

  const {
    data: candidates,
    loading: candidatesLoading,
    error: fetchCandidatesError,
    setLoading: setCandidatesLoading,
  } = useCandidates(taskId, acmId);

  const theme = useTheme();

  const loading = targetLoading || candidatesLoading;
  const error = fetchTargetError || fetchCandidatesError;
  const dataReady = !loading && !error;
  const showMatches =
    dataReady &&
    targetAnnotation &&
    candidates &&
    candidates.length > 0;
  const noCandidates = dataReady && !showMatches;

  const closeModal = () => {
    setCandidatesLoading(true);
    setTargetLoading(true);
    onClose();
  };

  if (loading && open) {
    return (
      <Backdrop open style={{ zIndex: 1 }}>
        <CircularProgress
          style={{ color: theme.palette.common.white }}
        />
      </Backdrop>
    );
  }

  if (error || noCandidates) {
    const title = error ? 'Error' : 'No match candidates';
    const severity = error ? 'error' : 'warning';
    const message = error
      ? 'Something went wrong. Check the console for additional details.'
      : 'No match candidates were identified for this annotation.';
    return (
      <AlertModal
        open
        onClose={closeModal}
        title={title}
        severity={severity}
      >
        {message}
      </AlertModal>
    );
  }

  if (showMatches) {
    return (
      <Dialog
        PaperProps={{ style: { width: '90vw', maxWidth: 'unset' } }}
        open={open}
        onClose={closeModal}
      >
        <DialogTitle onClose={closeModal}>
          {candidates && `${candidates.length} match candidates`}
          <IconButton
            style={{ position: 'absolute', top: 8, right: 16 }}
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 24 }}>
          {candidates.map(candidate => {
            const score = candidate.score
              ? parseFloat(candidate.score).toFixed(2)
              : '-';
            return (
              <PairContainer key={candidate.id}>
                <AcmImage
                  annotation={targetAnnotation}
                  style={{ width: imageWidth }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: actionAreaWidth,
                    minWidth: actionAreaWidth,
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ textDecoration: 'underline' }}
                  >
                    <FormattedMessage id="THIS_PAIR" />
                  </Typography>
                  <Typography>{`Hotspotter ${score}`}</Typography>
                  <ActionButton
                    annotation1={targetAnnotation}
                    annotation2={candidate.annotation}
                    style={{ marginTop: 8 }}
                  />
                </div>
                <AcmImage
                  annotation={candidate.annotation}
                  style={{ width: imageWidth }}
                />
              </PairContainer>
            );
          })}
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
