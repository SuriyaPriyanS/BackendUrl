import Url from '../Models/urlSchema.js';
import bcryptjs from "bcryptjs"

export const shortenUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    const shortUrl = generateShortUrl();

    const newUrl = new Url({ longUrl, shortUrl });
    await newUrl.save();

    res.status(201).json(newUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    url.clicks++;
    await url.save();

    res.redirect(url.longUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateShortUrl = () => {
  const length = 6;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortUrl = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortUrl += characters[randomIndex];
  }
  return shortUrl;
};
