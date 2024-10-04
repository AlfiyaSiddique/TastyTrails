const rateLimit = (limit, windowMs) => {
    const requestCounts = {};

    return (req, res, next) => {
        const ip = req.ip; // Get client IP
        const currentTime = Date.now();

        // If this IP doesn't exist, initialize it
        if (!requestCounts[ip]) {
            requestCounts[ip] = { count: 1, startTime: currentTime };
        } else {
            const { count, startTime } = requestCounts[ip];

            if (currentTime - startTime < windowMs) {
                // If the limit is exceeded, block the request
                if (count >= limit) {
                    return res.status(429).json({
                        message: "Too many requests, please slow down!",
                    });
                }
                // Otherwise, increment the request count
                requestCounts[ip].count++;
            } else {
                // Reset the count and time if the time window has passed
                requestCounts[ip] = { count: 1, startTime: currentTime };
            }
        }

        next();
    };
};

export { rateLimit };
