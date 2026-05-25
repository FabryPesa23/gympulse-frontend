import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/courses')
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      setError('Errore nel caricamento dei corsi')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'BEGINNER') return 'success'
    if (difficulty === 'INTERMEDIATE') return 'warning'
    if (difficulty === 'ADVANCED') return 'danger'
    return 'secondary'
  }

  const getDifficultyLabel = (difficulty) => {
    if (difficulty === 'BEGINNER') return 'Principiante'
    if (difficulty === 'INTERMEDIATE') return 'Intermedio'
    if (difficulty === 'ADVANCED') return 'Avanzato'
    return difficulty
  }

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" style={{ color: '#ff6b00' }} />
    </Container>
  )

  if (error) return (
    <Container className="mt-4">
      <p className="text-danger">{error}</p>
    </Container>
  )

  return (
    <Container className="mt-4">
      <h3 className="mb-4" style={{ color: '#ffffff' }}>
        📅 Corsi <span style={{ color: '#ff6b00' }}>disponibili</span>
      </h3>
      <Row>
        {courses.map(course => (
          <Col key={course.id} xs={12} md={6} lg={4} className="mb-4">
            <Card
              className="h-100"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px'
              }}>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title style={{ color: '#ffffff', fontWeight: '600' }}>
                    {course.name}
                  </Card.Title>
                  <Badge bg={getDifficultyColor(course.difficulty)}>
                    {getDifficultyLabel(course.difficulty)}
                  </Badge>
                </div>
                <Card.Text style={{ color: '#aaaaaa', fontSize: '0.9rem' }}>
                  {course.description}
                </Card.Text>
                <div className="mt-auto">
                  <p className="mb-1" style={{ color: '#aaaaaa' }}>
                    👨‍🏫 <span style={{ color: '#ffffff' }}>{course.instructor}</span>
                  </p>
                  <p className="mb-1" style={{ color: '#aaaaaa' }}>
                    ⏱️ <span style={{ color: '#ffffff' }}>{course.durationMinutes} min</span>
                  </p>
                  <p className="mb-1" style={{ color: '#aaaaaa' }}>
                    🏷️ <span style={{ color: '#ffffff' }}>{course.category?.name}</span>
                  </p>
                  <p className="mb-3" style={{ color: '#aaaaaa' }}>
                    🎟️ Posti:{' '}
                    <span style={{ color: course.availableSlots === 0 ? '#dc3545' : '#28a745', fontWeight: '600' }}>
                      {course.availableSlots}
                    </span>
                  </p>
                  <Button
                    className="w-100 btn-accent"
                    style={{ borderRadius: '8px' }}
                    onClick={() => navigate(`/courses/${course.id}`)}>
                    Vedi slot disponibili
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Courses