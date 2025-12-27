/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every bug fixed is a lesson learned 🎓
 */

import { Router } from 'express';
import { generateContract, explainCode, generateTests } from '../services/ai.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Generate contract from natural language
router.post('/generate', aiRateLimiter, async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const result = await generateContract(prompt);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
});

// Explain code
router.post('/explain', aiRateLimiter, async (req, res, next) => {
  try {
    const { code, question } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const result = await explainCode(code, question);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
});

// Generate tests
router.post('/tests', aiRateLimiter, async (req, res, next) => {
  try {
    const { code, framework } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const result = await generateTests(code, framework || 'hardhat');

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;
