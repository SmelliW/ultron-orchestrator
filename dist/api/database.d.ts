declare const fs: any;
/**
 * In-memory database for local development
 * Storage location: memory.db (JSON format)
 */
declare const db: {
    users: any;
    tokens: never[];
};
declare const saveDB: () => void;
/**
 * Get user by email
 */
declare const getUserByEmail: (email: any) => any;
/**
 * Create new user
 */
declare const createUser: ({ email, password, name }: {
    email: any;
    password: any;
    name: any;
}) => any;
/**
 * Get all users (for listing)
 */
declare const getAllUsers: () => any;
//# sourceMappingURL=database.d.ts.map