import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { strategyService, teamService, driverService, grandPrixService, authService } from '../services/api';
import type { User, Strategy, Team, Driver, GrandPrix } from '../types';

interface StrategyDetailsProps {
  user: User | null;
}

export default function StrategyDetails({ user }: StrategyDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Related data
  const [team, setTeam] = useState<Team | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [grandPrix, setGrandPrix] = useState<GrandPrix | null>(null);
  const [creator, setCreator] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) {
      loadStrategy(parseInt(id));
    }
  }, [id, user, navigate]);

  const loadStrategy = async (strategyId: number) => {
    try {
      // Load strategy based on user role
      let data: Strategy;
      data = await strategyService.getByIdUser(strategyId);

      setStrategy(data);

      // Load related data
      await loadRelatedData(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load strategy.');
      console.error('Error loading strategy:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedData = async (strategy: Strategy) => {
    try {
      const [teamData, driverData, grandPrixData] = await Promise.all([
        teamService.getById(strategy.team_id),
        driverService.getById(strategy.driver_id),
        grandPrixService.getById(strategy.grand_prix_id),
      ]);

      setTeam(teamData);
      setDriver(driverData);
      setGrandPrix(grandPrixData);

      // Load creator info if admin
      if (user && user.role === 'admin' && strategy.user_id !== user.id) {
        try {
          // You'll need to create this endpoint or get user info another way
          // For now, we'll just show the user ID
          // const creatorData = await authService.getUserById(strategy.user_id);
          // setCreator(creatorData);
        } catch (err) {
          console.error('Failed to load creator info:', err);
        }
      }
    } catch (err) {
      console.error('Error loading related data:', err);
    }
  };

  const handleApprove = async () => {
    if (!strategy || !user || user.role !== 'admin') return;

    setActionLoading(true);
    try {
      const updated = await strategyService.approve(strategy.id);
      setStrategy(updated);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to approve strategy.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!strategy || !user) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this strategy? This action cannot be undone.'
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      await strategyService.deleteUser(strategy.id);
      alert('Strategy deleted successfully!');
      navigate('/strategies');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete strategy.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="main">
        <div className="container">
          <div className="alert alert--error">
            <span>⚠️</span>
            <span>{error || 'Strategy not found'}</span>
          </div>
          <Link to="/strategies" className="btn btn--secondary">
            Back to Strategies
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user && user.id === strategy.user_id; // Only owner can edit
  const canDelete = user && (user.id === strategy.user_id || user.role === 'admin'); // Owner or admin can delete
  const canApprove = user && user.role === 'admin' && !strategy.approved; // Only admin can approve

  return (
    <div className="main">
      <div className="container">
        {/* Back Button */}
        <Link to="/strategies" className="back-link">
          ← Back to Strategies
        </Link>

        {/* Strategy Header */}
        <div className="strategy-details-header">
          <div>
            <h1>{strategy.name}</h1>
            {strategy.approved ? (
              <span className="badge badge--success">✅ Approved</span>
            ) : (
              <span className="badge badge--warning">⏳ Pending Approval</span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="strategy-actions">
            {canApprove && (
              <button
                onClick={handleApprove}
                className="btn btn--primary"
                disabled={actionLoading}
              >
                {actionLoading ? 'Approving...' : '✅ Approve'}
              </button>
            )}
            {canEdit && (
              <Link
                to={`/strategies/${strategy.id}/edit`}
                className="btn btn--secondary"
              >
                ✏️ Edit
              </Link>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="btn btn--error"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : '🗑️ Delete'}
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="strategy-details-grid">
          {/* Left Column - Description & Info */}
          <div className="strategy-details-main">
            <div className="card">
              <h2>Description</h2>
              <p style={{ color: 'var(--f1-light-gray)', lineHeight: '1.8' }}>
                {strategy.description}
              </p>
            </div>

            <div className="card">
              <h2>Strategy Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">🏎️ Grand Prix</span>
                  <span className="info-value">
                    {grandPrix ? `${grandPrix.name} (${grandPrix.year})` : `Grand Prix #${strategy.grand_prix_id}`}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">👤 Driver</span>
                  <span className="info-value">
                    {driver ? `#${driver.name} ${driver.surname}` : `Driver #${strategy.driver_id}`}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">🏁 Team</span>
                  <span className="info-value">
                    {team ? team.name : `Team #${strategy.team_id}`}
                  </span>
                </div>
                {user && user.role === 'admin' && (
                  <div className="info-item">
                    <span className="info-label">👥 Created By</span>
                    <span className="info-value">
                      {strategy.user_id === user.id ? 'You' : `User #${strategy.user_id}`}
                    </span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">🛞 Total Pit Stops</span>
                  <span className="info-value">{strategy.parameters.pit_stops?.length || 0}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📊 Status</span>
                  <span className="info-value">
                    {strategy.approved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pit Stops Details */}
            {strategy.parameters.pit_stops && strategy.parameters.pit_stops.length > 0 && (
              <div className="card">
                <h2>Pit Stop Strategy</h2>
                <div className="pit-stops-details">
                  {strategy.parameters.pit_stops.map((stop, index) => (
                    <div key={index} className="pit-stop-card">
                      <div className="pit-stop-header">
                        <span className="pit-stop-number">Stop #{index + 1}</span>
                        <span className="pit-stop-lap">Lap {stop.lap}</span>
                      </div>
                      <div className="pit-stop-details-grid">
                        <div className="pit-stop-detail">
                          <span className="pit-stop-detail-label">🛞 Tire Compound</span>
                          <span className="pit-stop-detail-value">{stop.tire}</span>
                        </div>
                        {stop.fuel && (
                          <div className="pit-stop-detail">
                            <span className="pit-stop-detail-label">⛽ Fuel</span>
                            <span className="pit-stop-detail-value">{stop.fuel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Additional Parameters */}
          <div className="strategy-details-sidebar">
            {/* Driver & Team Info */}
            {driver && (
              <div className="card">
                <h3>🏎️ Driver Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p className="sidebar-value">
                    <strong>Name:</strong> {driver.name}
                  </p>
                </div>
              </div>
            )}

            {team && (
              <div className="card">
                <h3>🏁 Team Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p className="sidebar-value">
                    <strong>Name:</strong> {team.name}
                  </p>
                </div>
              </div>
            )}

            {/* Fuel Strategy */}
            {strategy.parameters.fuel_load && (
              <div className="card">
                <h3>⛽ Fuel Load</h3>
                <p className="sidebar-value">{strategy.parameters.fuel_load} kg</p>
              </div>
            )}

            {strategy.parameters.fuel_mode && (
              <div className="card">
                <h3>⛽ Fuel Mode</h3>
                <p className="sidebar-value">{strategy.parameters.fuel_mode}</p>
              </div>
            )}

            {strategy.parameters.tire_strategy && (
              <div className="card">
                <h3>🛞 Tire Strategy</h3>
                <p className="sidebar-value">{strategy.parameters.tire_strategy}</p>
              </div>
            )}

            {/* Fuel Strategy per Lap */}
            {strategy.parameters.fuel_strategy && 
             Object.keys(strategy.parameters.fuel_strategy).length > 0 && (
              <div className="card">
                <h3>⛽ Fuel Strategy by Lap</h3>
                <div className="fuel-strategy-list">
                  {Object.entries(strategy.parameters.fuel_strategy).map(([lap, fuel]) => (
                    <div key={lap} className="fuel-strategy-item">
                      <span className="fuel-lap">Lap {lap}</span>
                      <span className="fuel-amount">{fuel} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}