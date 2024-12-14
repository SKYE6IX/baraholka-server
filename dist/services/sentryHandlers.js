import * as Sentry from "@sentry/node";
export function sentryInfo({ message }) {
    Sentry.captureMessage(message, "info");
}
export function sentryError({ message }) {
    Sentry.captureMessage(message, "error");
}
export function sentrySuccessLog({ message }) {
    Sentry.captureMessage(message, "log");
}
//# sourceMappingURL=sentryHandlers.js.map