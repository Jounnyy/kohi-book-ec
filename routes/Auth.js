import { 
    Login,
    Profile,
    LogOut
} from '../controllers/AuthControl.js';
import express from 'express';

const router = express.Router();

router.get('/profile', Profile);
router.post('/login', Login);
router.delete('/logout', LogOut);

export default router;