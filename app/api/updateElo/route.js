import { NextResponse } from 'next/server';
import players from '@/data/players';

const K = 32; // ELO K-factor

function expectedScore(eloA, eloB) {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

export async function POST(request) {
    const { winnerId, loserId } = await request.json();

    console.log('Server received POST:', winnerId, loserId);

    if (!winnerId || !loserId) {
        return NextResponse.json(
            { error: 'Missing winnerId or loserId' },
            { status: 400 }
        );
    }

    const winner = players.find(p => p.id === winnerId);
    const loser = players.find(p => p.id === loserId);

    if (!winner || !loser) {
        return NextResponse.json(
            { error: 'Invalid winner or loser id' },
            { status: 400 }
        );
    }

    // Calculate expected scores
    const expectedWinner = expectedScore(winner.elo, loser.elo);
    const expectedLoser = 1 - expectedWinner;

    // Update ELO
    winner.elo = Math.round(winner.elo + K * (1 - expectedWinner));
    loser.elo = Math.round(loser.elo + K * (0 - expectedLoser));

    return NextResponse.json({ players });
}
