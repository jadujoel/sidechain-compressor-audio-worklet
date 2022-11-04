import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    // server: { https: true },
    base: '/sidechain-compressor-audio-worklet/',
    // plugins: [mkcert(), react()],
    plugins: [react()],
    optimizeDeps: {
        include: ['sidechain-compressor', 'audio-worklet-helpers', 'react-redux'],
    },
    build: {
        commonjsOptions: {
            include: [/sidechain-compressor/, /audio-worklet-helpers/, /react-redux/, /node_modules/],
        }
    },
})
