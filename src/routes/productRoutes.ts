import { Router, Request, Response } from 'express';
import { createProduct } from '../controllers/productController';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    createProduct(req, res);
});

export default router;
