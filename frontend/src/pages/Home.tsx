import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User, Strategy } from '../types';
import { strategyService } from '../services/api';

interface HomeProps {
    user: User | null;
}

export default function Home({ user }: HomeProps) {
    const [recentStrategies, setRecentStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(true);
    const [allStrategies, setAllStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
        document.title = 'F1 Strategies - Formula 1 Race Strategy Hub';
    }, []);

    useEffect(() => {
        if (user && user.role === 'admin') {
            loadAllStrategiesAdmin();
        }
        loadRecentStrategies();
    }, []);

    const loadRecentStrategies = async () => {
        try {
            const strategies = await strategyService.getByUserAll();
            const recent = strategies
                .filter(s => s.approved)
                .slice(0, 3);
            setRecentStrategies(recent);
        } catch (error) {
            console.error("Failed to load strategies:", error);
        } finally {
            setLoading(false);
        }
    }

    const loadAllStrategiesAdmin = async () => {
        try {
            const strategies = await strategyService.getAll();
            setAllStrategies(strategies);
        } catch (error) {
            console.error("Failed to load all strategies:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main">
            <section className="hero">
                <div className="container">
                    {!user && (
                        <>
                            <h1 className="hero__title">F1 STRATEGIES</h1>
                            <p className="hero__subtitle">
                                Create, Share & Analyze Formula 1 Race Strategies
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                                <Link to="/login" className="btn btn--primary">Login</Link>
                                <Link to="/register" className="btn btn--secondary">Get Started</Link>
                            </div>
                        </>
                    )}

                    {user && user.role === 'user' && (
                        <>
                            <h1 className="hero__title">Welcome Back, {user.username}! 🏁</h1>
                            <p className="hero__subtitle">
                                Ready to create your next winning strategy?
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link to="/create" className="btn btn--primary">Create Strategy</Link>
                                <Link to="/strategies" className="btn btn--secondary">My Strategies</Link>
                            </div>
                        </>
                    )}

                    {user && user.role === 'admin' && (
                        <>
                            <h1 className="hero__title">Admin Dashboard 👑</h1>
                            <p className="hero__subtitle">
                                Manage strategies, users, and platform content
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link to="/admin" className="btn btn--primary">Admin Panel</Link>
                                <Link to="/create" className="btn btn--secondary">Create Strategy</Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="container" style={{ marginTop: '3rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem'}}>Features</h2>
                <div className="features">
                    <div className="feature card">
                        <div className="feature__icon">🏁</div>
                        <h3>Create Strategies</h3>
                        <p>Plan detailed pit stop strategies with tire and fuel management for any Grand Prix</p>
                    </div>
                    <div className="feature card">
                        <div className="feature__icon">🤝</div>
                        <h3>Analyze Data</h3>
                        <p>Compare different strategies and optimize your race plan with detailed analytics</p>
                    </div>
                    <div className="feature card">
                        <div className="feature__icon">🌐</div>
                        <h3>Community Sharing</h3>
                        <p>Share your strategies with the community and learn from other F1 enthusiasts</p>
                    </div>
                </div>
            </section>

            {!loading && recentStrategies.length > 0 && (
                <section className="container" style={{ marginTop: '3rem'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2>Recent Strategies</h2>
                        {user && <Link to="/strategies" className="btn btn--secondary">View All</Link>}
                    </div>
                    <div className="strategies-grid">
                        {recentStrategies.map((strategy) => (
                            <div key={strategy.id} className="card">
                                <div className="card__header">
                                    <h3 className="card__title">{strategy.name}</h3>
                                    <span className="badge badge--success">✓ Approved</span>
                                </div>
                                <p style={{ color: 'var(--f1-light-gray)', marginBottom: '1rem' }}>
                                    {strategy.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--f1-light-gray)', fontSize: '0.9rem' }}>
                                        🛞 {strategy.parameters.pit_stops?.length ?? 0} pit stops
                                    </span>
                                    {user ? (
                                        <Link to={`/strategies/${strategy.id}`} className="btn btn--secondary">
                                            View Strategy
                                        </Link>
                                    ) : (
                                        <Link to="/login" className="btn btn--secondary">
                                            Login to View
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {!user && (
                <section className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <div className="card" style={{ padding: '3rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Ready to Get Started?</h2>
                        <p style={{ color: 'var(--f1-light-gray)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            Join thousands of F1 fans creating and sharing race strategies
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn btn--primary">Create Free Account</Link>
                            <Link to="/login" className="btn btn--secondary">Sign In</Link>
                        </div>
                    </div>
                </section>
            )}

            {user && user.role === 'admin' && (
                <section className="container" style={{ marginTop: '3rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Quick Stats</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                            <h3>Pending Approvals</h3>
                            <p style={{ fontSize: '2rem', color: 'var(--f1-red)', margin: '0.5rem 0' }}>
                                {allStrategies.filter(s => !s.approved).length}
                            </p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                            <h3>Total Strategies</h3>
                            <p style={{ fontSize: '2rem', color: 'var(--success)', margin: '0.5rem 0' }}>
                                {allStrategies.length}
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}