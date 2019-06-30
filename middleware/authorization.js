const jwt = require('jsonwebtoken')

function authorize (req, res, next) {
  const token = req.headers['x-access-token']
  if (!token) {
    return next('Not Authorized');
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return next();
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
}

module.exports = authorize
