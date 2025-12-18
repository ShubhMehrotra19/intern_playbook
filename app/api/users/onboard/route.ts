import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as JwtPayload;
        await dbConnect();

        const { phone, domain } = await req.json();

        if (!['HR', 'Program', 'IT', 'Sales', 'RM'].includes(domain)) {
            return NextResponse.json({ message: 'Invalid domain' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            { phone, domain },
            { new: true }
        );

        return NextResponse.json({ message: 'Onboarding complete', user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
