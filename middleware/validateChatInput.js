module.exports = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string' || message.length > 500) {
    return res.status(400).json({ 
      error: 'Message must be a string (max 500 characters)' 
    });
  }
  
  next();
};