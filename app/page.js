'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [players, setPlayers] = useState([]);
    const [playerA, setPlayerA] = useState(null);
    const [playerB, setPlayerB] = useState(null);

    // Fetch players from /api/players
    const fetchPlayers = async () => {
        try {
            const res = await fetch('/api/players');
            const data = await res.json();
            setPlayers(data);
        } catch (err) {
            console.error('Error fetching players:', err);
        }
    };

    // Pick 2 random players from players array
    const pickRandomPlayers = playersList => {
        if (playersList.length < 2) return;
        const shuffled = [...playersList].sort(() => 0.5 - Math.random());
        setPlayerA(shuffled[0]);
        setPlayerB(shuffled[1]);
    };

    // On component mount, fetch initial players
    useEffect(() => {
        fetchPlayers();
    }, []);

    // Whenever `players` updates, pick new random players
    useEffect(() => {
        if (players.length >= 2) {
            pickRandomPlayers(players);
        }
    }, [players]);

    // Handle user picking a winner
    const handlePickWinner = async (winner, loser) => {
        try {
            await fetch('/api/updateElo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    winnerId: winner.id,
                    loserId: loser.id,
                }),
            });
            // Re-fetch updated players
            await fetchPlayers();
        } catch (err) {
            console.error('Error updating ELO:', err);
        }
    };

    // If we don't have two players yet, show "Loading..."
    if (!playerA || !playerB) {
        return <div>Loading matchup...</div>;
    }

    return (
        <div style={styles.container}>
            <h1>ELO Baseball Matchup</h1>
            <h3>12-Team Roto 5x5</h3>
            <div style={styles.matchup}>
                <div style={styles.player}>
                    <h2>{playerA.name}</h2>
                    <p>ELO: {playerA.elo}</p>
                    <button onClick={() => handlePickWinner(playerA, playerB)}>
                        Choose {playerA.name}
                    </button>
                </div>
                <div style={styles.vs}>VS</div>
                <div style={styles.player}>
                    <h2>{playerB.name}</h2>
                    <p>ELO: {playerB.elo}</p>
                    <button onClick={() => handlePickWinner(playerB, playerA)}>
                        Choose {playerB.name}
                    </button>
                </div>
            </div>
            <button
                onClick={() => pickRandomPlayers(players)}
                style={styles.randomizeButton}
            >
                Show Another Matchup
            </button>

            <div style={{ marginTop: '20px' }}>
                {/* Link to the Leaderboard page */}
                <Link href="/leaderboard" style={styles.link}>
                    View Leaderboard
                </Link>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'sans-serif',
        textAlign: 'center',
        marginTop: '50px',
    },
    matchup: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '50px',
        margin: '30px 0',
    },
    vs: {
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    player: {
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
    },
    randomizeButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    link: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1rem',
        textDecoration: 'none',
        color: 'blue',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
};
