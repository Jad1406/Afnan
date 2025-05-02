

require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./db/connect');
// const authenticateUser = require('./middleware/authentication');


// routers
const authRouter = require('./routes/auth');
const marketRouter = require('./routes/Product');
const reviewRouter = require('./routes/ReviewRoutes');
const utilRouter = require('./routes/upload-util');
const communityRouter = require('./routes/communityRoutes');
const educationRouter = require('./routes/Education');
const aiChatRoutes = require("./routes/aiChat");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require('./routes/orderRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); 

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

/////
//middleware
// Middleware - IMPORTANT: Order matters for Stripe webhook
// Parse JSON for all routes EXCEPT the Stripe webhook route
app.use('/api/v1/payments/webhook', express.raw({type: 'application/json'}));


app.use(express.json());

  // CORS middleware
  
const allowedOrigins = ['http://localhost:3001','http://localhost:3000','http://localhost:5000']; // Add your frontend origin here

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


//////////
// routes


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/market', marketRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/community', communityRouter);
app.use("/api/v1/utils",utilRouter);
app.use('/api/v1/education', educationRouter);
app.use("/api/v1/ai", aiChatRoutes);
app.use('/api/v1/cart', cartRoutes );
app.use('/api/v1/orders', orderRoutes); 
app.use('/api/v1/payments', paymentRoutes); // Register the payment routes


//error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000; //frontend uses port 3000

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
