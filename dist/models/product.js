"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const db_1 = require("../config/db");
const productsCollection = db_1.db.collection('products');
exports.Products = productsCollection;
