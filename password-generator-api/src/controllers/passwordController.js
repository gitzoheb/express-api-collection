import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const zxcvbn = require('zxcvbn');
import Joi from 'joi';
import AppError from '../utils/appError.js';

// Joi schema for password generation
const generatePasswordSchema = Joi.object({
  length: Joi.number().min(4).max(128).default(12),
  uppercase: Joi.boolean().default(true),
  lowercase: Joi.boolean().default(true),
  numbers: Joi.boolean().default(true),
  symbols: Joi.boolean().default(true),
});

// Joi schema for password validation
const validatePasswordSchema = Joi.object({
  password: Joi.string().required(),
});

// Generate a random password
export const generatePassword = (req, res, next) => {
  try {
    const { error, value } = generatePasswordSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    const { length, uppercase, lowercase, numbers, symbols } = value;

    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let charset = '';
    if (uppercase) charset += chars.uppercase;
    if (lowercase) charset += chars.lowercase;
    if (numbers) charset += chars.numbers;
    if (symbols) charset += chars.symbols;

    if (!charset) {
      return next(new AppError('At least one character type must be selected', 400));
    }

    let password = [];
    const requiredChars = [];

    if (uppercase) requiredChars.push(chars.uppercase.charAt(crypto.randomInt(0, chars.uppercase.length)));
    if (lowercase) requiredChars.push(chars.lowercase.charAt(crypto.randomInt(0, chars.lowercase.length)));
    if (numbers) requiredChars.push(chars.numbers.charAt(crypto.randomInt(0, chars.numbers.length)));
    if (symbols) requiredChars.push(chars.symbols.charAt(crypto.randomInt(0, chars.symbols.length)));

    // Add required characters to the password array
    for (let i = 0; i < requiredChars.length; i++) {
      password.push(requiredChars[i]);
    }

    // Fill the rest of the password length with random characters
    for (let i = requiredChars.length; i < length; i++) {
      password.push(charset.charAt(crypto.randomInt(0, charset.length)));
    }

    // Shuffle the password array to randomize character positions
    for (let i = password.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      [password[i], password[j]] = [password[j], password[i]];
    }

    password = password.join('');

    res.json({ success: true, password });
  } catch (error) {
    next(error);
  }
};

// Validate password strength
export const validatePassword = (req, res, next) => {
  try {
    const { error, value } = validatePasswordSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    const { password } = value;

    const result = zxcvbn(password);

    res.json({
      success: true,
      score: result.score, // 0-4
      feedback: result.feedback,
      crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second
    });
  } catch (error) {
    next(error);
  }
};