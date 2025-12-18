import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

// Helper to verify admin
async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) return null;
    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as JwtPayload;
        if (decoded.role === 'admin') return decoded;
        return null;
    } catch {
        return null;
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await verifyAdmin();
        if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await req.json();

        await dbConnect();
        const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });

        if (!updatedTask) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

        return NextResponse.json({ task: updatedTask }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const admin = await verifyAdmin();
        if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { id } = await params;

        await dbConnect();
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting task' }, { status: 500 });
    }
}
