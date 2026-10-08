import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Las etiquetas Open Graph necesitan URLs absolutas. Se usa VITE_SITE_URL si existe;
// si no, en Vercel se toma el dominio de producción del proyecto.
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'innoapp-site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: html => html.replaceAll('%SITE_URL%', siteUrl),
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const productionHost = env.VERCEL_PROJECT_PRODUCTION_URL
  const siteUrl = (env.VITE_SITE_URL || (productionHost ? `https://${productionHost}` : '')).replace(/\/$/, '')

  return {
    plugins: [react(), siteUrlPlugin(siteUrl)],
  }
})
