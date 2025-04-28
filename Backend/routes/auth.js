const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/auth')
const authenticateUser = require('../middleware/authentication')


router.post('/register', register)
router.post('/login', login)


// In your backend routes
router.get('/verify', authenticateUser, (req, res) => {
    // If middleware passes, the user is authenticated
    res.status(200).json({ 
      isAuthenticated: true,
      user: req.user // Optionally return user data
    });
  });
module.exports = router
