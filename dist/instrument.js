import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
Sentry.init({
    dsn: "https://acfbaaae4e2ea022a3039368c2475642@o4505165194067968.ingest.us.sentry.io/4508421371068416",
    integrations: [nodeProfilingIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
Sentry.profiler.startProfiler();
Sentry.startSpan({
    name: "My First Transaction",
}, () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
});
Sentry.profiler.stopProfiler();
//# sourceMappingURL=instrument.js.map