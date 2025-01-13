import { Router } from 'express';
import {
    createCategory,
    // getCategories,
} from '../controllers/categoryController';

const router: Router = Router();

// Route to add a new category
router.post('/', createCategory);

// Route to get all categories
// router.get('/', getCategories);

export default router;
