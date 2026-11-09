/**
 * Generate JWT token for user
 */
export declare const generateToken: (data: {
    id: number;
    email: string;
    role?: string;
}) => any;
/**
 * Verify and decode JWT token
 */
export declare const verifyToken: (token: string) => any | null;
/**
 * Token expiration time (ms)
 */
export declare const TOKEN_EXPIRES_IN_MS: number;
declare const _default: {
    generateToken: (data: {
        id: number;
        email: string;
        role?: string;
    }) => any;
    verifyToken: (token: string) => any | null;
    TOKEN_EXPIRES_IN_MS: number;
};
export default _default;
//# sourceMappingURL=token-generator.d.ts.map