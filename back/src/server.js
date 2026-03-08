const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const { connectDB } = require('./db')
const contactRoutes = require('./routes/contact')

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/innoapp'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'
const isProduction = process.env.NODE_ENV === 'production'

app.use(helmet())
app.use(
  cors({
    origin: CORS_ORIGIN,
  }),
)
app.use(express.json({ limit: '32kb' }))

if (!isProduction) {
  app.use(morgan('dev'))
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api', contactRoutes)

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Route not found',
  })
})

app.use((error, _req, res, _next) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error'

  if (!isProduction) {
    // Keep logs verbose in development only.
    console.error(error)
  }

  res.status(500).json({
    ok: false,
    error: message,
  })
})

async function startServer() {
  try {
    await connectDB(MONGO_URI)

    app.listen(PORT, () => {
      console.log(`InnoApp API running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start API server:', error)
    process.exit(1)
  }
}

startServer()
