export const intelligentAgentSchema = [
  {
    platformName: 'twitter',
    dividerLabe: 'TWITTER_SETTINGS',
    platformInformationLabel: 'TWITTER_API_KEYS_LABEL',
    platformInformationDescription: 'TWITTER_API_KEY_DESCRIPTION',
    data: {
      enablingField: 'intelligent_agent_twitterbot_enabled',
      fields: [
        {
          label: 'intelligent_agent_twitterbot_enabled',
          requiredIfEnabled: true,
          skipDescription: false,
        },
        {
          label: 'intelligent_agent_twitterbot_consumer_key',
          requiredIfEnabled: true,
          skipDescription: true,
        },
        {
          label: 'intelligent_agent_twitterbot_consumer_secret',
          requiredIfEnabled: true,
          skipDescription: true,
        },
        {
          label: 'intelligent_agent_twitterbot_access_token',
          requiredIfEnabled: true,
          skipDescription: true,
        },
        {
          label: 'intelligent_agent_twitterbot_access_token_secret',
          requiredIfEnabled: true,
          skipDescription: true,
        },
        {
          label: 'intelligent_agent_twitterbot_bearer_token',
          requiredIfEnabled: true,
          skipDescription: true,
        },
      ],
    },
  },
];
