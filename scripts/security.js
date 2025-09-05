const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
});

const rateLimits = {
  general: createRateLimit(15 * 60 * 1000, 1000, 'Too many requests'),
  auth: createRateLimit(15 * 60 * 1000, 5, 'Too many login attempts'),
  payment: createRateLimit(60 * 60 * 1000, 10, 'Too many payment attempts'),
  download: createRateLimit(60 * 60 * 1000, 50, 'Too many download attempts')
};

// Security middleware
const securityConfig = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", process.env.FRONTEND_URL]
      }
    },
    crossOriginEmbedderPolicy: false
  }),
  rateLimits
};

module.exports = securityConfig;
