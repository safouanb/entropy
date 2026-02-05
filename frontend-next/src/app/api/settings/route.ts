import { NextResponse } from 'next/server';
import { predictionService } from '@/lib/backend-client';

export async function GET() {
    try {
        const response = await predictionService.getUser('user@entropy.energy'); // Hardcoded user for now
        return NextResponse.json(response.user);
    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await predictionService.updateUser({
            ...body,
            email: 'user@entropy.energy' // Ensure email is consistent
        });
        return NextResponse.json(response.user);
    } catch (error) {
        console.error('Settings POST Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
