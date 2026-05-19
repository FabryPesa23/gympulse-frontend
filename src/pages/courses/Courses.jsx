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

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" />
    </Container>
  )

  if (error) return (
    <Container className="mt-4">
      <p className="text-danger">{error}</p>
    </Container>
  )

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📅 Corsi disponibili</h3>
      <Row>
        {courses.map(course => (
          <Col key={course.id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title>{course.name}</Card.Title>
                  <Badge bg={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>
                <Card.Text className="text-muted">{course.description}</Card.Text>
                <p className="mb-1"><strong>Istruttore:</strong> {course.instructor}</p>
                <p className="mb-1"><strong>Durata:</strong> {course.durationMinutes} min</p>
                <p className="mb-1"><strong>Categoria:</strong> {course.category?.name}</p>
                <p className="mb-3">
                  <strong>Posti disponibili:</strong>{' '}
                  <span className={course.availableSlots === 0 ? 'text-danger' : 'text-success'}>
                    {course.availableSlots}
                  </span>
                </p>
                <Button
                  variant="dark"
                  className="w-100"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  Vedi slot disponibili
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Courses