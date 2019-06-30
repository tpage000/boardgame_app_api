const jwt = require('jsonwebtoken');

function authorize (req, res, next) {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) return next(err);
      req.user = decodedToken;
      next();
    })
  } else {
    return next('Not Authorized')
  }
}

module.exports = authorize;
