import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, ProgressBar, Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Zones() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [reporting, setReporting] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [level, setLevel] = useState(50)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchZones()
    const interval = setInterval(fetchZones, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchZones = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/zones')
      const data = await response.json()
      setZones(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReport = async () => {
    if (!selectedZone) return
    try {
      await fetch('http://localhost:8080/api/zones/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ zoneId: selectedZone, level })
      })
      setReporting(false)
      setSelectedZone(null)
      fetchZones()
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusColor = (status) => {
    if (status === 'LOW') return 'success'
    if (status === 'MEDIUM') return 'warning'
    if (status === 'HIGH') return 'danger'
    return 'secondary'
  }

  const getStatusLabel = (status) => {
    if (status === 'LOW') return '🟢 Poco affollata'
    if (status === 'MEDIUM') return '🟡 Abbastanza affollata'
    if (status === 'HIGH') return '🔴 Molto affollata'
    return '⚪ Sconosciuto'
  }

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" style={{ color: '#ff6b00' }} />
    </Container>
  )

  return (
    <Container className="mt-4">
      <Button
        className="mb-3"
        onClick={() => navigate('/dashboard')}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #ff6b00',
          color: '#ff6b00',
          borderRadius: '8px'
        }}>
        ← Torna alla dashboard
      </Button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: '#ffffff' }}>
          👥 Affollamento <span style={{ color: '#ff6b00' }}>live</span>
        </h3>
        {token && (
          <Button
            onClick={() => setReporting(!reporting)}
            style={{
              backgroundColor: reporting ? 'transparent' : '#ff6b00',
              border: '1px solid #ff6b00',
              color: reporting ? '#ff6b00' : '#ffffff',
              borderRadius: '8px'
            }}>
            {reporting ? 'Annulla' : '📊 Segnala affollamento'}
          </Button>
        )}
      </div>

      {reporting && (
        <Card
          className="mb-4 p-3"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px'
          }}>
          <h6 style={{ color: '#ffffff' }}>Segnala l'affollamento di una zona</h6>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#aaaaaa' }}>Seleziona zona</label>
            <select
              className="form-select"
              value={selectedZone || ''}
              onChange={(e) => setSelectedZone(Number(e.target.value))}
              style={{
                backgroundColor: '#222222',
                border: '1px solid #333',
                color: '#ffffff',
                borderRadius: '8px'
              }}>
              <option value="">-- Scegli zona --</option>
              {zones.map(zone => (
                <option key={zone.id} value={zone.id}>{zone.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#aaaaaa' }}>
              Livello affollamento: <span style={{ color: '#ff6b00' }}>{level}%</span>
            </label>
            <input
              type="range"
              className="form-range"
              min="0"
              max="100"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
          </div>
          <Button
            className="btn-accent"
            style={{ borderRadius: '8px' }}
            onClick={handleReport}
            disabled={!selectedZone}>
            Invia segnalazione
          </Button>
        </Card>
      )}

      <Row>
        {zones.map(zone => (
          <Col key={zone.id} xs={12} md={6} className="mb-3">
            <Card
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px'
              }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ color: '#ffffff', fontWeight: '600' }}>{zone.name}</h5>
                  <span style={{ fontSize: '0.9rem' }}>{getStatusLabel(zone.occupancyStatus)}</span>
                </div>
                <ProgressBar
                  now={zone.currentLevel || 0}
                  variant={getStatusColor(zone.occupancyStatus)}
                  className="mb-2"
                  style={{ backgroundColor: '#333', borderRadius: '8px' }}
                />
                <small style={{ color: '#aaaaaa' }}>
                  Occupazione: <span style={{ color: '#ffffff' }}>{zone.currentLevel || 0}%</span>
                  {zone.maxCapacity && (
                    <span> — Capacità massima: <span style={{ color: '#ffffff' }}>{zone.maxCapacity} persone</span></span>
                  )}
                </small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <p className="text-center mt-3" style={{ color: '#aaaaaa' }}>
        <small>🔄 Aggiornamento automatico ogni 30 secondi</small>
      </p>
    </Container>
  )
}

export default Zones