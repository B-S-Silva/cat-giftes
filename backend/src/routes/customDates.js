import express from 'express';
import { getCustomDates, createCustomDate, deleteCustomDate, updateCustomDate } from '../controllers/customDatesController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router();

// Rotas protegidas por autenticação
router.get('/', authRequired, getCustomDates);
router.post('/', authRequired, createCustomDate);
router.put('/:id', authRequired, updateCustomDate);
router.delete('/:id', authRequired, deleteCustomDate);

export default router;