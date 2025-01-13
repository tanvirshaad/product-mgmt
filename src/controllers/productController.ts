import { Request, Response } from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import crypto from 'crypto';

const generateProductCode = (name: string): string => {
    const hashedName = crypto
        .createHash('md5')
        .update(name)
        .digest('hex')
        .slice(0, 7);

    const normalized = name.toLowerCase();
    const withoutSpaces = normalized.replace(/\s/g, '');

    let longestLength = 0;
    let longestSubstrings: string[] = [];

    for (let i = 0; i < withoutSpaces.length; i++) {
        let current = withoutSpaces[i];
        let tempSubstring = current;

        for (let j = i + 1; j < withoutSpaces.length; j++) {
            if (withoutSpaces[j] > current) {
                tempSubstring += withoutSpaces[j];
                current = withoutSpaces[j];
            } else {
                break;
            }
        }

        if (tempSubstring.length > longestLength) {
            longestLength = tempSubstring.length;
            longestSubstrings = [tempSubstring];
        } else if (tempSubstring.length === longestLength) {
            longestSubstrings.push(tempSubstring);
        }
    }

    const concatenatedSubstrings = longestSubstrings.join('');

    let startIndex = 0;
    let endIndex = 0;

    const firstSubstring = longestSubstrings[0];
    startIndex = normalized.indexOf(firstSubstring);

    const lastSubstring = longestSubstrings[longestSubstrings.length - 1];
    endIndex = normalized.lastIndexOf(lastSubstring) + lastSubstring.length - 1;

    return `${hashedName}-${startIndex}${concatenatedSubstrings}${endIndex - 1}`;
};

//create product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, discount, image, status, category } =
            req.body;
        const productCode = generateProductCode(name);
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res
                .status(400)
                .json({ message: `Category '${category}' does not exist.` });
        }
        const product = await Product.create({
            name,
            description,
            price,
            discount,
            image,
            status,
            productCode,
            category: categoryDoc._id,
        });
        await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create product',
            error: (error as Error).message,
        });
    }
};

//get all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch products',
            error: (error as Error).message,
        });
    }
};

//get product by id
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res
                .status(404)
                .json({ message: `Product with ID '${id}' not found.` });
        }
        res.status(200).json({
            message: 'Product fetched successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch product',
            error: (error as Error).message,
        });
    }
};
//update product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, description, discount } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res
                .status(404)
                .json({ message: `Product with ID '${id}' not found.` });
        }
        if (status) {
            product.status = status;
        }
        if (description) {
            product.description = description;
        }
        if (discount) {
            product.discount = discount;
        }
        await product.save();
        res.status(200).json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update product',
            error: (error as Error).message,
        });
    }
};

//filter products by category
export const filterProductsByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res
                .status(400)
                .json({ message: `Category '${category}' does not exist.` });
        }
        const products = await Product.find({ category: categoryDoc._id });
        res.status(200).json({
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch products',
            error: (error as Error).message,
        });
    }
};

//search by name
export const searchProductByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const products = await Product.find({
            name: { $regex: name, $options: 'i' },
        });
        res.status(200).json({
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch products',
            error: (error as Error).message,
        });
    }
};

//Pricing Calculation
export const calculatePrice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res
                .status(404)
                .json({ message: `Product with ID '${id}' not found.` });
        }
        const discountAmount = (product.price * product.discount) / 100;
        const finalPrice = product.price - discountAmount;
        res.status(200).json({
            message: 'Price calculated successfully',
            originalPrice: product.price,
            finalPrice: finalPrice,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to calculate price',
            error: (error as Error).message,
        });
    }
};
