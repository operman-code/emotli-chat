import badWords from '../utils/filterWords.json' assert {type: 'json'};

export const profanityFilter = (req, res, next) => {
  const { message } = req.body;
  if (message && badWords.some(word => message.toLowerCase().includes(word))) {
    return res.status(400).json({ error: 'Message blocked due to inappropriate content' });
  }
  next();
};
