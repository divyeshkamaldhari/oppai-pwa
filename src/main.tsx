import { BrowserRouter } from "react-router";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./Components/CometChat/styles/sound-disable.css";
import "./Components/CometChat/styles/safari-fixes.css";
import InitialiseCometChat from "./initialiseCometChat";
import { store } from "./redux/store";
import "./index.css";
import Clarity from "@microsoft/clarity";
import ErrorFallback from "./Components/ErrorBoundryFallback";
import { ErrorBoundary } from "react-error-boundary";

const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID ?? "t63nz51pph";

Clarity.init(projectId);

// import * as Sentry from "@sentry/react";

// Configure Sentry to work in isolated mode to prevent conflicts
// Sentry.setContext("app", {
//     name: "Oppai Dragon PWA",
//     version: "1.0.0"
//   });

// Sentry.init({
//   dsn: "https://2592e67977d81ebb67c0f4dfb9806252@o4509835393236992.ingest.us.sentry.io/4509966932180992",
//   // Setting this option to true will send default PII data to Sentry.
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true
// });

// Sentry.init({
//     dsn: "https://2592e67977d81ebb67c0f4dfb9806252@o4509835393236992.ingest.us.sentry.io/4509966932180992",
//     // Setting this option to true will send default PII data to Sentry.
//     // For example, automatic IP address collection on events
//     sendDefaultPii: true,

//     // Additional configuration to prevent conflicts
//     environment: process.env.NODE_ENV || 'production',

//     // Prevent conflicts with other scripts by isolating Sentry's scope
//     beforeSend(event, hint) {
//       // Filter out events from conflicting scripts
//       if (event.exception) {
//         const error = hint.originalException;
//         if (error && typeof error === 'object' && 'message' in error) {
//           const message = (error as Error).message;
//           // Ignore flowguard and similar script conflicts
//           if (message.includes('Identifier') && message.includes('already been declared')) {
//             return null;
//           }
//           // Ignore specific variable conflicts
//           if (message.includes('Si') && message.includes('already been declared')) {
//             return null;
//           }
//         }
//       }

//       // Filter out events from iframe contexts that might cause conflicts
//       if (event.tags && event.tags.url && typeof event.tags.url === 'string' && event.tags.url.includes('flowguard')) {
//         return null;
//       }

//       return event;
//     }
//   });

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    <Provider store={store}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BrowserRouter>
                <InitialiseCometChat />
            </BrowserRouter>
        </ErrorBoundary>
    </Provider>,
);
