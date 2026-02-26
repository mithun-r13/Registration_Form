const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Middleware to check admin credentials (basic auth for simplicity)
const requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }

    // Expecting format: "Bearer <token>" (for this demo, token is just "admin-token")
    // Or could use Basic Auth with base64 encoded username:password
    // But since frontend just sets sessionStorage, let's keep it simple for now and accept a token
    if (authHeader !== 'Bearer admin-session-token') {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    next();
};

// 1. Create a registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, college, branch, year, interest } = req.body;

        // Check if email already exists
        const existing = await Registration.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'This email is already registered' });
        }

        const newRegistration = new Registration({
            name, email, phone, college, branch, year, interest
        });

        await newRegistration.save();

        // Return masked response for security (or just success message)
        res.status(201).json({ message: 'Registration successful', id: newRegistration._id });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error while registering' });
    }
});

// 2. Admin Login
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    if (username === adminUser && password === adminPass) {
        // In a real app, generate a JWT. For here, a simple token.
        res.json({ token: 'admin-session-token', message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// 3. Get all registrations (Admin only)
router.get('/registrations', requireAdmin, async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ created_at: -1 });

        // Convert to format match frontend expects (e.g. `id` instead of `_id`)
        const formatted = registrations.map(r => ({
            id: r._id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            college: r.college,
            branch: r.branch,
            year: r.year,
            interest: r.interest,
            created_at: r.created_at
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Fetch registrations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Delete a registration (Admin only)
router.delete('/registrations/:id', requireAdmin, async (req, res) => {
    try {
        const result = await Registration.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Registration not found' });
        }
        res.json({ message: 'Registration deleted successfully' });
    } catch (error) {
        console.error('Delete registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. Get stats (Admin only)
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const total = await Registration.countDocuments();

        // Count today's registrations
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const today = await Registration.countDocuments({ created_at: { $gte: startOfToday } });

        // Find top branch
        const topBranchAgg = await Registration.aggregate([
            { $group: { _id: '$branch', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const topBranch = topBranchAgg.length > 0 ? topBranchAgg[0]._id : '—';

        res.json({ total, today, topBranch });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
