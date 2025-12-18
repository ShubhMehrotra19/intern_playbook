import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resource from '@/models/Resource';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

export async function GET() {
    try {
        await dbConnect();
        const resources = await Resource.find().sort({ createdAt: -1 });
        return NextResponse.json({ resources }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching resources' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as JwtPayload;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();

        const resource = await Resource.create(body);
        return NextResponse.json({ resource }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating resource' }, { status: 500 });
    }
}
