import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// Only used by the tests: the package ships source files and each site's Vite
// compiles them.
export default defineConfig({
  plugins: [svelte()],
})
