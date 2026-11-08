/**
 * ULTRON - Users API Routes
 * Full integration with Prisma SQLite database
 */

import { Router, Request, Response } from 'express';
import { db } from '../database';
import { createToken } from '../middleware/token-generator';

const router = Router();

interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /api/users/register - Register new user with JWT token
 */
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body as RegisterRequest;

  console.log(`📝 User registration requested for ${email}`);

  try {
    // Check if user already exists
    const existingUser = await db.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password and create user
    const passwordHash = Buffer.from(password).toString('base64');
    const user = await createUser(email, passwordHash, firstName, lastName);

    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate JWT token
    const token = await createToken({ id: user.id, email: user.email });

    console.log(`✅ User registered successfully: ${email}`);
    res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token // Include token in response for immediate use
    });
  } catch (error) {
    console.error(`❌ Registration error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/users/login - Authenticate and return JWT token
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequest;

  console.log(`🔐 User login requested for ${email}`);

  if (!email || !password) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  try {
    // Find user by email
    const user = await db.user.findFirst({ where: { email } });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password verification (production should use bcrypt)
    const passwordMatch = Buffer.from(user.password).toString('base64') === Buffer.from(password).toString('base64');

    if (!passwordMatch) {
      console.log(`❌ Password mismatch for: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token on successful login
    const token = await createToken({ id: user.id, email: user.email });

    console.log(`✅ Login successful: ${email}`);
    res.json({
      message: 'Login successful',
      token,
      expiresIn: '7d'
    });
  } catch (error) {
    console.error(`❌ Login error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/users - List users with pagination
 */
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  console.log(`🔍 Listing users: page ${page}, limit ${limit}`);

  try {
    // Get total count for pagination
    const total = await db.user.count();

    // Get paginated results
    const users = await db.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Retrieved ${users.length} of ${total} users`);

    res.json({
      total,
      page,
      limit,
      data: users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName
      }))
    });
  } catch (error) {
    console.error(`❌ Error listing users: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/users/:id - Get single user by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`👤 Getting user ${id}`);

  try {
    const user = await db.user.findFirst({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ User retrieved: ${user.email}`);
    res.json({ data: user });
  } catch (error) {
    console.error(`❌ Error getting user: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/users/:id - Update user
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password, firstName, lastName } = req.body as any;

  console.log(`✏️ Updating user ${id}`);

  try {
    // Check if user exists
    let user = await db.user.findFirst({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    const updatedData: any = {};
    if (email !== user.email) updatedData.email = email;
    if (firstName !== undefined) updatedData.firstName = firstName;
    if (lastName !== undefined) updatedData.lastName = lastName;

    // Password update (requires hash)
    if (password !== undefined) {
      updatedData.password = Buffer.from(password).toString('base64');
    }

    user = await db.user.update({ where: { id }, data: updatedData });

    console.log(`✅ User updated: ${user.email}`);
    res.json({ message: 'User updated successfully', data: user });
  } catch (error) {
    console.error(`❌ Error updating user: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/users/:id - Delete user
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`🗑️ Deleting user ${id}`);

  try {
    await db.user.delete({ where: { id } });
    console.log(`✅ User deleted: ${id}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(`❌ Error deleting user: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
