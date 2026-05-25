import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function CourseDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    fetchCourse()
    fetchSlots()
  }, [])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/courses/${id}`)
      const data = await response.json()
      setCourse(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchSlots = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/timeslots/course/${id}`)
      const data = await response.json()
      setSlots(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBook = async (slotId) => {
    const nextDate = getNextDate(slotId)
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${slotId}?date=${nextDate}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      const data = await response.json()
      if (!response.ok) {
        setMessageType('danger')
        setMessage(data.message || 'Errore durante la prenotazione')
        return
      }
      setMessageType('success')
      setMessage('Prenotazione confermata! Controlla la tua email 📧')
      fetchSlots()
    } catch (err) {
      setMessageType('danger')
      setMessage('Errore di connessione al server')
    }
  }

  const getNextDate = (slotId) => {
    const slot = slots.find(s => s.id === slotId)
    if (!slot) return new Date().toISOString().split('T')[0]
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    const today = new Date()
    const todayIndex = today.getDay()
    const slotIndex = days.indexOf(slot.dayOfWeek)
    let diff = slotIndex - todayIndex
    if (diff <= 0) diff += 7
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + diff)
    return nextDate.toISOString().split('T')[0]
  }

  const translateDay = (day) => {
    const days = {
      MONDAY: 'Lunedì', TUESDAY: 'Martedì', WEDNESDAY: 'Mercoledì',
      THURSDAY: 'Giovedì', FRIDAY: 'Venerdì', SATURDAY: 'Sabato', SUNDAY: 'Domenica'
    }
    return days[day] || day
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
        onClick={() => navigate('/courses')}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #ff6b00',
          color: '#ff6b00',
          borderRadius: '8px'
        }}>
        ← Torna ai corsi
      </Button>

      {course && (
        <Card
          className="mb-4"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px'
          }}>
          <Card.Body>
            <h3 style={{ color: '#ffffff' }}>{course.name}</h3>
            <p style={{ color: '#aaaaaa' }}>{course.description}</p>
            <p style={{ color: '#aaaaaa' }}>
              👨‍🏫 <span style={{ color: '#ffffff' }}>{course.instructor}</span>
            </p>
            <p style={{ color: '#aaaaaa' }}>
              ⏱️ <span style={{ color: '#ffffff' }}>{course.durationMinutes} min</span>
            </p>
            <p style={{ color: '#aaaaaa' }}>
              🏷️ <span style={{ color: '#ffffff' }}>{course.category?.name}</span>
            </p>
          </Card.Body>
        </Card>
      )}

      {message && <Alert variant={messageType}>{message}</Alert>}

      <h5 className="mb-3" style={{ color: '#ffffff' }}>
        ⏰ Slot <span style={{ color: '#ff6b00' }}>disponibili</span>
      </h5>
      <Row>
        {slots.map(slot => (
          <Col key={slot.id} xs={12} md={6} lg={4} className="mb-3">
            <Card
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px'
              }}>
              <Card.Body>
                <h6 style={{ color: '#ff6b00', fontWeight: '600' }}>
                  {translateDay(slot.dayOfWeek)}
                </h6>
                <p className="mb-1" style={{ color: '#aaaaaa' }}>
                  🕐 <span style={{ color: '#ffffff' }}>{slot.startTime} - {slot.endTime}</span>
                </p>
                <p className="mb-3" style={{ color: '#aaaaaa' }}>
                  🎟️ Posti:{' '}
                  <span style={{
                    color: slot.availableSlots === 0 ? '#dc3545' : '#28a745',
                    fontWeight: '600'
                  }}>
                    {slot.availableSlots}
                  </span>
                </p>
                <Button
                  className="w-100"
                  onClick={() => handleBook(slot.id)}
                  disabled={!token}
                  style={{
                    backgroundColor: slot.availableSlots === 0 ? 'transparent' : '#ff6b00',
                    border: slot.availableSlots === 0 ? '1px solid #ffc107' : 'none',
                    color: slot.availableSlots === 0 ? '#ffc107' : '#ffffff',
                    borderRadius: '8px'
                  }}>
                  {slot.availableSlots === 0 ? "Lista d'attesa" : 'Prenota'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default CourseDetail