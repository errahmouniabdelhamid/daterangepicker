# DateRangePicker - TypeScript Edition

A modern date range picker component built with TypeScript, Tailwind CSS, and Vite.js - completely rewritten from the original jQuery-based version.

![DateRangePicker UI](https://github.com/user-attachments/assets/93d263be-ec13-4b2f-a073-1a2a67e80456)
![DateRangePicker Open](https://github.com/user-attachments/assets/f0d3fc84-0d3d-4cbd-8c28-3b2dc8d21ddb)
![DateRangePicker with Ranges](https://github.com/user-attachments/assets/f0356919-bd1c-41f2-aef0-19df2f4760ab)

## 🎉 What's New in v4.0

This is a complete rewrite of the popular daterangepicker library with modern web technologies:

### ✅ Key Improvements

- **No jQuery Required** - Converted to vanilla TypeScript with modern DOM APIs
- **Tailwind CSS** - Replaced Bootstrap with Tailwind CSS utility classes for styling
- **Vite.js Build System** - Fast development and optimized production builds
- **Full TypeScript Support** - Complete type safety with TypeScript interfaces
- **ES Modules** - Native ESM support for modern bundlers
- **Tree-shakeable** - Import only what you need
- **Smaller Bundle Size** - No jQuery dependency means smaller footprint

## 📦 Installation

```bash
npm install daterangepicker
```

## 🚀 Quick Start

### Using as ES Module

```typescript
import DateRangePicker from 'daterangepicker';
import 'daterangepicker/dist/style.css';
import moment from 'moment';

// Basic usage
const input = document.getElementById('daterange');
new DateRangePicker(input, {
  startDate: moment().subtract(6, 'days'),
  endDate: moment(),
  opens: 'right'
});
```

### Single Date Picker

```typescript
new DateRangePicker(input, {
  singleDatePicker: true,
  startDate: moment()
});
```

### With Predefined Ranges

```typescript
new DateRangePicker(input, {
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
  }
});
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

## 📝 Options

The DateRangePicker accepts an options object with the following properties:

```typescript
interface DateRangePickerOptions {
  startDate?: string | Moment | Date;
  endDate?: string | Moment | Date;
  minDate?: string | Moment | Date | false;
  maxDate?: string | Moment | Date | false;
  singleDatePicker?: boolean;
  showDropdowns?: boolean;
  timePicker?: boolean;
  timePicker24Hour?: boolean;
  timePickerSeconds?: boolean;
  autoApply?: boolean;
  autoUpdateInput?: boolean;
  linkedCalendars?: boolean;
  alwaysShowCalendars?: boolean;
  ranges?: DateRangePickerRanges;
  opens?: 'left' | 'right' | 'center';
  drops?: 'down' | 'up';
  locale?: Partial<DateRangePickerLocale>;
  // ... and many more options
}
```

## 🎨 Styling

The component uses Tailwind CSS for styling. The base styles are included in the package, but you can customize them by:

1. Using Tailwind CSS configuration
2. Overriding CSS custom properties
3. Adding custom CSS classes

## 🔧 API

### Constructor

```typescript
new DateRangePicker(
  element: HTMLElement | string,
  options?: DateRangePickerOptions,
  callback?: (start: Moment, end: Moment, label?: string) => void
)
```

### Methods

- `setStartDate(date)` - Set the start date
- `setEndDate(date)` - Set the end date
- `show()` - Show the picker
- `hide()` - Hide the picker
- `toggle()` - Toggle the picker visibility
- `remove()` - Destroy the picker instance

### Events

The picker emits custom events:

- `show.daterangepicker` - Fired when the picker is shown
- `hide.daterangepicker` - Fired when the picker is hidden
- `apply.daterangepicker` - Fired when the Apply button is clicked
- `change` - Fired when the input value changes

## 🔄 Migration from v3.x

If you're upgrading from the jQuery version:

1. **Remove jQuery dependency**
   ```diff
   - import $ from 'jquery';
   - import 'daterangepicker';
   + import DateRangePicker from 'daterangepicker';
   ```

2. **Update initialization**
   ```diff
   - $('input[name="daterange"]').daterangepicker(options);
   + new DateRangePicker('input[name="daterange"]', options);
   ```

3. **Update CSS imports**
   ```diff
   - import 'daterangepicker/daterangepicker.css';
   + import 'daterangepicker/dist/style.css';
   ```

4. **Event listeners**
   ```diff
   - $('input').on('apply.daterangepicker', function(ev, picker) {});
   + input.addEventListener('apply.daterangepicker', function(e) {});
   ```

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

Original jQuery-based version by [Dan Grossman](http://www.dangrossman.info/)

TypeScript conversion and modernization by the community.

## 📚 Documentation

For full documentation, examples, and advanced usage, visit [the documentation site](http://www.daterangepicker.com).

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/dangrossman/daterangepicker/issues) on GitHub.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.
