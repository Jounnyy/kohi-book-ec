import express from 'express';
import { 
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/User.js';
import {verifyUser, verifyRole} from '../middleware/Auth.js';

const router = express.Router();

router.get('/users', verifyUser, verifyRole, getUsers);
router.get('/user/:id', verifyUser, verifyRole, getUserById);
router.post('/user', createUser);
router.patch('/user/:id', verifyUser, verifyRole, updateUser);
router.delete('/user/:id', verifyUser, verifyRole, deleteUser);

export default router;