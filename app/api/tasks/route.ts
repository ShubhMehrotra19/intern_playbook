import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const domain = searchParams.get('domain');

        if (!domain) {
            return NextResponse.json({ message: 'Domain required' }, { status: 400 });
        }

        await dbConnect();
        const tasks = await Task.find({ domain });
        return NextResponse.json({ tasks }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 });
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

        const task = await Task.create(body);
        return NextResponse.json({ task }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
    }
}
