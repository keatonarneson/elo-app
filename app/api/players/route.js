import { NextResponse } from 'next/server';
import players from '@/data/players';

export async function GET() {
    return NextResponse.json(players);
}
