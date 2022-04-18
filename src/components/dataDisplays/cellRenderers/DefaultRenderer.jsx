import React, { forwardRef } from 'react';

function DefaultRenderer({ value }, ref) {
  return <span ref={ref}>{value || ''}</span>;
}

export default forwardRef(DefaultRenderer);
