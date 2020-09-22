import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';

import useDimensions from '../../../hooks/useDimensions';
import useAcmImageData, {
  fetchAcmImageData,
} from './useAcmImageData';
import useIaLogs from './useIalogs';
import AcmImage from './AcmImage';
import Candidates from './Candidates';
import ActionButton from './ActionButton';

function PairContainer({ renderChildren = () => null, ...rest }) {
  const containerRef = useRef(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
      }}
      {...rest}
    >
      {renderChildren(width)}
    </div>
  );
}

export default function JobModal({ open, onClose, acmId, taskId }) {
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
            <PairContainer
              renderChildren={() => (
                <React.Fragment>
                  <Skeleton
                    variant="rect"
                    width="40vw"
                    height={400}
                    style={{ margin: 16 }}
                  />
                  <Skeleton
                    variant="rect"
                    width="200px"
                    height={200}
                  />
                  <Skeleton
                    variant="rect"
                    width="40vw"
                    height={400}
                    style={{ margin: 16 }}
                  />
                </React.Fragment>
              )}
            />
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
              <PairContainer
                key={annotation.id}
                renderChildren={width => {
                  const cardWidth = 0.5 * (width - 160);
                  return (
                    <>
                      <AcmImage
                        annotation={annotation}
                        style={{ width: cardWidth }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: 160,
                          minWidth: 160,
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
                        setSelectedCandidateId={
                          setSelectedCandidateId
                        }
                        candidates={candidates}
                        activeCandidateIndex={activeCandidateIndex}
                        style={{ width: cardWidth }}
                      />
                    </>
                  );
                }}
              />
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
