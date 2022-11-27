import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


const entry = path.resolve(__dirname, 'src/components/index.js')

export default defineConfig({
  build: {
    lib: {
      entry,
      name: '@unrest/vue-openseadragon',
      fileName: (format) => `vue-openseadragon.${format}.js`,
    },
    rollupOptions: {
      external: [
        '@unrest/vue-mousetrap',
        'openseadragon',
        'vue',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          '@unrest/vue-mousetrap': '@unrest/vue-mousetrap',
          openseadragon: 'openseadragon',
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@unrest/vue-openseadragon': entry,
    },
  },
  plugins: [vue()],
});