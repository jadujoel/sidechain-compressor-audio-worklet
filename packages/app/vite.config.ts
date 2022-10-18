import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/sidechain-compressor-audio-worklet/',
    plugins: [react()],
    optimizeDeps: {
        include: ['sidechain-compressor', 'audio-worklet-helpers'],
    },
    build: {
        commonjsOptions: {
            include: [/sidechain-compressor/, /audio-worklet-helpers/, /node_modules/],
        }
    },
})
