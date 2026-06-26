import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://e29c497783848f45ff6e398a878829ae@o4511632499343360.ingest.de.sentry.io/4511632512647248",
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
