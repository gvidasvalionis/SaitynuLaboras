import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { strategyService, teamService, driverService, grandPrixService } from '../services/api';
import type { User, Strategy, Team, Driver, GrandPrix } from '../types';

interface AdminPanelProps {
  user: User | null;
}

// Extended strategy type with loaded data
interface StrategyWithDetails extends Strategy {
  team?: Team;
  driver?: Driver;
  grandPrix?: GrandPrix;
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<StrategyWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Admin Panel | F1 Strategies';
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadStrategies();
  }, [user, navigate]);

  const loadStrategies = async () => {
    try {
      const data = await strategyService.getAll();
      
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

  const handleApprove = async (strategyId: number) => {
    setActionLoading(strategyId);
    try {
      const updated = await strategyService.approve(strategyId);
      
      // Update the strategy in the list and preserve related data
      setStrategies(strategies.map(s => {
        if (s.id === strategyId) {
          return {
            ...updated,
            team: s.team,
            driver: s.driver,
            grandPrix: s.grandPrix,
          };
        }
        return s;
      }));
      alert('Strategy approved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to approve strategy.');
      console.error('Error approving strategy:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (strategyId: number, strategyName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${strategyName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setActionLoading(strategyId);
    try {
      await strategyService.delete(strategyId);
      // Remove the strategy from the list
      setStrategies(strategies.filter(s => s.id !== strategyId));
      alert('Strategy deleted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete strategy.');
      console.error('Error deleting strategy:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="main">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Filter strategies
  const filteredStrategies = strategies.filter(strategy => {
    if (filter === 'approved') return strategy.approved;
    if (filter === 'pending') return !strategy.approved;
    return true;
  });

  const pendingCount = strategies.filter(s => !s.approved).length;
  const approvedCount = strategies.filter(s => s.approved).length;

  return (
    <div className="main">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel 👑</h1>
            <p style={{ color: 'var(--f1-light-gray)', marginTop: '0.5rem' }}>
              Manage all strategies on the platform
            </p>
          </div>
          <Link to="/" className="btn btn--secondary">
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="alert alert--error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Strategies</h3>
              <p className="stat-number">{strategies.length}</p>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Approval</h3>
              <p className="stat-number" style={{ color: 'var(--f1-red)' }}>{pendingCount}</p>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Approved</h3>
              <p className="stat-number" style={{ color: '#4ade80' }}>{approvedCount}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Strategies ({strategies.length})
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`filter-tab ${filter === 'approved' ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({approvedCount})
          </button>
        </div>

        {/* Strategies Table */}
        {filteredStrategies.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--f1-light-gray)', fontSize: '1.1rem' }}>
              {filter === 'pending' && 'No pending strategies'}
              {filter === 'approved' && 'No approved strategies'}
              {filter === 'all' && 'No strategies found'}
            </p>
          </div>
        ) : (
          <div className="admin-table-container card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Strategy Name</th>
                  <th>Created By</th>
                  <th>Grand Prix</th>
                  <th>Driver</th>
                  <th>Team</th>
                  <th>Pit Stops</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStrategies.map((strategy) => (
                  <tr key={strategy.id}>
                    <td>
                      <Link 
                        to={`/strategies/${strategy.id}`} 
                        className="table-link"
                      >
                        {strategy.name}
                      </Link>
                    </td>
                    <td>
                      {strategy.user_id === user.id ? (
                        <span style={{ color: 'var(--f1-red)' }}>You</span>
                      ) : (
                        `User #${strategy.user_id}`
                      )}
                    </td>
                    <td>
                      {strategy.grandPrix 
                        ? `${strategy.grandPrix.name}`
                        : `GP #${strategy.grand_prix_id}`
                      }
                    </td>
                    <td>
                      {strategy.driver 
                        ? `${strategy.driver.name} ${strategy.driver.surname}`
                        : `Driver #${strategy.driver_id}`
                      }
                    </td>
                    <td>
                      {strategy.team 
                        ? strategy.team.name
                        : `Team #${strategy.team_id}`
                      }
                    </td>
                    <td>{strategy.parameters.pit_stops?.length || 0}</td>
                    <td>
                      {strategy.approved ? (
                        <span className="badge badge--success">✅ Approved</span>
                      ) : (
                        <span className="badge badge--warning">⏳ Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        {!strategy.approved && (
                          <button
                            onClick={() => handleApprove(strategy.id)}
                            className="btn-icon"
                            title="Approve"
                            disabled={actionLoading === strategy.id}
                          >
                            {actionLoading === strategy.id ? '⏳' : '✅'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(strategy.id, strategy.name)}
                          className="btn-icon"
                          title="Delete"
                          disabled={actionLoading === strategy.id}
                          style={{ color: 'var(--f1-red)' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}