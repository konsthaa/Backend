// Import Express and the routers for each API resource.
import express from 'express';
import catRouter from './routes/cat-router.js';
import userRouter from './routes/user-router.js';
import authRouter from './routes/auth-router.js';

// Create a router that groups the versioned API's endpoints.
const router = express.Router();

// Mount each resource router under its base path (/cats and /users).
router.use('/cats', catRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

// Export this router for the application to mount under /api/v1.
export default router;
