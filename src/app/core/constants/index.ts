import packageJson from '../../../../package.json';

export * from './quote.constants';

export const APP_NAME = packageJson.name;
export const APP_VERSION = packageJson.version;
export const DEBOUNCE_TIME = 500;
export const SCHEDULER_PERIOD = 1 * 60 * 1000; // Minutes
