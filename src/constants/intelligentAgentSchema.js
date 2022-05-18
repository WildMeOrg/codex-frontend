import TwitterIcon from '@material-ui/icons/Twitter';

export const intelligentAgentSchema = [
  {
    platformName: 'twitter',
    userMetadataKey: 'twitter_username',
    viewLabelId: 'TWITTER_HANDLE',
    editLabelId: 'TWITTER_HANDLE_NO_AT',
    icon: TwitterIcon,
    dividerLabel: 'TWITTER_SETTINGS',
    platformInformationLabel: 'TWITTER_API_KEYS_LABEL',
    platformInformationDescription: 'TWITTER_API_KEY_DESCRIPTION',
    apiDocumentationUrlLabel: 'TWITTER_API_DOCUMENTATION_URL_LABEL',
    apiDocumentationUrl:
      'https://developer.twitter.com/en/portal/dashboard',
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
