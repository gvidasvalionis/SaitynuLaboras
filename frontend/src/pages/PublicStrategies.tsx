import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strategyService, teamService, driverService, grandPrixService } from '../services/api';
import type { User, Strategy, Team, Driver, GrandPrix } from '../types';

interface PublicStrategiesProps {
  user: User | null;
}

// Extended strategy type with loaded data
interface StrategyWithDetails extends Strategy {
  team?: Team;
  driver?: Driver;
  grandPrix?: GrandPrix;
}

export default function PublicStrategies({ user }: PublicStrategiesProps) {
  const [strategies, setStrategies] = useState<StrategyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Browse Strategies | F1 Strategies';
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      // Load only approved strategies from public endpoint
      const data = await strategyService.getAllPublic();
      
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

  // Filter strategies based on search term
  const filteredStrategies = strategies.filter(strategy => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      strategy.name.toLowerCase().includes(search) ||
      strategy.description.toLowerCase().includes(search) ||
      strategy.team?.name.toLowerCase().includes(search) ||
      strategy.driver?.name.toLowerCase().includes(search) ||
      strategy.driver?.surname.toLowerCase().includes(search) ||
      strategy.grandPrix?.name.toLowerCase().includes(search)
    );
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
            <h1>Browse F1 Strategies 🏁</h1>
            <p style={{ color: 'var(--f1-light-gray)', marginTop: '0.5rem' }}>
              Explore approved Formula 1 race strategies from the community
            </p>
          </div>
          {!user && (
            <Link to="/login" className="btn btn--primary">
              Login to Create
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by strategy name, team, driver, or grand prix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="search-clear"
                aria-label="Clear search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="search-stats">
            <span style={{ color: 'var(--f1-light-gray)' }}>
              {filteredStrategies.length} {filteredStrategies.length === 1 ? 'strategy' : 'strategies'} found
            </span>
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
            <div className="empty-state-icon">🔍</div>
            <h2>No Strategies Found</h2>
            <p style={{ color: 'var(--f1-light-gray)', marginBottom: '1.5rem' }}>
              {searchTerm 
                ? `No strategies match "${searchTerm}". Try a different search term.`
                : 'No approved strategies available yet. Check back soon!'}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="btn btn--secondary">
                Clear Search
              </button>
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
                  <span className="badge badge--success">✅ Approved</span>
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
                          ? `${strategy.driver.name} ${strategy.driver.surname}` 
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

                {/* Card Footer - Only View Details button */}
                <div className="strategy-card-footer">
                  {user ? (
                    <Link to={`/strategies/${strategy.id}`} className="btn btn--primary">
                      View Details
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn--secondary">
                      Login to View Details
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