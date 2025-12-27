/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Today's code is tomorrow's innovation 🔮
 */

import { Router } from 'express';
import { compileContract } from '../services/compiler.js';
import { strictRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Compile Solidity contract
router.post('/', strictRateLimiter, async (req, res, next) => {
  try {
    const { code, version, optimize } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Contract code is required'
      });
    }

    const result = await compileContract({
      code,
      version: version || '0.8.20',
      optimize: optimize !== false
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;
