import React from 'react';
import { get } from 'lodash-es';

export default function AnnotatedPhotograph({
  src,
  width = 300,
  annotations = [],
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height: width }}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      width={300}
    >
      <image href={src} x={0} y={0} height="100%" width="100%" />
      {annotations.map(annotation => {
        const x = get(annotation, ['bounds', 'rect', '0']);
        const y = get(annotation, ['bounds', 'rect', '1']);
        const w = get(annotation, ['bounds', 'rect', '2']);
        const h = get(annotation, ['bounds', 'rect', '3']);
        return (
          <rect
            fill="none"
            stroke="black"
            strokeWidth={2}
            x={`${x}%`}
            y={`${y}%`}
            width={`${w}%`}
            height={`${h}%`}
          />
        );
      })}
    </svg>
  );
}
