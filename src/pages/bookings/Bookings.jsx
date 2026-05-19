import { useState, useEffect } from 'react'
import { Container, Card, Badge, Button, Spinner, Alert, Row, Col } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/bookings/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        setMessageType('danger')
        setMessage('Errore durante la cancellazione')
        return
      }

      setMessageType('success')
      setMessage('Prenotazione cancellata con successo')
      fetchBookings()
    } catch (err) {
      setMessageType('danger')
      setMessage('Errore di connessione al server')
    }
  }

  const getStatusColor = (status) => {
    if (status === 'CONFIRMED') return 'success'
    if (status === 'CANCELLED') return 'danger'
    return 'secondary'
  }

  const getStatusLabel = (status) => {
    if (status === 'CONFIRMED') return 'Confermata'
    if (status === 'CANCELLED') return 'Cancellata'
    return status
  }

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" />
    </Container>
  )

  return (
    <Container className="mt-4">
      <Button variant="outline-dark" className="mb-3" onClick={() => navigate('/dashboard')}>
        ← Torna alla dashboard
      </Button>

      <h3 className="mb-4">🎟️ Le mie prenotazioni</h3>

      {message && <Alert variant={messageType}>{message}</Alert>}

      {bookings.length === 0 ? (
        <Card className="text-center p-4 shadow-sm">
          <p className="text-muted mb-3">Non hai ancora nessuna prenotazione</p>
          <Button variant="dark" onClick={() => navigate('/courses')}>
            Scopri i corsi
          </Button>
        </Card>
      ) : (
        <Row>
          {bookings.map(booking => (
            <Col key={booking.id} md={6} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5>{booking.courseName}</h5>
                    <Badge bg={getStatusColor(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </div>
                  <p className="mb-1">👨‍🏫 {booking.instructor}</p>
                  <p className="mb-1">📅 {booking.date}</p>
                  <p className="mb-3">🕐 {booking.startTime} - {booking.endTime}</p>
                  {booking.status === 'CONFIRMED' && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancella prenotazione
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Bookings