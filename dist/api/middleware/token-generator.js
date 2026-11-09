"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_EXPIRES_IN_MS = exports.verifyToken = exports.generateToken = void 0;
// JWT Token Generator & Validator
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'ultron-secret-key-2026';
const JWT_EXPIRES_IN = '7d'; // 7 days default
/**
 * Generate JWT token for user
 */
const generateToken = (data) => {
    return jsonwebtoken_1.default.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.generateToken = generateToken;
/**
 * Verify and decode JWT token
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Token expiration time (ms)
 */
exports.TOKEN_EXPIRES_IN_MS = parseInt(JWT_EXPIRES_IN.replace(/\D/g, ''), 10);
// Export para usar en otros módulos
exports.default = {
    generateToken: exports.generateToken,
    verifyToken: exports.verifyToken,
    TOKEN_EXPIRES_IN_MS: exports.TOKEN_EXPIRES_IN_MS
};
//# sourceMappingURL=token-generator.js.map