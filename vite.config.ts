import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/daterangepicker.ts'),
      name: 'DateRangePicker',
      fileName: 'daterangepicker',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['moment'],
      output: {
        globals: {
          moment: 'moment'
        }
      }
    }
  }
})
