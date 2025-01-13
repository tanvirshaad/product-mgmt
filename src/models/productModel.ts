import mongoose, { Schema, Document } from 'mongoose';
import Category from './categoryModel';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    status: 'In Stock' | 'Stock Out';
    productCode: string;
    category: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        image: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['In Stock', 'Stock Out'],
            default: 'In Stock',
        },
        productCode: {
            type: String,
            unique: true,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            validate: {
                validator: async (value: mongoose.Types.ObjectId) => {
                    const category = await Category.findById(value);
                    return !!category;
                },
                message: 'Invalid category ID.',
            },
        },
    },
    { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
