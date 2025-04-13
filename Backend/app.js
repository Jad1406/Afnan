

require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./db/connect');
// const authenticateUser = require('./middleware/authentication');


// routers
const authRouter = require('./routes/auth');
const marketRouter = require('./routes/Product');
const utilRouter = require('./routes/utils');
const communityRouter = require('./routes/communityRoutes');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//middleware
app.use(express.json());

  // CORS middleware
  
const allowedOrigins = ['http://localhost:3001']; // Add your frontend origin here

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers)
}));


// routes
// app.get('/', (req, res) => {
//   console.log('Root route hit');

//   res.status(200).send('<h1>Marketplace API</h1>');
// });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/market', marketRouter);
app.use('/api/v1/community', communityRouter);
app.use("/api/v1/utils",utilRouter);


//error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
