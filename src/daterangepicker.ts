/**
 * DateRangePicker - TypeScript version
 * Converted from jQuery to vanilla TypeScript
 * Uses Tailwind CSS for styling
 * 
 * @version 4.0.0
 * @author Converted to TypeScript
 * @license MIT
 */

import moment, { Moment } from 'moment';
import type {
  DateRangePickerOptions,
  DateRangePickerLocale,
  DateRangePickerRanges,
  CalendarData
} from './types';
import { DOMUtils } from './utils';
import './daterangepicker.css';

export class DateRangePicker {
  // Element references
  private element: HTMLElement;
  private container: HTMLElement;
  private parentEl: HTMLElement;

  // Date properties
  public startDate: Moment;
  public endDate: Moment;
  public minDate: Moment | false;
  public maxDate: Moment | false;
  public maxSpan: moment.Duration | false;

  // Configuration
  public autoApply: boolean;
  public singleDatePicker: boolean;
  public showDropdowns: boolean;
  public minYear: number;
  public maxYear: number;
  public showWeekNumbers: boolean;
  public showISOWeekNumbers: boolean;
  public showCustomRangeLabel: boolean;
  public timePicker: boolean;
  public timePicker24Hour: boolean;
  public timePickerIncrement: number;
  public timePickerSeconds: boolean;
  public linkedCalendars: boolean;
  public autoUpdateInput: boolean;
  public alwaysShowCalendars: boolean;
  public ranges: DateRangePickerRanges;
  public opens: 'left' | 'right' | 'center';
  public drops: 'down' | 'up' | 'auto';
  public buttonClasses: string;
  public applyButtonClasses: string;
  public cancelButtonClasses: string;
  public locale: DateRangePickerLocale;

  // State
  private isShowing: boolean;
  private leftCalendar: CalendarData;
  private rightCalendar: CalendarData;
  private oldStartDate?: Moment;
  private oldEndDate?: Moment;
  private callback?: (start: Moment, end: Moment, label?: string) => void;
  
  // Custom functions
  public isInvalidDate: (date: Moment) => boolean;
  public isCustomDate: (date: Moment) => boolean | string | string[];

  // Event handlers bound to this instance
  private boundHandlers: Map<string, EventListener>;

  constructor(element: HTMLElement | string, options: DateRangePickerOptions = {}, callback?: (start: Moment, end: Moment, label?: string) => void) {
    this.boundHandlers = new Map();

    // Get element
    if (typeof element === 'string') {
      const el = document.querySelector(element);
      if (!el) throw new Error(`Element not found: ${element}`);
      this.element = el as HTMLElement;
    } else {
      this.element = element;
    }

    // Default settings
    this.startDate = moment().startOf('day');
    this.endDate = moment().endOf('day');
    this.minDate = false;
    this.maxDate = false;
    this.maxSpan = false;
    this.autoApply = false;
    this.singleDatePicker = false;
    this.showDropdowns = false;
    this.minYear = parseInt(moment().subtract(100, 'year').format('YYYY'));
    this.maxYear = parseInt(moment().add(100, 'year').format('YYYY'));
    this.showWeekNumbers = false;
    this.showISOWeekNumbers = false;
    this.showCustomRangeLabel = true;
    this.timePicker = false;
    this.timePicker24Hour = false;
    this.timePickerIncrement = 1;
    this.timePickerSeconds = false;
    this.linkedCalendars = true;
    this.autoUpdateInput = true;
    this.alwaysShowCalendars = false;
    this.ranges = {};

    // Default opens/drops
    this.opens = 'right';
    if (DOMUtils.hasClass(this.element, 'pull-right')) {
      this.opens = 'left';
    }

    this.drops = 'down';
    if (DOMUtils.hasClass(this.element, 'dropup')) {
      this.drops = 'up';
    }

    // Default button classes
    this.buttonClasses = 'btn btn-sm';
    this.applyButtonClasses = 'btn-primary';
    this.cancelButtonClasses = 'btn-default';

    // Default locale
    this.locale = {
      direction: 'ltr',
      format: moment.localeData().longDateFormat('L'),
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek()
    };

    this.callback = callback || function() {};

    // State
    this.isShowing = false;
    this.leftCalendar = { month: moment(), calendar: [] };
    this.rightCalendar = { month: moment(), calendar: [] };

    // Default custom functions
    this.isInvalidDate = () => false;
    this.isCustomDate = () => false;

    // Get parent element
    const parentSelector = options.parentEl || 'body';
    if (typeof parentSelector === 'string') {
      const parent = document.querySelector(parentSelector);
      this.parentEl = (parent as HTMLElement) || document.body;
    } else {
      this.parentEl = parentSelector;
    }

    // Create container from template
    const template = options.template || this.getDefaultTemplate();
    this.container = DOMUtils.createElement(template) as HTMLElement;
    DOMUtils.append(this.parentEl, this.container);

    // Apply options
    this.applyOptions(options);

    // Initialize calendars
    this.updateMonthsInView();

    // Set up event listeners
    this.setupEventListeners();

    // Update element if needed
    this.updateElement();
  }

  private getDefaultTemplate(): string {
    return `
      <div class="daterangepicker">
        <div class="ranges"></div>
        <div class="drp-calendar left">
          <div class="calendar-table"></div>
          <div class="calendar-time"></div>
        </div>
        <div class="drp-calendar right">
          <div class="calendar-table"></div>
          <div class="calendar-time"></div>
        </div>
        <div class="drp-buttons">
          <span class="drp-selected"></span>
          <button class="cancelBtn" type="button"></button>
          <button class="applyBtn" disabled="disabled" type="button"></button>
        </div>
      </div>
    `;
  }

  private applyOptions(options: DateRangePickerOptions): void {
    // Apply locale options
    if (options.locale) {
      if (options.locale.direction) this.locale.direction = options.locale.direction;
      if (options.locale.format) this.locale.format = options.locale.format;
      if (options.locale.separator) this.locale.separator = options.locale.separator;
      if (options.locale.daysOfWeek) this.locale.daysOfWeek = [...options.locale.daysOfWeek];
      if (options.locale.monthNames) this.locale.monthNames = [...options.locale.monthNames];
      if (options.locale.firstDay !== undefined) this.locale.firstDay = options.locale.firstDay;
      if (options.locale.applyLabel) this.locale.applyLabel = options.locale.applyLabel;
      if (options.locale.cancelLabel) this.locale.cancelLabel = options.locale.cancelLabel;
      if (options.locale.weekLabel) this.locale.weekLabel = options.locale.weekLabel;
      if (options.locale.customRangeLabel) {
        // Support unicode chars
        const elem = document.createElement('textarea');
        elem.innerHTML = options.locale.customRangeLabel;
        this.locale.customRangeLabel = elem.value;
      }
    }

    DOMUtils.addClass(this.container, this.locale.direction);

    // Apply date options
    if (typeof options.startDate === 'string') {
      this.startDate = moment(options.startDate, this.locale.format);
    } else if (options.startDate) {
      this.startDate = moment(options.startDate);
    }

    if (typeof options.endDate === 'string') {
      this.endDate = moment(options.endDate, this.locale.format);
    } else if (options.endDate) {
      this.endDate = moment(options.endDate);
    }

    if (typeof options.minDate === 'string') {
      this.minDate = moment(options.minDate, this.locale.format);
    } else if (options.minDate) {
      this.minDate = moment(options.minDate);
    }

    if (typeof options.maxDate === 'string') {
      this.maxDate = moment(options.maxDate, this.locale.format);
    } else if (options.maxDate) {
      this.maxDate = moment(options.maxDate);
    }

    // Sanity checks
    if (this.minDate && this.startDate.isBefore(this.minDate)) {
      this.startDate = this.minDate.clone();
    }

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
      this.endDate = this.maxDate.clone();
    }

    // Apply other options
    if (options.applyButtonClasses) this.applyButtonClasses = options.applyButtonClasses;
    if (options.cancelButtonClasses) this.cancelButtonClasses = options.cancelButtonClasses;
    if (options.maxSpan) this.maxSpan = options.maxSpan;
    if (options.opens) this.opens = options.opens;
    if (options.drops) this.drops = options.drops;
    if (typeof options.showWeekNumbers === 'boolean') this.showWeekNumbers = options.showWeekNumbers;
    if (typeof options.showISOWeekNumbers === 'boolean') this.showISOWeekNumbers = options.showISOWeekNumbers;
    if (typeof options.buttonClasses === 'string') this.buttonClasses = options.buttonClasses;
    if (Array.isArray(options.buttonClasses)) this.buttonClasses = options.buttonClasses.join(' ');
    if (typeof options.showDropdowns === 'boolean') this.showDropdowns = options.showDropdowns;
    if (typeof options.minYear === 'number') this.minYear = options.minYear;
    if (typeof options.maxYear === 'number') this.maxYear = options.maxYear;
    if (typeof options.showCustomRangeLabel === 'boolean') this.showCustomRangeLabel = options.showCustomRangeLabel;
    
    if (typeof options.singleDatePicker === 'boolean') {
      this.singleDatePicker = options.singleDatePicker;
      if (this.singleDatePicker) {
        this.endDate = this.startDate.clone();
      }
    }

    if (typeof options.timePicker === 'boolean') this.timePicker = options.timePicker;
    if (typeof options.timePickerSeconds === 'boolean') this.timePickerSeconds = options.timePickerSeconds;
    if (typeof options.timePickerIncrement === 'number') this.timePickerIncrement = options.timePickerIncrement;
    if (typeof options.timePicker24Hour === 'boolean') this.timePicker24Hour = options.timePicker24Hour;
    if (typeof options.autoApply === 'boolean') this.autoApply = options.autoApply;
    if (typeof options.autoUpdateInput === 'boolean') this.autoUpdateInput = options.autoUpdateInput;
    if (typeof options.linkedCalendars === 'boolean') this.linkedCalendars = options.linkedCalendars;
    if (typeof options.isInvalidDate === 'function') this.isInvalidDate = options.isInvalidDate;
    if (typeof options.isCustomDate === 'function') this.isCustomDate = options.isCustomDate;
    if (typeof options.alwaysShowCalendars === 'boolean') this.alwaysShowCalendars = options.alwaysShowCalendars;

    // Ranges
    if (options.ranges) {
      this.ranges = options.ranges;
    }

    // Update day names order to firstDay
    if (this.locale.firstDay !== 0) {
      let iterator = this.locale.firstDay;
      while (iterator > 0) {
        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift()!);
        iterator--;
      }
    }

    // Check for initial value from input element
    if (!options.startDate && !options.endDate) {
      if (DOMUtils.isInput(this.element)) {
        const val = (this.element as HTMLInputElement).value;
        const split = val.split(this.locale.separator);

        if (split.length === 2) {
          const start = moment(split[0].trim(), this.locale.format);
          const end = moment(split[1].trim(), this.locale.format);

          if (start.isValid() && end.isValid()) {
            this.setStartDate(start);
            this.setEndDate(end);
          }
        } else if (val) {
          const start = moment(val.trim(), this.locale.format);
          if (start.isValid()) {
            this.setStartDate(start);
            this.setEndDate(start);
          }
        }
      }
    }

    // Apply ranges if provided
    if (Object.keys(this.ranges).length > 0) {
      this.renderRanges();
    }

    // Apply button classes and labels
    const applyBtn = DOMUtils.find(this.container, '.applyBtn');
    const cancelBtn = DOMUtils.find(this.container, '.cancelBtn');

    if (applyBtn) {
      DOMUtils.addClass(applyBtn, ...this.buttonClasses.split(' '));
      if (this.applyButtonClasses) {
        DOMUtils.addClass(applyBtn, ...this.applyButtonClasses.split(' '));
      }
      DOMUtils.html(applyBtn, this.locale.applyLabel);
    }

    if (cancelBtn) {
      DOMUtils.addClass(cancelBtn, ...this.buttonClasses.split(' '));
      if (this.cancelButtonClasses) {
        DOMUtils.addClass(cancelBtn, ...this.cancelButtonClasses.split(' '));
      }
      DOMUtils.html(cancelBtn, this.locale.cancelLabel);
    }

    // Update container classes
    if (this.singleDatePicker) {
      DOMUtils.addClass(this.container, 'single');
    }

    if (this.autoApply) {
      DOMUtils.addClass(this.container, 'auto-apply');
    }

    if (Object.keys(this.ranges).length > 0) {
      DOMUtils.addClass(this.container, 'show-ranges');
    }

    if (this.alwaysShowCalendars) {
      DOMUtils.addClass(this.container, 'show-calendar');
    }
  }

  private setupEventListeners(): void {
    // Calendar navigation
    const leftCalendar = DOMUtils.find(this.container, '.drp-calendar.left');
    const rightCalendar = DOMUtils.find(this.container, '.drp-calendar.right');

    if (leftCalendar) {
      this.addEventListener(leftCalendar, 'click', this.handleCalendarClick.bind(this));
      this.addEventListener(leftCalendar, 'change', this.handleCalendarChange.bind(this));
    }

    if (rightCalendar) {
      this.addEventListener(rightCalendar, 'click', this.handleCalendarClick.bind(this));
      this.addEventListener(rightCalendar, 'change', this.handleCalendarChange.bind(this));
    }

    // Ranges
    const ranges = DOMUtils.find(this.container, '.ranges');
    if (ranges) {
      this.addEventListener(ranges, 'click', this.handleRangeClick.bind(this));
    }

    // Buttons
    const buttonsContainer = DOMUtils.find(this.container, '.drp-buttons');
    if (buttonsContainer) {
      this.addEventListener(buttonsContainer, 'click', this.handleButtonClick.bind(this));
    }

    // Element interactions
    if (DOMUtils.isInput(this.element) || DOMUtils.isButton(this.element)) {
      this.addEventListener(this.element, 'click', this.show.bind(this));
      this.addEventListener(this.element, 'focus', this.show.bind(this));
      this.addEventListener(this.element, 'keyup', this.elementChanged.bind(this));
      this.addEventListener(this.element, 'keydown', this.keydown.bind(this) as EventListener);
    } else {
      this.addEventListener(this.element, 'click', this.toggle.bind(this));
      this.addEventListener(this.element, 'keydown', this.toggle.bind(this));
    }

    // Outside click handler
    this.addEventListener(document, 'click', this.outsideClick.bind(this));
  }

  private addEventListener(element: Element | Document, event: string, handler: EventListenerOrEventListenerObject): void {
    const key = `${event}-${Math.random()}`;
    this.boundHandlers.set(key, handler as EventListener);
    DOMUtils.on(element, event, handler as EventListener);
  }

  private handleCalendarClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (DOMUtils.hasClass(target, 'prev')) {
      this.clickPrev(e);
    } else if (DOMUtils.hasClass(target, 'next')) {
      this.clickNext(e);
    } else if (DOMUtils.hasClass(target, 'available') && target.tagName === 'TD') {
      this.clickDate(e);
    }
  }

  private handleCalendarChange(e: Event): void {
    const target = e.target as HTMLSelectElement;

    if (target.classList.contains('yearselect') || target.classList.contains('monthselect')) {
      this.monthOrYearChanged(e);
    } else if (
      target.classList.contains('hourselect') ||
      target.classList.contains('minuteselect') ||
      target.classList.contains('secondselect') ||
      target.classList.contains('ampmselect')
    ) {
      this.timeChanged(e);
    }
  }

  private handleRangeClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.tagName === 'LI') {
      this.clickRange(e);
    }
  }

  private handleButtonClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (DOMUtils.hasClass(target, 'applyBtn')) {
      this.clickApply(e);
    } else if (DOMUtils.hasClass(target, 'cancelBtn')) {
      this.clickCancel(e);
    }
  }

  public setStartDate(startDate: string | Moment | Date): void {
    if (typeof startDate === 'string') {
      this.startDate = moment(startDate, this.locale.format);
    } else {
      this.startDate = moment(startDate);
    }

    if (!this.timePicker) {
      this.startDate = this.startDate.startOf('day');
    }

    if (this.timePicker && this.timePickerIncrement) {
      this.startDate.minute(
        Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
      );
    }

    if (this.minDate && this.startDate.isBefore(this.minDate)) {
      this.startDate = this.minDate.clone();
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate.minute(
          Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
        );
      }
    }

    if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
      this.startDate = this.maxDate.clone();
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate.minute(
          Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
        );
      }
    }

    if (!this.isShowing) {
      this.updateElement();
    }

    this.updateMonthsInView();
  }

  public setEndDate(endDate: string | Moment | Date): void {
    if (typeof endDate === 'string') {
      this.endDate = moment(endDate, this.locale.format);
    } else {
      this.endDate = moment(endDate);
    }

    if (!this.timePicker) {
      this.endDate = this.endDate.endOf('day');
    }

    if (this.timePicker && this.timePickerIncrement) {
      this.endDate.minute(
        Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
      );
    }

    if (this.endDate.isBefore(this.startDate)) {
      this.endDate = this.startDate.clone();
    }

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
      this.endDate = this.maxDate.clone();
    }

    if (this.maxSpan && this.startDate.clone().add(this.maxSpan).isBefore(this.endDate)) {
      this.endDate = this.startDate.clone().add(this.maxSpan);
    }

    if (!this.isShowing) {
      this.updateElement();
    }

    this.updateMonthsInView();
  }

  // Additional methods will be added in the next part
  private updateMonthsInView(): void {
    if (this.endDate) {
      if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
        (this.startDate.month() !== this.leftCalendar.month.month() ||
          this.startDate.year() !== this.leftCalendar.month.year()) &&
        (this.startDate.month() !== this.rightCalendar.month.month() ||
          this.startDate.year() !== this.rightCalendar.month.year())) {
        this.leftCalendar.month = this.startDate.clone().date(2);
        if (!this.linkedCalendars && (this.endDate.month() !== this.rightCalendar.month.month() ||
          this.endDate.year() !== this.rightCalendar.month.year())) {
          this.rightCalendar.month = this.endDate.clone().date(2);
        } else {
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      }
    } else {
      if (this.leftCalendar.month.month() !== this.startDate.month() ||
        this.leftCalendar.month.year() !== this.startDate.year()) {
        this.leftCalendar.month = this.startDate.clone().date(2);
      }
      if (this.rightCalendar.month.month() !== this.startDate.month() ||
        this.rightCalendar.month.year() !== this.startDate.year()) {
        this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
      }
    }

    if (this.maxDate && this.linkedCalendars && !this.singleDatePicker &&
      this.rightCalendar.month > this.maxDate) {
      this.rightCalendar.month = this.maxDate.clone().date(2);
      this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
    }

    this.renderCalendar('left');
    this.renderCalendar('right');
  }

  private renderCalendar(side: 'left' | 'right'): void {
    const calendar = side === 'left' ? this.leftCalendar : this.rightCalendar;
    const month = calendar.month.month();
    const year = calendar.month.year();

    // Build calendar matrix
    const firstDay = moment([year, month, 1]);
    const dayOfWeek = firstDay.day();
    const calendarArray: Moment[][] = [];

    for (let i = 0; i < 6; i++) {
      calendarArray[i] = [];
    }

    // Populate calendar
    let startDay = dayOfWeek - this.locale.firstDay;
    if (startDay < 0) startDay += 7;

    let curDate = firstDay.clone().subtract(startDay, 'days');

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        calendarArray[row][col] = curDate.clone();
        curDate.add(1, 'day');
      }
    }

    if (side === 'left') {
      this.leftCalendar.calendar = calendarArray;
    } else {
      this.rightCalendar.calendar = calendarArray;
    }

    // Render HTML
    this.renderCalendarHTML(side, calendarArray, month, year);
  }

  private renderCalendarHTML(side: 'left' | 'right', calendar: Moment[][], month: number, year: number): void {
    let html = '<table class="w-full">';
    html += '<thead>';
    html += '<tr>';

    if (this.showWeekNumbers || this.showISOWeekNumbers) {
      html += '<th></th>';
    }

    // Month/year header
    html += '<th colspan="5" class="month text-center">';
    if (this.showDropdowns) {
      html += '<select class="monthselect">';
      for (let m = 0; m < 12; m++) {
        const selected = m === month ? ' selected="selected"' : '';
        html += `<option value="${m}"${selected}>${this.locale.monthNames[m]}</option>`;
      }
      html += '</select>';
      html += '<select class="yearselect">';
      for (let y = this.minYear; y <= this.maxYear; y++) {
        const selected = y === year ? ' selected="selected"' : '';
        html += `<option value="${y}"${selected}>${y}</option>`;
      }
      html += '</select>';
    } else {
      html += `${this.locale.monthNames[month]} ${year}`;
    }
    html += '</th>';

    // Navigation
    html += '<th class="prev available"><span></span></th>';
    html += '<th class="next available"><span></span></th>';
    html += '</tr>';

    // Day headers
    html += '<tr>';
    if (this.showWeekNumbers || this.showISOWeekNumbers) {
      html += `<th class="week">${this.locale.weekLabel}</th>`;
    }

    for (let i = 0; i < 7; i++) {
      html += `<th>${this.locale.daysOfWeek[i]}</th>`;
    }
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    // Calendar days
    for (let row = 0; row < 6; row++) {
      html += '<tr>';

      if (this.showWeekNumbers) {
        html += `<td class="week">${calendar[row][0].week()}</td>`;
      } else if (this.showISOWeekNumbers) {
        html += `<td class="week">${calendar[row][0].isoWeek()}</td>`;
      }

      for (let col = 0; col < 7; col++) {
        const date = calendar[row][col];
        const classes: string[] = [];

        if (date.month() !== month) {
          classes.push('off');
        }

        if (this.minDate && date.isBefore(this.minDate, 'day')) {
          classes.push('off', 'disabled');
        }

        if (this.maxDate && date.isAfter(this.maxDate, 'day')) {
          classes.push('off', 'disabled');
        }

        if (this.isInvalidDate(date)) {
          classes.push('off', 'disabled');
        }

        if (date.format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
          classes.push('active', 'start-date');
        }

        if (this.endDate && date.format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
          classes.push('active', 'end-date');
        }

        if (this.endDate && date.isAfter(this.startDate) && date.isBefore(this.endDate)) {
          classes.push('in-range');
        }

        const customClass = this.isCustomDate(date);
        if (customClass) {
          if (typeof customClass === 'string') {
            classes.push(customClass);
          } else if (Array.isArray(customClass)) {
            classes.push(...customClass);
          }
        }

        let disabled = false;
        for (const cls of classes) {
          if (cls === 'disabled') {
            disabled = true;
            break;
          }
        }

        if (!disabled) {
          classes.push('available');
        }

        html += `<td class="${classes.join(' ')}" data-date="${date.format('YYYY-MM-DD')}">${date.date()}</td>`;
      }

      html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';

    const calendarTable = DOMUtils.find(this.container, `.drp-calendar.${side} .calendar-table`);
    if (calendarTable) {
      DOMUtils.html(calendarTable, html);
    }
  }

  private renderRanges(): void {
    const rangesHtml: string[] = [];
    for (const range in this.ranges) {
      rangesHtml.push(`<li data-range-key="${range}">${range}</li>`);
    }

    const rangesContainer = DOMUtils.find(this.container, '.ranges ul');
    if (!rangesContainer) {
      const rangesDiv = DOMUtils.find(this.container, '.ranges');
      if (rangesDiv) {
        DOMUtils.html(rangesDiv, `<ul>${rangesHtml.join('')}</ul>`);
      }
    } else {
      DOMUtils.html(rangesContainer, rangesHtml.join(''));
    }
  }

  private clickPrev(e: Event): void {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const calendarEl = DOMUtils.closest(target, '.drp-calendar');
    
    if (calendarEl) {
      if (DOMUtils.hasClass(calendarEl, 'left')) {
        this.leftCalendar.month.subtract(1, 'month');
        if (this.linkedCalendars) {
          this.rightCalendar.month.subtract(1, 'month');
        }
      } else {
        this.rightCalendar.month.subtract(1, 'month');
      }
      this.updateMonthsInView();
    }
  }

  private clickNext(e: Event): void {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const calendarEl = DOMUtils.closest(target, '.drp-calendar');
    
    if (calendarEl) {
      if (DOMUtils.hasClass(calendarEl, 'right')) {
        this.rightCalendar.month.add(1, 'month');
        if (this.linkedCalendars) {
          this.leftCalendar.month.add(1, 'month');
        }
      } else {
        this.leftCalendar.month.add(1, 'month');
      }
      this.updateMonthsInView();
    }
  }

  private clickDate(e: Event): void {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const dateStr = DOMUtils.attr(target, 'data-date');
    
    if (!dateStr) return;

    const date = moment(dateStr, 'YYYY-MM-DD');

    if (this.endDate || date.isBefore(this.startDate, 'day')) {
      this.endDate = this.startDate.clone();
      this.setStartDate(date.clone());
    } else if (!this.endDate && date.isBefore(this.startDate)) {
      this.endDate = this.startDate.clone();
    } else {
      this.setEndDate(date.clone());
      if (this.autoApply) {
        this.clickApply(e);
      }
    }

    if (this.singleDatePicker) {
      this.setStartDate(date.clone());
      this.setEndDate(date.clone());
      if (this.autoApply) {
        this.clickApply(e);
      }
    }

    this.updateMonthsInView();
  }

  private clickRange(e: Event): void {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const rangeKey = DOMUtils.attr(target, 'data-range-key');
    
    if (!rangeKey) return;

    const range = this.ranges[rangeKey];
    let start: Moment, end: Moment;

    if (typeof range === 'function') {
      [start, end] = range();
    } else {
      [start, end] = range;
    }

    this.setStartDate(start);
    this.setEndDate(end);

    if (this.autoApply) {
      this.clickApply(e);
    }

    // Highlight selected range
    const allRanges = DOMUtils.findAll(this.container, '.ranges li');
    allRanges.forEach(li => DOMUtils.removeClass(li, 'active'));
    DOMUtils.addClass(target, 'active');
  }

  private clickApply(e: Event): void {
    e.stopPropagation();
    this.hide();
    
    if (this.callback) {
      this.callback(this.startDate, this.endDate);
    }

    DOMUtils.trigger(this.element, 'apply.daterangepicker', {
      startDate: this.startDate,
      endDate: this.endDate
    });

    this.updateElement();
  }

  private clickCancel(e: Event): void {
    e.stopPropagation();
    
    if (this.oldStartDate) {
      this.startDate = this.oldStartDate.clone();
    }
    if (this.oldEndDate) {
      this.endDate = this.oldEndDate.clone();
    }

    this.hide();
    this.updateElement();
  }

  private monthOrYearChanged(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const isLeft = !!DOMUtils.closest(target, '.drp-calendar.left');
    const calendar = isLeft ? this.leftCalendar : this.rightCalendar;

    if (target.classList.contains('monthselect')) {
      calendar.month.month(parseInt(target.value));
    } else if (target.classList.contains('yearselect')) {
      calendar.month.year(parseInt(target.value));
    }

    if (this.linkedCalendars && isLeft) {
      this.rightCalendar.month = calendar.month.clone().add(1, 'month');
    }

    this.updateMonthsInView();
  }

  private timeChanged(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const isLeft = !!DOMUtils.closest(target, '.drp-calendar.left');
    const date = isLeft ? this.startDate : this.endDate;

    if (target.classList.contains('hourselect')) {
      let hour = parseInt(target.value);
      if (!this.timePicker24Hour) {
        const ampmSelect = DOMUtils.find(target.parentElement!, '.ampmselect') as HTMLSelectElement;
        if (ampmSelect) {
          const ampm = ampmSelect.value;
          if (ampm === 'PM' && hour < 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
        }
      }
      date.hour(hour);
    } else if (target.classList.contains('minuteselect')) {
      date.minute(parseInt(target.value));
    } else if (target.classList.contains('secondselect')) {
      date.second(parseInt(target.value));
    } else if (target.classList.contains('ampmselect')) {
      const hourSelect = DOMUtils.find(target.parentElement!, '.hourselect') as HTMLSelectElement;
      if (hourSelect) {
        let hour = parseInt(hourSelect.value);
        const ampm = target.value;
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        date.hour(hour);
      }
    }

    if (isLeft) {
      this.startDate = date;
    } else {
      this.endDate = date;
    }

    this.updateMonthsInView();
  }

  private elementChanged(): void {
    if (!DOMUtils.isInput(this.element)) return;

    const val = (this.element as HTMLInputElement).value;
    if (!val || !val.length) return;

    const split = val.split(this.locale.separator);

    if (split.length === 2) {
      const start = moment(split[0].trim(), this.locale.format);
      const end = moment(split[1].trim(), this.locale.format);

      if (start.isValid() && end.isValid()) {
        this.setStartDate(start);
        this.setEndDate(end);
        this.updateMonthsInView();
      }
    }
  }

  private keydown(e: KeyboardEvent): void {
    if (e.key === 'Tab' || e.key === 'Enter') {
      this.show();
    }
  }

  private outsideClick(e: Event): void {
    const target = e.target as HTMLElement;

    if (target === this.element || this.element.contains(target)) {
      return;
    }

    if (target === this.container || this.container.contains(target)) {
      return;
    }

    this.hide();
  }

  public show(): void {
    if (this.isShowing) return;

    this.oldStartDate = this.startDate.clone();
    this.oldEndDate = this.endDate ? this.endDate.clone() : undefined;

    DOMUtils.addClass(this.container, 'show-calendar');
    DOMUtils.show(this.container);
    this.isShowing = true;

    this.updateMonthsInView();
    this.move();

    DOMUtils.trigger(this.element, 'show.daterangepicker', {
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  public hide(): void {
    if (!this.isShowing) return;

    DOMUtils.removeClass(this.container, 'show-calendar');
    DOMUtils.hide(this.container);
    this.isShowing = false;

    DOMUtils.trigger(this.element, 'hide.daterangepicker', {
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  public toggle(): void {
    if (this.isShowing) {
      this.hide();
    } else {
      this.show();
    }
  }

  private move(): void {
    const elementRect = this.element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    const parentRect = this.parentEl.getBoundingClientRect();

    let top = elementRect.bottom - parentRect.top;
    let left = elementRect.left - parentRect.left;

    // Adjust based on drops
    if (this.drops === 'up') {
      top = elementRect.top - parentRect.top - containerRect.height;
      DOMUtils.addClass(this.container, 'drop-up');
    } else {
      DOMUtils.removeClass(this.container, 'drop-up');
    }

    // Adjust based on opens
    if (this.opens === 'left') {
      left = elementRect.right - parentRect.left - containerRect.width;
      DOMUtils.addClass(this.container, 'opensleft');
    } else if (this.opens === 'center') {
      left = elementRect.left - parentRect.left + (elementRect.width - containerRect.width) / 2;
      DOMUtils.addClass(this.container, 'openscenter');
    } else {
      DOMUtils.addClass(this.container, 'opensright');
    }

    this.container.style.top = `${top}px`;
    this.container.style.left = `${left}px`;
  }

  private updateElement(): void {
    if (!DOMUtils.isInput(this.element) || !this.autoUpdateInput) return;

    let newValue = this.startDate.format(this.locale.format);

    if (!this.singleDatePicker) {
      newValue += this.locale.separator + this.endDate.format(this.locale.format);
    }

    const currentValue = (this.element as HTMLInputElement).value;
    if (newValue !== currentValue) {
      (this.element as HTMLInputElement).value = newValue;
      DOMUtils.trigger(this.element, 'change');
    }
  }

  public remove(): void {
    // Remove all event listeners - cleanup handled by browser when elements are removed

    // Remove container
    DOMUtils.remove(this.container);

    // Remove data
    DOMUtils.data(this.element, 'daterangepicker', undefined);
  }
}

// Export as default
export default DateRangePicker;
