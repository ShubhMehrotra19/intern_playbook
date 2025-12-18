import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import User from '@/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as JwtPayload;
        await dbConnect();

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ message: 'Task not found' }, { status: 404 });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // CASTING ID TO ANY TO FIX BUILD ERROR
        // Mongoose usually handles string vs ObjectId comparison internally, but TS is strict.
        if (user.completedTasks.map((t: any) => t.toString()).includes(id)) {
            return NextResponse.json({ message: 'Task already completed' }, { status: 400 });
        }

        user.completedTasks.push(id as any);
        user.xp += task.xpReward;
        await user.save();

        return NextResponse.json({ message: 'Task completed', xp: user.xp }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error completing task' }, { status: 500 });
    }
}
