import React from 'react';
import { isFinite } from 'lodash-es';

import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

function isValidLimit(limit) {
  return isFinite(limit) && limit > 0;
}

function isValidOffset(offset) {
  return isFinite(offset) && offset >= 0;
}

/* Will update the offset property of searchParams only */
export default function Paginator({
  searchParams = {},
  setSearchParams = Function.prototype,
  count,
}) {
  const { limit, offset } = searchParams || {};

  if (!isValidLimit(limit) || !isValidOffset(offset)) return null;

  const page = Math.round(offset / limit);

  const pageCount = Math.ceil(count / limit) - 1;

  const onChangePage = (_, nextPage) => {
    setSearchParams({
      ...searchParams,
      offset: limit * nextPage,
    });
  };

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, pageCount));
  };

  return (
    <div style={{ flexShrink: 0, marginLeft: 12 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= pageCount}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= pageCount}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}
