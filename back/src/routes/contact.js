const express = require('express')
const rateLimit = require('express-rate-limit')

const ContactMessage = require('../models/ContactMessage')

const router = express.Router()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: 'Too many requests. Please try again in a minute.',
  },
})

function validateContactPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Invalid request body'
  }

  const { name, email, message } = payload

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return 'Name, email and message are required'
  }

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const trimmedMessage = message.trim()

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return 'Name, email and message cannot be empty'
  }

  if (trimmedName.length > 80 || trimmedEmail.length > 120 || trimmedMessage.length > 2000) {
    return 'Payload exceeds allowed size limits'
  }

  if (!emailRegex.test(trimmedEmail)) {
    return 'Invalid email format'
  }

  return null
}

router.post('/contact', contactLimiter, async (req, res, next) => {
  const validationError = validateContactPayload(req.body)

  if (validationError) {
    return res.status(400).json({
      ok: false,
      error: validationError,
    })
  }

  try {
    const { name, email, message } = req.body

    await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    })

    return res.status(201).json({ ok: true })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
