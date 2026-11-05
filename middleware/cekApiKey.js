function cekApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    // Mencocokkan dengan API_KEY di file .env
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ message: 'API key tidak valid' });
    }
    next();
}

module.exports = cekApiKey;