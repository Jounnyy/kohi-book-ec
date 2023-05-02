import express from 'express';
import {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
 } from '../controllers/Book.js';
import { verifyUser } from '../middleware/Auth.js';
const router = express.Router();

router.get('/books', getBooks);
router.get('/books/:id/bookId', verifyUser ,getBookById);
router.post('/books/add', verifyUser, createBook);
router.patch('/books/:id/update', verifyUser, updateBook);
router.delete('/books/:id/delete',verifyUser, deleteBook);

export default router;