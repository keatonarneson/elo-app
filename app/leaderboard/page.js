export const dynamic = 'force-dynamic';
// or use: export const revalidate = 0;
// This ensures our leaderboard fetch is always fresh (no caching).

export default async function LeaderboardPage() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    // Fetch from our /api/players route
    const res = await fetch(`${baseUrl}/api/players`, { cache: 'no-store' });

    // Parse JSON
    const players = await res.json();

    // Sort players by descending ELO
    const sortedPlayers = players.sort((a, b) => b.elo - a.elo);

    return (
        <main style={styles.container}>
            <h1>Leaderboard</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Rank</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>ELO</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPlayers.map((player, index) => (
                        <tr key={player.id}>
                            <td style={styles.td}>{index + 1}</td>
                            <td style={styles.td}>{player.name}</td>
                            <td style={styles.td}>{player.elo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}

const styles = {
    container: {
        fontFamily: 'sans-serif',
        padding: '2rem',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem',
    },
    th: {
        borderBottom: '2px solid #ccc',
        padding: '0.5rem 1rem',
        textAlign: 'left',
    },
    td: {
        borderBottom: '1px solid #eee',
        padding: '0.5rem 1rem',
    },
};
