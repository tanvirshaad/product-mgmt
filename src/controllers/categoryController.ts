import { Request, Response } from 'express';
import Category from '../models/categoryModel';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const category = await Category.create({ name, description });
        res.status(201).json({
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create category',
            error: (error as Error).message,
        });
    }
};
