import React from 'react';
import { pick, omit, repeat } from 'lodash-es';
import Skeleton from '@material-ui/lab/Skeleton';

import Text from './Text';
import Link from './Link';

export const superTextTypes = {
  link: 'link',
  text: 'text',
  spacer: 'spacer',
};

function deriveKey(datum) {
  return datum?.key || datum?.id;
}

function SuperTextElement({ datum }) {
  const isSpacer = datum?.type === superTextTypes.spacer;
  const spaces = datum?.spaces || 1;
  if (isSpacer) return repeat(' ', spaces);

  const textProps = omit(datum, ['type', 'hide']);
  return <Text component="span" {...textProps} />;
}

export default function SuperText({
  loading = false,
  skeletonProps = {},
  data,
}) {
  if (loading)
    return <Skeleton height={30} width={200} {...skeletonProps} />;
  return (
    <Text>
      {data.map(datum => {
        if (datum?.hide) return null;
        if (datum?.type === superTextTypes.link) {
          const linkProps = pick(datum, [
            'to',
            'href',
            'disabled',
            'noUnderline',
            'external',
            'newTab',
            'onClick',
          ]);
          const linkStyles = datum?.linkStyles || {};
          return (
            <Link
              key={deriveKey(datum)}
              {...linkProps}
              style={linkStyles}
            >
              <SuperTextElement datum={datum} />
            </Link>
          );
        } else {
          return (
            <SuperTextElement key={deriveKey(datum)} datum={datum} />
          );
        }
      })}
    </Text>
  );
}
