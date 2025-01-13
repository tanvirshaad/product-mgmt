import { Request, Response } from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import crypto, { createHash } from 'crypto';

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

    return `${hashedName}-${startIndex}${concatenatedSubstrings}${endIndex}`;
};

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
