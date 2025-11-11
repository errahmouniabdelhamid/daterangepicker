import moment from 'moment';
import DateRangePicker from './daterangepicker';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Basic date range picker
  const basicInput = document.getElementById('daterangepicker');
  if (basicInput) {
    new DateRangePicker(basicInput, {
      opens: 'right',
      drops: 'down',
      autoUpdateInput: true,
      autoApply: false,
      linkedCalendars: true,
      showDropdowns: true,
      startDate: moment().subtract(6, 'days'),
      endDate: moment()
    }, (start, end) => {
      console.log('Date range selected:', start.format('MM/DD/YYYY'), '-', end.format('MM/DD/YYYY'));
    });
  }

  // Single date picker
  const singleInput = document.getElementById('singledatepicker');
  if (singleInput) {
    new DateRangePicker(singleInput, {
      singleDatePicker: true,
      opens: 'right',
      drops: 'down',
      autoUpdateInput: true,
      autoApply: true,
      showDropdowns: true,
      startDate: moment()
    }, (start) => {
      console.log('Date selected:', start.format('MM/DD/YYYY'));
    });
  }

  // Date range picker with predefined ranges
  const rangeInput = document.getElementById('rangedatepicker');
  if (rangeInput) {
    new DateRangePicker(rangeInput, {
      opens: 'right',
      drops: 'down',
      autoUpdateInput: true,
      autoApply: false,
      linkedCalendars: true,
      showDropdowns: true,
      startDate: moment().subtract(6, 'days'),
      endDate: moment(),
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month')
        ]
      },
      alwaysShowCalendars: true,
      showCustomRangeLabel: true
    }, (start, end, label) => {
      console.log('Date range selected:', start.format('MM/DD/YYYY'), '-', end.format('MM/DD/YYYY'));
      if (label) {
        console.log('Range label:', label);
      }
    });
  }
});
