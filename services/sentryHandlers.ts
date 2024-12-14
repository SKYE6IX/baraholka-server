import * as Sentry from "@sentry/node";

type SentryData = {
    message: string;
};

export function sentryInfo({ message }: SentryData) {
    Sentry.captureMessage(message, "info");
}
export function sentryError({ message }: SentryData) {
    Sentry.captureMessage(message, "error");
}
export function sentrySuccessLog({ message }: SentryData) {
    Sentry.captureMessage(message, "log");
}
