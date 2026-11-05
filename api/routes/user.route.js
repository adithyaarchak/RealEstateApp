import express from 'express'
import { deleteUser, test ,updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test',test)
// update api route
router.post('/update/:id', verifyToken, updateUser);

// delete user 
router.delete('/delete/:id', verifyToken, deleteUser);




export default router; 