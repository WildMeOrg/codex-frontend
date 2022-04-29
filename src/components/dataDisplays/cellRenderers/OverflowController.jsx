import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash-es';

import Tooltip from '@material-ui/core/Tooltip';

const noWrapStyles = {
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
};

export default function OverflowController({ title, children }) {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [refEl, setRefEl] = useState();

  const ref = useCallback(node => {
    setRefEl(node);
  }, []);

  useEffect(
    () => {
      if (!refEl) return;

      const debouncedHandleResize = debounce(function handleResize() {
        const { clientWidth, scrollWidth } = refEl;
        const overflow = scrollWidth - clientWidth > 0;
        setIsOverflowed(overflow);
      }, 200);

      const resizeObserver = new ResizeObserver(
        debouncedHandleResize,
      );
      resizeObserver.observe(refEl);

      return function unobserveResizeObserver() {
        resizeObserver.unobserve(refEl);
      };
    },
    [refEl],
  );

  const childrenWithStyles = React.cloneElement(
    React.Children.only(children),
    {
      ref,
      style: noWrapStyles,
    },
  );

  return (
    <Tooltip
      title={title}
      disableFocusListener={!isOverflowed}
      disableHoverListener={!isOverflowed}
      disableTouchListener={!isOverflowed}
    >
      {childrenWithStyles}
    </Tooltip>
  );
}
