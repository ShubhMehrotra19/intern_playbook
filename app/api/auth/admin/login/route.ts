import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';
const ADMIN_EMAIL = 'shubh.mehrotra@scaler.com';
const ADMIN_PASS = 'internadmin';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // 1. Check Hardcoded Admin / Recovery Logic
        if (email === ADMIN_EMAIL) {
            let adminUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

            // If admin doesn't exist in DB, create on the fly (First run setup)
            if (!adminUser) {
                if (password === ADMIN_PASS) {
                    try {
                        adminUser = await User.create({
                            name: 'Super Admin',
                            email: ADMIN_EMAIL,
                            password: ADMIN_PASS,
                            role: 'admin',
                            domain: 'None'
                        });
                        console.log('Admin user created successfully');
                    } catch (err) {
                        console.error('Error creating default admin:', err);
                        return NextResponse.json(
                            { message: 'Failed to create default admin' },
                            { status: 500 }
                        );
                    }
                } else {
                    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
                }
            }

            // Verify password
            const isMatch = await adminUser.comparePassword(password);
            if (!isMatch) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

            // Check if purely admin login is requested (optional security), but here we just ensure role is admin
            if (adminUser.role !== 'admin') {
                return NextResponse.json({ message: 'Access denied: Not an admin' }, { status: 403 });
            }

            const token = jwt.sign(
                { userId: adminUser._id, email: adminUser.email, role: adminUser.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            const response = NextResponse.json(
                { message: 'Admin Login successful', user: { name: adminUser.name, email: adminUser.email, role: adminUser.role } },
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

        // If not the hardcoded admin email, check if it's another admin stored in DB
        const user = await User.findOne({ email }).select('+password');
        if (!user || user.role !== 'admin') {
            // We return generic invalid creds or 403 to avoid leaking existence, 
            // but for now 403/401 is fine.
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json(
            { message: 'Admin Login successful', user: { name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Admin Login Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}
