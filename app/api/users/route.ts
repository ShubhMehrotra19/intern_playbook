import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const domain = searchParams.get('domain');

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

        const query = domain && domain !== 'All' ? { domain, role: 'intern' } : { role: 'intern' };

        // Fetch users and sort by XP (Leaderboard style)
        const users = await User.find(query)
            .select('name email domain role xp completedTasks phone createdAt')
            .sort({ xp: -1 });

        return NextResponse.json({ users }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
