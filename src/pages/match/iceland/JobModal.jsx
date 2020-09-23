import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, debounce } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import useAcmImageData, {
  fetchAcmImageData,
} from './useAcmImageData';
import useIaLogs from './useIalogs';
import AcmImage from './AcmImage';
import Candidates from './Candidates';
import ActionButton from './ActionButton';

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
    data: annotations,
    loading: targetLoading,
    error: targetError,
    setLoading: setTargetLoading,
  } = useAcmImageData(acmId);

  const {
    data: candidates,
    loading: iaLogsLoading,
    error: iaLogsError,
    setLoading: setIaLogsLoading,
  } = useIaLogs(taskId, acmId);

  const [selectedCandidateId, setSelectedCandidateId] = useState(
    null,
  );

  const [
    selectedCandidateAnnotation,
    setSelectedCandidateAnnotation,
  ] = useState(null);

  const theme = useTheme();

  let activeCandidate = null;
  let activeCandidateScore = '-';
  let activeCandidateIndex = 0;
  if (candidates) {
    activeCandidate =
      candidates.find(c => c.id === selectedCandidateId) ||
      candidates[0];

    activeCandidateIndex = candidates.findIndex(
      c => c.id === selectedCandidateId,
    );
    if (activeCandidateIndex === -1) activeCandidateIndex = 0;

    const stringScore = get(activeCandidate, 'score');
    activeCandidateScore = stringScore
      ? parseFloat(stringScore).toFixed(2)
      : '-';
  }

  useEffect(
    () => {
      const fetchSelectedCandidateData = async () => {
        try {
          if (
            candidates &&
            candidates.length > 0 &&
            !selectedCandidateId
          ) {
            const data = await fetchAcmImageData(candidates[0].id);
            setSelectedCandidateAnnotation(data[0]);
          }

          if (selectedCandidateId) {
            const data = await fetchAcmImageData(selectedCandidateId);
            setSelectedCandidateAnnotation(data[0]);
          }
        } catch (error) {
          setSelectedCandidateAnnotation(null);
        }
      };
      fetchSelectedCandidateData();
    },
    [selectedCandidateId, get(candidates, 'length')],
  );

  const loading = targetLoading || iaLogsLoading;
  const error = targetError || iaLogsError;
  const dataReady = !loading && !error;
  const showMatches =
    dataReady && candidates && candidates.length > 0;
  const noCandidates = dataReady && !showMatches;

  const closeModal = () => {
    setSelectedCandidateId(null);
    setSelectedCandidateAnnotation(null);
    setIaLogsLoading(true);
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

  return (
    <div>
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
            <Alert severity="error">
              Something went wrong. Check the console for additional
              details.
            </Alert>
          )}
          {noCandidates && (
            <Alert severity="warning">
              No match candidates were identified for this annotation.
            </Alert>
          )}
          {showMatches &&
            annotations.map(annotation => (
              <PairContainer key={annotation.id}>
                <AcmImage
                  annotation={annotation}
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
                  <Typography>{`Hotspotter ${activeCandidateScore}`}</Typography>
                  <ActionButton
                    annotation1={annotation}
                    annotation2={selectedCandidateAnnotation}
                    style={{ marginTop: 8 }}
                  />
                </div>
                <Candidates
                  annotation={selectedCandidateAnnotation}
                  setSelectedCandidateId={setSelectedCandidateId}
                  candidates={candidates}
                  activeCandidateIndex={activeCandidateIndex}
                  style={{ width: imageWidth }}
                />
              </PairContainer>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
