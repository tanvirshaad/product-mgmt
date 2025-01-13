"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateProductCode = (name) => {
    const hashedName = crypto_1.default
        .createHash('md5')
        .update(name)
        .digest('hex')
        .slice(0, 8);
    let longestSubstr = '';
    let temp = '';
    for (let i = 0; i < name.length; i++) {
        if (i === 0 || name[i].toLowerCase() > name[i - 1].toLowerCase()) {
            temp += name[i];
        }
        else {
            if (temp.length > longestSubstr.length) {
                longestSubstr = temp;
            }
            temp = name[i];
        }
    }
    if (temp.length > longestSubstr.length)
        longestSubstr = temp;
    const startIndex = name.toLowerCase().indexOf(longestSubstr.toLowerCase());
    const endIndex = startIndex + longestSubstr.length - 1;
    return `${hashedName}-${startIndex}${longestSubstr}${endIndex}`;
};
exports.generateProductCode = generateProductCode;
