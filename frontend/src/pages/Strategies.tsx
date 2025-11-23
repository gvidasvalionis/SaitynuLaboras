import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strategyService, teamService, driverService, grandPrixService } from '../services/api';
import type { User, Strategy, Team, Driver, GrandPrix } from '../types';

interface StrategiesProps {
  user: User | null;
}

// Extended strategy type with loaded data
interface StrategyWithDetails extends Strategy {
  team?: Team;
  driver?: Driver;
  grandPrix?: GrandPrix;
}

export default function Strategies({ user }: StrategiesProps) {
  const [strategies, setStrategies] = useState<StrategyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    document.title = user?.role === 'user' 
      ? 'My Strategies | F1 Strategies'
      : 'Race Strategies | F1 Strategies';
    loadStrategies();
  }, [user]);

  useEffect(() => {
    loadStrategies();
  }, [user]);

  const loadStrategies = async () => {
    try {
      let data: Strategy[];
      
      // Admin sees all strategies, regular user sees only their own
      if (user && user.role === 'admin') {
        data = await strategyService.getAll();
      } else if (user && user.role === 'user') {
        data = await strategyService.getByUserAll();
      } else {
        // Guest users see all approved strategies
        const allStrategies = await strategyService.getAll();
        data = allStrategies.filter(s => s.approved);
      }

      // Load related data for all strategies
      const strategiesWithDetails = await loadRelatedData(data);
      setStrategies(strategiesWithDetails);
    } catch (err: any) {
      setError('Failed to load strategies. Please try again later.');
      console.error('Error loading strategies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedData = async (strategies: Strategy[]): Promise<StrategyWithDetails[]> => {
    try {
      // Get all unique IDs
      const teamIds = [...new Set(strategies.map(s => s.team_id))];
      const driverIds = [...new Set(strategies.map(s => s.driver_id))];
      const grandPrixIds = [...new Set(strategies.map(s => s.grand_prix_id))];

      // Load all data in parallel
      const [teams, drivers, grandPrixList] = await Promise.all([
        Promise.all(teamIds.map(id => teamService.getById(id).catch(() => null))),
        Promise.all(driverIds.map(id => driverService.getById(id).catch(() => null))),
        Promise.all(grandPrixIds.map(id => grandPrixService.getById(id).catch(() => null))),
      ]);

      // Create lookup maps
      const teamMap = new Map(teams.filter(t => t).map(t => [t!.id, t!]));
      const driverMap = new Map(drivers.filter(d => d).map(d => [d!.id, d!]));
      const grandPrixMap = new Map(grandPrixList.filter(g => g).map(g => [g!.id, g!]));

      // Attach related data to strategies
      return strategies.map(strategy => ({
        ...strategy,
        team: teamMap.get(strategy.team_id),
        driver: driverMap.get(strategy.driver_id),
        grandPrix: grandPrixMap.get(strategy.grand_prix_id),
      }));
    } catch (err) {
      console.error('Error loading related data:', err);
      return strategies; // Return strategies without related data if failed
    }
  };

  const filteredStrategies = strategies.filter(strategy => {
    if (filter === 'approved') return strategy.approved;
    if (filter === 'pending') return !strategy.approved;
    return true;
  });

  if (loading) {
    return (
      <div className="main">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <section className="container">
        {/* Header Section */}
        <div className="strategies-header">
          <div>
            <h1>
              {user && user.role === 'user' ? 'My Strategies 🏁' : 'Race Strategies 🏁'}
            </h1>
            <p style={{ color: 'var(--f1-light-gray)', marginTop: '0.5rem' }}>
              {user && user.role === 'user' 
                ? 'Manage your personal race strategies'
                : user && user.role === 'admin'
                ? 'Manage all strategies in the platform'
                : 'Browse approved F1 race strategies from the community'
              }
            </p>
          </div>
          {user && (
            <Link to="/create" className="btn btn--primary">
              Create Strategy
            </Link>
          )}
        </div>

        {/* Filter Bar */}
        <div className="strategies-filters">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({strategies.length})
            </button>
            <button
              className={`filter-btn ${filter === 'approved' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              ✅ Approved ({strategies.filter(s => s.approved).length})
            </button>
            {user && (
              <button
                className={`filter-btn ${filter === 'pending' ? 'filter-btn--active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                ⏳ Pending ({strategies.filter(s => !s.approved).length})
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert--error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredStrategies.length === 0 && (
          <div className="empty-state card">
            <div className="empty-state-icon">📊</div>
            <h2>No Strategies Found</h2>
            <p style={{ color: 'var(--f1-light-gray)', marginBottom: '1.5rem' }}>
              {filter === 'pending' 
                ? 'No strategies are pending approval.'
                : user && user.role === 'user'
                ? "You haven't created any strategies yet."
                : 'Be the first to create a strategy!'}
            </p>
            {user && filter !== 'pending' && (
              <Link to="/create" className="btn btn--primary">
                {user.role === 'user' ? 'Create Your First Strategy' : 'Create First Strategy'}
              </Link>
            )}
          </div>
        )}

        {/* Strategies Grid */}
        {filteredStrategies.length > 0 && (
          <div className="strategies-grid">
            {filteredStrategies.map((strategy) => (
              <div key={strategy.id} className="strategy-card card">
                {/* Card Header */}
                <div className="card__header">
                  <h3 className="card__title">{strategy.name}</h3>
                  {strategy.approved ? (
                    <span className="badge badge--success">✅ Approved</span>
                  ) : (
                    <span className="badge badge--warning">⏳ Pending</span>
                  )}
                </div>

                {/* Card Body */}
                <div className="strategy-card-body">
                  <p className="strategy-description">{strategy.description}</p>

                  {/* Strategy Stats */}
                  <div className="strategy-stats">
                    <div className="strategy-stat">
                      <span className="strategy-stat-icon">🛞</span>
                      <span className="strategy-stat-label">
                        {strategy.parameters.pit_stops?.length || 0} Pit Stops
                      </span>
                    </div>
                    <div className="strategy-stat">
                      <span className="strategy-stat-icon">🏎️</span>
                      <span className="strategy-stat-label">
                        {strategy.grandPrix 
                          ? `${strategy.grandPrix.name}` 
                          : `Grand Prix #${strategy.grand_prix_id}`
                        }
                      </span>
                    </div>
                    <div className="strategy-stat">
                      <span className="strategy-stat-icon">👤</span>
                      <span className="strategy-stat-label">
                        {strategy.driver 
                          ? `${strategy.driver.name}` 
                          : `Driver #${strategy.driver_id}`
                        }
                      </span>
                    </div>
                    <div className="strategy-stat">
                      <span className="strategy-stat-icon">🏁</span>
                      <span className="strategy-stat-label">
                        {strategy.team 
                          ? strategy.team.name 
                          : `Team #${strategy.team_id}`
                        }
                      </span>
                    </div>
                    {user && user.role === 'admin' && (
                      <div className="strategy-stat">
                        <span className="strategy-stat-icon">👥</span>
                        <span className="strategy-stat-label">
                          {strategy.user_id === user.id ? 'Created by You' : `User #${strategy.user_id}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pit Stops Preview */}
                  {strategy.parameters.pit_stops && strategy.parameters.pit_stops.length > 0 && (
                    <div className="pit-stops-preview">
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--f1-light-gray)' }}>
                        Pit Stop Strategy:
                      </h4>
                      <div className="pit-stops-list">
                        {strategy.parameters.pit_stops.slice(0, 3).map((stop, index) => (
                          <span key={index} className="pit-stop-badge">
                            Lap {stop.lap}: {stop.tire}
                          </span>
                        ))}
                        {strategy.parameters.pit_stops.length > 3 && (
                          <span className="pit-stop-badge" style={{ opacity: 0.7 }}>
                            +{strategy.parameters.pit_stops.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="strategy-card-footer">
                  <Link to={`/strategies/${strategy.id}`} className="btn btn--secondary">
                    View Details
                  </Link>
                  {user && user.id === strategy.user_id && (
                    <Link to={`/strategies/${strategy.id}/edit`} className="btn btn--secondary">
                      ✏️ Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}