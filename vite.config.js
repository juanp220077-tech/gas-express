import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/gas-express/', // 👈 Agrega esta línea con el nombre exacto de tu repositorio del frontend
})
