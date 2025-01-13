"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const product_1 = require("../models/product");
const codeGenerator_1 = require("../utils/codeGenerator");
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, discount, image, status, category } = req.body;
        if (!name || !price || !category) {
            return res
                .status(400)
                .json({ error: 'Name, price, and category are required' });
        }
        const productCode = (0, codeGenerator_1.generateProductCode)(name);
        const product = {
            name,
            description,
            price,
            discount,
            image,
            status,
            category,
            productCode,
        };
        yield product_1.Products.insertOne(product);
        res.status(201).json({ message: 'Product created', product });
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
});
exports.createProduct = createProduct;
