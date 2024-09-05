# @trinsic/react-native-ui

Helper methods to launch and capture the results of a Trinsic verification

## Installation

```sh
npm install @trinsic/react-native-ui
```

## Usage

```js
import { launchSession } from '@trinsic/react-native-ui';

// ...

const launchUrl = ''; //get this from your backend creating a session using the createSession API
const result = await launchSession(
  launchUrl,
  'yourAppsScheme://your-callback-url'
);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
