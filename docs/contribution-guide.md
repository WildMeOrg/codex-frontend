# Contribution guide

This document covers the conventions and paradigms used in this codebase. We generally try to keep things simple in hopes that it will be easy to dive in and contribute.

## Components

We rely heavily on Material UI. When a component exists in Material UI, use it instead of creating one by hand.

## Styles

- Currently we use inline styles. The plan is to continue doing so until performance issues arise.
- We use a 4px grid system. All padding, margins, and widths should be divisible by 4.
- When using the main theme colors (white, black, or purple), please use Material UI's useTheme hook.

## Global state

There are a few things stored in context, but mostly pages fetch their own data.

## Translations

All displayed text must support translation - for this we use `react-intl`. Translation keys are verbatum English abbreviations of the displayed text in all caps. You can see some examples in `/locale/en.json`.

If you want to help translate the project, that is very much appreciated and needed, but please don't do it by manually editing files in `/locale`. Your changes will wind up getting overwritten by Lokalise.

## Lodash 

We frequently use a utility library called [lodash](https://lodash.com/docs/). When importing a utility function, be sure to use named imports rather than importing the entire library to reduce our bundle size. One incorrect import will cause the entire library to be bundled with the application.

```
import _ from 'lodash-es'; // incorrect, please don't do this
_.random(10);

import { random } from 'lodash-es'; // correct!
random(10);
```

In situations where a lodash utility and a native utility exist, we should use the native utility unless there is a reason to use lodash (eg. native JS `map` instead of `_.map()`).

## Conventions

- Any file with a React component should have the suffix `.jsx`
- Data fetching goes in `/src/models`
- Code specific to a certain page goes in `/src/pages`
- Components that are reused widely go in `/src/components`
- Post any questions in Github issues or send an email to ben@wildme.org
- Thanks for contributing =)

## Release procedure

Please refer to [this document](https://github.com/WildMeOrg/codex-frontend/blob/develop/docs/release-procedure.md) for guidelines on making a new release.

## Making a hotfix

Likely you won't need to make a hotfix unless you are a Wild Me employee, but if the need arises please follow the [hotfix procedures](https://github.com/WildMeOrg/codex-frontend/blob/develop/docs/hotfix-procedure.md).
