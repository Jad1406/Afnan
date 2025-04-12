const mongoose = require('mongoose');



const connectDB =  (uri) => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

}


module.exports = connectDB;