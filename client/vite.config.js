import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Auto-download font if it doesn't exist
const fontDir = path.resolve(process.cwd(), 'public/fonts');
const fontPath = path.resolve(fontDir, 'NotoSansDevanagari-Regular.ttf');

if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

if (!fs.existsSync(fontPath)) {
  console.log('Downloading NotoSansDevanagari-Regular.ttf...');
  fetch('https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.arrayBuffer();
    })
    .then(buffer => {
      fs.writeFileSync(fontPath, Buffer.from(buffer));
      console.log('Font downloaded successfully to public/fonts!');
    })
    .catch(err => {
      console.error('Failed to download font:', err);
    });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
  }
})
