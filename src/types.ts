import moment, { Moment } from 'moment';

export interface DateRangePickerLocale {
  direction: 'ltr' | 'rtl';
  format: string;
  separator: string;
  applyLabel: string;
  cancelLabel: string;
  weekLabel: string;
  customRangeLabel: string;
  daysOfWeek: string[];
  monthNames: string[];
  firstDay: number;
}

export interface DateRangePickerRanges {
  [key: string]: [Moment, Moment] | (() => [Moment, Moment]);
}

export interface DateRangePickerOptions {
  parentEl?: string | HTMLElement;
  startDate?: string | Moment | Date;
  endDate?: string | Moment | Date;
  minDate?: string | Moment | Date | false;
  maxDate?: string | Moment | Date | false;
  maxSpan?: moment.Duration | false;
  autoApply?: boolean;
  singleDatePicker?: boolean;
  showDropdowns?: boolean;
  minYear?: number;
  maxYear?: number;
  showWeekNumbers?: boolean;
  showISOWeekNumbers?: boolean;
  showCustomRangeLabel?: boolean;
  timePicker?: boolean;
  timePicker24Hour?: boolean;
  timePickerIncrement?: number;
  timePickerSeconds?: boolean;
  linkedCalendars?: boolean;
  autoUpdateInput?: boolean;
  alwaysShowCalendars?: boolean;
  ranges?: DateRangePickerRanges;
  opens?: 'left' | 'right' | 'center';
  drops?: 'down' | 'up';
  buttonClasses?: string | string[];
  applyButtonClasses?: string;
  cancelButtonClasses?: string;
  locale?: Partial<DateRangePickerLocale>;
  template?: string;
  isInvalidDate?: (date: Moment) => boolean;
  isCustomDate?: (date: Moment) => boolean | string | string[];
}

export interface CalendarData {
  month: Moment;
  calendar: Moment[][];
}
