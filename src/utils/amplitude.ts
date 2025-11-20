import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

function initAmplitude() {
    amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
    amplitude.init("cf6e713ed0925b026086bb6bdab2aa2a", { autocapture: true });
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;
