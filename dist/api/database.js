"use strict";
// ✅ IMPLEMENTADO - Simple SQLite Database (local, no external deps)
const fs = require('fs');
/**
 * In-memory database for local development
 * Storage location: memory.db (JSON format)
 */
const db = {
    users: JSON.parse(fs.readFileSync('./memory.db', 'utf-8') || '{"users":[]}'),
    tokens: [] // Local token storage
};
// Helper to save DB changes
const saveDB = () => {
    fs.writeFileSync('./memory.db', JSON.stringify(db, null, 2));
};
/**
 * Get user by email
 */
const getUserByEmail = (email) => db.users.find(u => u.email === email);
/**
 * Create new user
 */
const createUser = ({ email, password, name }) => {
    const userId = db.users.length + 1;
    db.users.push({ id: userId, email, password, name });
    saveDB();
    return db.users[db.users.length - 1];
};
/**
 * Get all users (for listing)
 */
const getAllUsers = () => db.users;
// Export helpers for use in routes
module.exports = {
    db,
    getUserByEmail,
    createUser,
    getAllUsers,
    saveDB
};
//# sourceMappingURL=database.js.map