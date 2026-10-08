# InnoApp · Landing

Landing de InnoApp construida con Vite, React 19, TypeScript y Tailwind CSS 3.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # comprueba tipos y genera dist/
npm run lint
```

## Estructura

- `src/App.tsx`: todas las secciones de la landing (menú, hero, precios, pie…).
- `src/components/InnoAppDemo.tsx`: demo interactiva del producto que aparece en el hero. Es autónoma y usa solo datos ficticios.
- `src/index.css`: estilos globales y animaciones (las de la demo llevan el prefijo `demo-`).
- `public/`: lo que se publica tal cual: favicon, iconos, `og-image.png` y el logo del menú.
- `brand-assets/`: material de marca original (logos, isotipo, banners y posts). No se publica.

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_SITE_URL` | URL pública de la landing para las etiquetas Open Graph. En Vercel es opcional: si no se define, se usa el dominio de producción del proyecto. |

## Fuentes

Outfit y JetBrains Mono se sirven desde el propio proyecto mediante `@fontsource-variable` (se importan en `src/main.tsx`), sin peticiones a Google Fonts.
