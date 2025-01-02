export interface TrackedData {
  value: string;
  tracked: boolean;
}

export type TrackEventType = 'click' | 'keydown' | 'keyup' | 'focus' | 'blur' | 'change' | 'input' | 'submit';
export type TrackKey<T = Record<string, TrackedData>> =
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
export type TrackInfo = Partial<Record<TrackKey, string | number | boolean | null | undefined>>;

export interface TrackInfoPageModel {
  page: string;
  URL: string;
  referrer?: string;
  user_type: string;
  device_type: string;
}
