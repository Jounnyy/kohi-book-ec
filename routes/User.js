import express from 'express';
import { 
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/User.js';

const router = express.Router();

router.get('/users', getUsers);
router.get('/user/:id', getUserById);
router.post('/user', createUser);
router.patch('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;