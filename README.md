# acting-game
Show some emotion on your face!

This JavaScript-based demo webapp for an article in [c't Magazin 18/2017](http://ct.de/) picks randomly one of eight emotions - and you express this emotion with your face. Microsoft Azure's Emotion API, one of their [Cognitive Services](https://docs.microsoft.com/de-de/azure/cognitive-services/), tries to detect your emotion and tells you how good you've acted.

The app comes in four flavours: `simplified` corresponds to the programme code described in the c't Magazin article; `standard` is a slightly enhanced version. Both versions also have a `with-proxy` variant which passes requests to the API through a simple PHP proxy instead of including the API key openly in the JavaScript code. The proxy is located in the `proxy` directory. Otherwise, the proxy versions of the app are functionally identical.

Live Demo: [Standard version](https://woerter.de/projects/cognitive-services/game/) and [simplified version](https://woerter.de/projects/cognitive-services/game-simplified/).

See also: [Dictator app](https://github.com/wortwart/dictator).
