import badWords from '../sockets/utils/filterWords.json' assert {type: 'json'};

export const profanityFilter = (req, res, next) => {
  const { message, content } = req.body;
  const textToCheck = message || content;
  
  if (!textToCheck) {
    return next();
  }
  
  const lowerText = textToCheck.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Check for exact word matches and partial matches
  const hasProfanity = badWords.some(badWord => {
    // Exact word match
    if (words.includes(badWord)) return true;
    
    // Partial match (word contains bad word)
    if (words.some(word => word.includes(badWord))) return true;
    
    // Check if the entire message contains the bad word
    if (lowerText.includes(badWord)) return true;
    
    return false;
  });
  
  if (hasProfanity) {
    return res.status(400).json({ 
      error: 'Message blocked due to inappropriate content',
      message: 'Please keep the conversation respectful and appropriate'
    });
  }
  
  next();
};

