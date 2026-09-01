import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../..', '');

  return {
    envDir: '../..',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      port: Number(env.PORT),
      strictPort: true,
      proxy: {
        '/api': {
          target: `http://localhost:${env.API_PORT}`,
          changeOrigin: true,
        },
      },
    },
  }
})
