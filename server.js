const path = require('path');
const express = require('express');
const cors=require('cors')
const compression=require('compression')
const rateLimiting=require("express-rate-limit")
const helmet=require("helmet")
const xss=require("xss-clean")
const hpp=require("hpp")
const mongoSanitize = require('express-mongo-sanitize');

const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');

// Routes
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./services/orderService');

// Connect with db
dbConnection();

// express app
const app = express();

// enable other domains to access APIs

app.use(cors())
app.options('*',cors())

// Data sanitization
app.use(mongoSanitize());
// prevent xss attacks
app.use(xss())

// comprssion
app.use(compression())

// security headers (helmet)
app.use(helmet())

// rate limiting
// app.use(rateLimiting({
//   windowMs:10 * 60 * 1000,//10 mins
//    max:100,
// }))

// prevent http param polltion
app.use(hpp({whitelist:['price' , 'sold' , 'quantity' , 'ratingsAverage' , 'ratingsQuantity']}))





// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
