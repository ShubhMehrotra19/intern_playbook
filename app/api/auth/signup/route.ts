import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide all fields' },
                { status: 400 }
            );
        }

        if (!email.endsWith('@scaler.com')) {
            return NextResponse.json(
                { message: 'Only @scaler.com emails are allowed' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Default role is intern
        const user = await User.create({
            name,
            email,
            password,
            role: 'intern',
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json(
            { message: 'Signup successful', user: { name: user.name, email: user.email, role: user.role } },
            { status: 201 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
