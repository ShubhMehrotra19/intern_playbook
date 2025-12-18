import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

// Hardcoded admin credentials backup logic (only if not in DB)
const ADMIN_EMAIL = 'shubh.mehrotra@scaler.com';
const ADMIN_PASS = 'internadmin';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Special case for default admin if not exists in DB yet
        if (email === ADMIN_EMAIL) {
            let adminUser = await User.findOne({ email: ADMIN_EMAIL });
            if (!adminUser) {
                // Create the default admin on the fly if he logs in and doesn't exist
                // SECURITY NOTE: In a real app we might seed this differently, but per requirements
                // we need this user to exist.
                if (password === ADMIN_PASS) {
                    adminUser = await User.create({
                        name: 'Super Admin',
                        email: ADMIN_EMAIL,
                        password: ADMIN_PASS, // will be hashed by hook
                        role: 'admin',
                        domain: 'None' // Admins might not have a specific domain or 'All'
                    });
                } else {
                    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
                }
            }

            // Verify password for admin (whether just created or existing)
            const isMatch = await adminUser.comparePassword(password);
            if (!isMatch) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

            const token = jwt.sign(
                { userId: adminUser._id, email: adminUser.email, role: adminUser.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            const response = NextResponse.json(
                { message: 'Login successful', user: { name: adminUser.name, email: adminUser.email, role: adminUser.role } },
                { status: 200 }
            );

            response.cookies.set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return response;
        }

        // Normal User Login
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json(
            { message: 'Login successful', user: { name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
