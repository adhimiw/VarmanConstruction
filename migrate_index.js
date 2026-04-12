const fs = require('fs');
let indexHtml = fs.readFileSync('../index.html', 'utf8');

// Replace the older react scripts with empty string
indexHtml = indexHtml.replace(/<script defer src="https:\/\/resource.trickle.so\/vendor_lib\/unpkg\/react@18\/umd\/react.production.min.js"><\/script>/, '');
indexHtml = indexHtml.replace(/<script defer\s*src="https:\/\/resource.trickle.so\/vendor_lib\/unpkg\/react-dom@18\/umd\/react-dom.production.min.js"><\/script>/, '');

// Clean up the dist components
let bodyRegex = /<script defer src="dist\/components\/Header.js\?v=\d+"><\/script>[\s\S]*?<script defer src="dist\/app.js\?v=\d+"><\/script>/g;
indexHtml = indexHtml.replace(bodyRegex, '<script type="module" src="/src/main.jsx"></script>');

// Update styles reference to point to original dist or vite
indexHtml = indexHtml.replace(/href="dist\/tailwind.css\?v=[0-9\-]+"/, 'href="/src/index.css"');

fs.writeFileSync('frontend/index.html', indexHtml);

// Make sure index.css exists
let cssContent = fs.readFileSync('../styles/tailwind.input.css', 'utf8');
fs.writeFileSync('frontend/src/index.css', cssContent);

// Also copy tailwind.config.js from backend or create a generic one
let tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
fs.writeFileSync('frontend/tailwind.config.js', tailwindConfig);

// Create vite config proxy
let viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
`;
fs.writeFileSync('frontend/vite.config.js', viteConfig);
