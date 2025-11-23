import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { strategyService, teamService, driverService, grandPrixService } from '../services/api';
import type { User, Team, Driver, GrandPrix, PitStop, CreateStrategyData } from '../types';

interface CreateStrategyProps {
  user: User | null;
}

export default function CreateStrategy({ user }: CreateStrategyProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  // Form data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [grandPrixId, setGrandPrixId] = useState<number | ''>('');
  const [driverId, setDriverId] = useState<number | ''>('');
  const [teamId, setTeamId] = useState<number | ''>('');
  const [pitStops, setPitStops] = useState<PitStop[]>([]);
  const [fuelLoad, setFuelLoad] = useState('');
  const [fuelMode, setFuelMode] = useState('');
  const [tireStrategy, setTireStrategy] = useState('');

  // Dropdown data
  const [teams, setTeams] = useState<Team[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [grandPrix, setGrandPrix] = useState<GrandPrix[]>([]);

  useEffect(() => {
    document.title = 'Create Strategy | F1 Strategies';
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [teamsData, driversData, grandPrixData] = await Promise.all([
        teamService.getAll(),
        driverService.getAll(),
        grandPrixService.getAll(),
      ]);
      setTeams(teamsData);
      setDrivers(driversData);
      setGrandPrix(grandPrixData);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error('Error loading data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const addPitStop = () => {
    setPitStops([...pitStops, { lap: 0, tire: '', fuel: '' }]);
  };

  const removePitStop = (index: number) => {
    setPitStops(pitStops.filter((_, i) => i !== index));
  };

  const updatePitStop = (index: number, field: keyof PitStop, value: string | number) => {
    const updated = [...pitStops];
    updated[index] = { ...updated[index], [field]: value };
    setPitStops(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grandPrixId || !driverId || !teamId) {
      setError('Please fill in all required fields.');
      return;
    }

    if (pitStops.length === 0) {
      setError('Please add at least one pit stop.');
      return;
    }

    if (fuelLoad && (Number(fuelLoad) < 0 || Number(fuelLoad) > 110)) {
      setError('Fuel load must be between 0 and 110 kg.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const strategyData: CreateStrategyData = {
        name,
        description,
        grand_prix_id: Number(grandPrixId),
        driver_id: Number(driverId),
        team_id: Number(teamId),
        parameters: {
          pit_stops: pitStops,
          ...(fuelLoad && { fuel_load: Number(fuelLoad) }),
          ...(fuelMode && { fuel_mode: fuelMode }),
          ...(tireStrategy && { tire_strategy: tireStrategy }),
        },
      };

      const created = await strategyService.create(strategyData);
      alert('Strategy created successfully!');
      navigate(`/strategies/${created.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create strategy.');
      console.error('Error creating strategy:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (dataLoading) {
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
      <div className="container">
        <div className="form-page">
          <div className="form-header">
            <h1>Create New Strategy 🏁</h1>
            <p style={{ color: 'var(--f1-light-gray)', marginTop: '0.5rem' }}>
              Design your winning race strategy
            </p>
          </div>

          {error && (
            <div className="alert alert--error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="strategy-form card">
            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Strategy Name *
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Aggressive 2-Stop Strategy"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your strategy..."
                  required
                  disabled={loading}
                  rows={4}
                />
              </div>
            </div>

            {/* Race Details */}
            <div className="form-section">
              <h2>Race Details</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="grandPrix" className="form-label">
                    Grand Prix *
                  </label>
                  <select
                    id="grandPrix"
                    className="form-select"
                    value={grandPrixId}
                    onChange={(e) => setGrandPrixId(Number(e.target.value))}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Grand Prix</option>
                    {grandPrix.map((gp) => (
                      <option key={gp.id} value={gp.id}>
                        {gp.name} - {gp.year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="team" className="form-label">
                    Team *
                  </label>
                  <select
                    id="team"
                    className="form-select"
                    value={teamId}
                    onChange={(e) => setTeamId(Number(e.target.value))}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="driver" className="form-label">
                    Driver *
                  </label>
                  <select
                    id="driver"
                    className="form-select"
                    value={driverId}
                    onChange={(e) => setDriverId(Number(e.target.value))}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        #{driver.name} {driver.surname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pit Stops */}
            <div className="form-section">
              <div className="form-section-header">
                <h2>Pit Stops *</h2>
                <button
                  type="button"
                  onClick={addPitStop}
                  className="btn btn--secondary"
                  disabled={loading}
                >
                  + Add Pit Stop
                </button>
              </div>

              {pitStops.length === 0 && (
                <div className="alert alert--info" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <span>ℹ️</span>
                  <span>At least one pit stop is required. Click "Add Pit Stop" to get started.</span>
                </div>
              )}

              {pitStops.length === 0 ? (
                <p style={{ color: 'var(--f1-light-gray)', textAlign: 'center', padding: '2rem' }}>
                  No pit stops added yet.
                </p>
              ) : (
                <div className="pit-stops-form">
                  {pitStops.map((stop, index) => (
                    <div key={index} className="pit-stop-form-card card">
                      <div className="pit-stop-form-header">
                        <h3>Pit Stop #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removePitStop(index)}
                          className="btn-icon"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Lap *</label>
                          <input
                            type="number"
                            className="form-input"
                            value={stop.lap}
                            onChange={(e) => updatePitStop(index, 'lap', Number(e.target.value))}
                            min="1"
                            required
                            disabled={loading}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Tire Compound *</label>
                          <select
                            className="form-select"
                            value={stop.tire}
                            onChange={(e) => updatePitStop(index, 'tire', e.target.value)}
                            required
                            disabled={loading}
                          >
                            <option value="">Select Tire</option>
                            <option value="Soft">Soft</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Wet">Wet</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Fuel (kg)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={stop.fuel || ''}
                            onChange={(e) => updatePitStop(index, 'fuel', e.target.value)}
                            placeholder="Optional"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Parameters */}
            <div className="form-section">
              <h2>Additional Parameters (Optional)</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fuelLoad" className="form-label">
                    Starting Fuel Load (kg) <span style={{ color: 'var(--f1-light-gray)', fontSize: '0.85rem' }}>(0-110)</span>
                  </label>
                  <input
                    id="fuelLoad"
                    type="number"
                    className="form-input"
                    value={fuelLoad}
                    onChange={(e) => setFuelLoad(e.target.value)}
                    placeholder="e.g., 110"
                    disabled={loading}
                    min="0"
                    max="110"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fuelMode" className="form-label">
                    Fuel Mode
                  </label>
                  <select
                    id="fuelMode"
                    className="form-select"
                    value={fuelMode}
                    onChange={(e) => setFuelMode(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select Mode</option>
                    <option value="Lean">Lean</option>
                    <option value="Standard">Standard</option>
                    <option value="Rich">Rich</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tireStrategy" className="form-label">
                    Overall Tire Strategy
                  </label>
                  <input
                    id="tireStrategy"
                    type="text"
                    className="form-input"
                    value={tireStrategy}
                    onChange={(e) => setTireStrategy(e.target.value)}
                    placeholder="e.g., Soft-Medium-Hard"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/strategies')}
                className="btn btn--secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Strategy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}