export const intelligentAgentSchema = [
  {
    twitter: {
      enablingField: 'intelligent_agent_twitterbot_enabled',
      fields: [
        {
          intelligent_agent_twitterbot_enabled: {
            requiredIfEnabled: true,
            skipDescription: false,
          },
        },
        {
          intelligent_agent_twitterbot_consumer_key: {
            requiredIfEnabled: true,
            skipDescription: true,
          },
        },
        {
          intelligent_agent_twitterbot_consumer_secret: {
            requiredIfEnabled: true,
            skipDescription: true,
          },
        },
        {
          intelligent_agent_twitterbot_access_token: {
            requiredIfEnabled: true,
            skipDescription: true,
          },
        },
        {
          intelligent_agent_twitterbot_access_token_secret: {
            requiredIfEnabled: true,
            skipDescription: true,
          },
        },
        {
          intelligent_agent_twitterbot_bearer_token: {
            requiredIfEnabled: true,
            skipDescription: true,
          },
        },
      ],
    },
  },
];
