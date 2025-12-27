/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every expert was once a beginner 📚
 */

import { Router } from 'express';
import { fundAddress } from '../services/faucet.js';
import { faucetRateLimiter } from '../middleware/rateLimiter.js';
import { isValidEthereumAddress } from '../utils/validation.js';

const router = Router();

// Request testnet funds
router.post('/request', faucetRateLimiter, async (req, res, next) => {
  try {
    const { address, network } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    // Validate Ethereum address format
    if (!isValidEthereumAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address'
      });
    }

    const result = await fundAddress(address, network || 'sepolia');

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
});

export default router;
