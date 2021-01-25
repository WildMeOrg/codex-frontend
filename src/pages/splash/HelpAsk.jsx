import React from 'react';
import { FormattedMessage } from 'react-intl';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';

export default function HelpAsk() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        margin: '64px 0',
      }}
    >
      <Text
        responsive
        variant="h2"
        style={{ margin: '12px 0' }}
        id="HOW_CAN_HELP"
      />
      <Text
        responsive
        mobileStyle={{
          lineHeight: '30px',
          fontSize: 20,
        }}
        desktopStyle={{
          lineHeight: '45px',
          fontSize: 24,
        }}
        style={{
          maxWidth: 900,
          padding: '32px 20px 40px 32px',
          letterSpacing: '0.04em',
        }}
        id="HOW_CAN_HELP_DESCRIPTIONS"
      />
      <div>
        <ButtonLink
          display="marketing"
          style={{
            margin: '12px 12px 0 12px',
            minWidth: 120,
          }}
          href="/report"
        >
          <FormattedMessage id="REPORT_SIGHTINGS" />
        </ButtonLink>
        <ButtonLink
          display="marketing"
          style={{
            margin: '12px 12px 0 12px',
            minWidth: 200,
          }}
          href="https://www.wildme.org/donate/"
          external
        >
          <FormattedMessage id="MAKE_A_DONATION" />
        </ButtonLink>
      </div>
    </div>
  );
}
