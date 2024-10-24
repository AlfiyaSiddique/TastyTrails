const rateLimit = (limit, windowMs, endpoint = null) => {
  const requestCounts = {};

  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    const key = endpoint ? `${ip}-${endpoint}` : ip; // Track by endpoint

    if (!requestCounts[key]) {
      requestCounts[key] = { count: 1, startTime: currentTime };
    } else {
      const { count, startTime } = requestCounts[key];
      if (currentTime - startTime < windowMs) {
        if (count >= limit) {
          return res.status(429).json({
            message: "Too many requests, please slow down!",
          });
        }
        requestCounts[key].count++;
      } else {
        requestCounts[key] = { count: 1, startTime: currentTime };
      }
    }
    next();
  };
};
export { rateLimit };
