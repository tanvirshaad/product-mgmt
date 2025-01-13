import { Router, Request, Response } from 'express';
import {
    calculatePrice,
    createProduct,
    filterProductsByCategory,
    getAllProducts,
    getProductById,
    searchProductByName,
    updateProduct,
} from '../controllers/productController';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    createProduct(req, res);
});

//get all products
router.get('/', (req: Request, res: Response) => {
    getAllProducts(req, res);
});

//get product by id
router.get('/:id', (req: Request, res: Response) => {
    getProductById(req, res);
});

//update product by id
router.put('/:id', (req: Request, res: Response) => {
    updateProduct(req, res);
});
//filter by category
router.get('/category/:category', (req: Request, res: Response) => {
    filterProductsByCategory(req, res);
});
//search by name
router.get('/search/:name', (req: Request, res: Response) => {
    searchProductByName(req, res);
});
//calculate discount
router.get('/calculate/:id', (req: Request, res: Response) => {
    calculatePrice(req, res);
});

export default router;
