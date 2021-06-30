import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import RightIcon from '@material-ui/icons/ChevronRight';
import LeftIcon from '@material-ui/icons/ChevronLeft';

import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import Button from '../../../components/Button';
import InlineButton from '../../../components/InlineButton';
import AcmImage from './AcmImage';

const popoverId = 'icelandSelectionPopover';

export default function Candidates({
  annotation,
  candidates,
  setSelectedCandidateId,
  activeCandidateIndex,
  ...rest
}) {
  const [popoverData, setPopoverData] = useState(null);

  if (!annotation) return null;

  return (
    <div style={{ flexGrow: 1 }}>
      <Popover
        id={popoverId}
        open={Boolean(popoverData)}
        anchorEl={get(popoverData, 'element', null)}
        onClose={() => setPopoverData(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{ margin: 20 }}>
          <DataDisplay
            noTitleBar
            initiallySelectedRow={annotation.acmId}
            columns={[
              {
                name: 'id',
                label: 'Candidate ID',
                options: {
                  customBodyRender: id => (
                    <InlineButton
                      onClick={event => {
                        event.stopPropagation();
                        setPopoverData(null);
                        setSelectedCandidateId(id);
                      }}
                    >
                      {id}
                    </InlineButton>
                  ),
                },
              },
              {
                name: 'score',
                label: 'Hotspotter score',
                options: {
                  customBodyRender: score =>
                    parseFloat(score).toFixed(2),
                },
              },
            ]}
            data={candidates || []}
          />
        </div>
      </Popover>
      <AcmImage
        annotation={annotation}
        renderTitleButton={() => (
          <Button
            display="panel"
            size="small"
            onClick={event =>
              setPopoverData({
                element: event.currentTarget,
              })
            }
          >
            <FormattedMessage id="CHANGE" />
          </Button>
        )}
        {...rest}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: 'white',
            border: '1px solid grey',
            borderRadius: 12,
            opacity: 0.9,
          }}
        >
          <IconButton
            disabled={!get(candidates, activeCandidateIndex - 1)}
            onClick={() => {
              const previousCandidate =
                candidates[activeCandidateIndex - 1];
              setSelectedCandidateId(previousCandidate.id);
            }}
            style={{ padding: 8 }}
          >
            <LeftIcon />
          </IconButton>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'white',
            border: '1px solid grey',
            borderRadius: 12,
            opacity: 0.9,
          }}
        >
          <IconButton
            disabled={!get(candidates, activeCandidateIndex + 1)}
            onClick={() => {
              const nextCandidate =
                candidates[activeCandidateIndex + 1];
              setSelectedCandidateId(nextCandidate.id);
            }}
            style={{ padding: 8 }}
          >
            <RightIcon />
          </IconButton>
        </div>
      </AcmImage>
    </div>
  );
}
