import { TrackInfo } from '.';

/**
 * @howto Extends the global `Window` interface to include properties for tracking events and storing digital data.
 *
 * @property _satellite - An object containing a `track` method for tracking events.
 * @property _satellite.track - A function that tracks an event with an optional data payload.
 * @property digitalData - A record for storing various digital data.
 */
interface WindowTracker extends Window {
  _satellite: {
    track: (event: string, data?: TrackInfo) => Promise<void>;
  };
  digitalData: Record<string, unknown>;
}

declare const window: WindowTracker;

export const _window = window;
