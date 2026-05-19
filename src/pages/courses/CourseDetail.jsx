import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap'
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
    const today = new Date()
    const nextDate = getNextDate(slotId)

    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${slotId}?date=${nextDate}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
      <Spinner animation="border" />
    </Container>
  )

  return (
    <Container className="mt-4">
      <Button variant="outline-dark" className="mb-3" onClick={() => navigate('/courses')}>
        ← Torna ai corsi
      </Button>

      {course && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h3>{course.name}</h3>
            <p className="text-muted">{course.description}</p>
            <p><strong>Istruttore:</strong> {course.instructor}</p>
            <p><strong>Durata:</strong> {course.durationMinutes} min</p>
            <p><strong>Categoria:</strong> {course.category?.name}</p>
          </Card.Body>
        </Card>
      )}

      {message && <Alert variant={messageType}>{message}</Alert>}

      <h5 className="mb-3">⏰ Slot disponibili</h5>
      <Row>
        {slots.map(slot => (
          <Col key={slot.id} md={4} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <h6>{translateDay(slot.dayOfWeek)}</h6>
                <p className="mb-1">🕐 {slot.startTime} - {slot.endTime}</p>
                <p className="mb-3">
                  <strong>Posti:</strong>{' '}
                  <span className={slot.availableSlots === 0 ? 'text-danger' : 'text-success'}>
                    {slot.availableSlots}
                  </span>
                </p>
                <Button
                  variant={slot.availableSlots === 0 ? 'outline-warning' : 'dark'}
                  className="w-100"
                  onClick={() => handleBook(slot.id)}
                  disabled={!token}
                >
                  {slot.availableSlots === 0 ? 'Lista d\'attesa' : 'Prenota'}
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