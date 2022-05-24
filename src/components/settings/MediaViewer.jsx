import React from 'react';
import ReactPlayer from 'react-player';
import Paper from '@material-ui/core/Paper';
import VideoIcon from '@material-ui/icons/Movie';

import Text from '../Text';
import MediaDeleteButton from './MediaDeleteButton';

export default function MediaViewer({
  variant = 'image',
  url,
  label,
  includeDeleteButton = false,
  settingKey,
  setPreviewUrl = Function.prototype,
  setPreviewText = Function.prototype,
  onSetPostData = Function.prototype,
  shouldTryDelete = false,
}) {
  if (variant === 'image' && url) {
    return (
      <div
        key="zeroith"
        style={{ position: 'relative', width: 'min-content' }}
      >
        <MediaDeleteButton
          includeDeleteButton={includeDeleteButton}
          url={url}
          variant={variant}
          settingKey={settingKey}
          setPreviewUrl={setPreviewUrl}
          setPreviewText={setPreviewText}
          onSetPostData={onSetPostData}
          shouldTryDelete={shouldTryDelete}
        >
          <img
            alt={label}
            style={{
              maxHeight: 240,
              maxWidth: 240,
              height: 'auto',
              width: 'auto',
            }}
            src={url}
          />
        </MediaDeleteButton>
      </div>
    );
  } else if (variant === 'video' && url) {
    return (
      <div key="fourth" style={{ position: 'relative' }}>
        <MediaDeleteButton
          includeDeleteButton={includeDeleteButton}
          url={url}
          variant={variant}
          settingKey={settingKey}
          setPreviewUrl={setPreviewUrl}
          setPreviewText={setPreviewText}
          onSetPostData={onSetPostData}
          shouldTryDelete={shouldTryDelete}
        >
          <ReactPlayer
            url={url}
            height={240}
            width={360}
            muted
            autoPlay
            playing
            controls
          />
        </MediaDeleteButton>
      </div>
    );
  } else if (variant === 'video' && !url) {
    return (
      <div key="five">
        <MediaDeleteButton
          includeDeleteButton={includeDeleteButton}
          variant={variant}
          settingKey={settingKey}
          setPreviewUrl={setPreviewUrl}
          setPreviewText={setPreviewText}
          onSetPostData={onSetPostData}
          shouldTryDelete={shouldTryDelete}
        >
          <Paper
            style={{
              display: 'flex',
              padding: 20,
              alignItems: 'center',
            }}
          >
            <VideoIcon style={{ marginRight: 8 }} fontSize="large" />
            <Text variant="subtitle1">
              {label || 'Filename unavailable'}
            </Text>
          </Paper>
        </MediaDeleteButton>
      </div>
    );
  }
  return <Text>{label}</Text>;
}
