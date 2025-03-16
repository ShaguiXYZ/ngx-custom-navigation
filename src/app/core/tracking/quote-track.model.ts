export interface TrackedData {
  path: string;
  tracked: boolean;
}

export type TrackEventType = 'click' | 'keydown' | 'keyup' | 'focus' | 'blur' | 'change' | 'input' | 'submit' | 'success';
export type TrackManifest = Record<string, TrackedData>;
export type TrackKey<T = TrackManifest> =
  | 'action'
  | 'category'
  | 'event'
  | 'infoPag'
  | 'label'
  | 'new'
  | 'page'
  | 'selected_tab'
  | 'step_number'
  | 'title'
  | 'typology'
  | 'URL'
  | keyof T;
export type TrackInfo<T = TrackManifest> = Partial<Record<TrackKey<T>, string | number | boolean | null | undefined>>;

export interface TrackInfoPageModel {
  page: string;
  URL: string;
  referrer?: string;
  user_type: string;
  device_type: string;
}
