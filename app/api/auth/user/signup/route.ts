import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { name, email, password, phone, domain } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide name, email, and password' },
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

        // Create new user
        // Defaulting role to 'intern' and domain to 'None' if not provided or valid
        const validDomains = ['HR', 'Program', 'IT', 'Sales', 'RM', 'None'];
        const userDomain = validDomains.includes(domain) ? domain : 'None';

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'intern', // Force intern role for public signup
            domain: userDomain,
            xp: 0
        });

        // Auto-login after signup
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json(
            { message: 'Signup successful', user: { name: user.name, email: user.email, role: user.role } },
            { status: 201 } // 201 Created
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}
