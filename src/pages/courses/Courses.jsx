import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'

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

  const handleDelete = async (courseId) => {
    try {
      await fetch(`http://localhost:8080/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setCourses(courses.filter(c => c.id !== courseId))
      setConfirmDeleteId(null)
    } catch (err) {
      console.error(err)
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: '#ffffff' }}>
          📅 Corsi <span style={{ color: '#ff6b00' }}>disponibili</span>
        </h3>
        {isAdmin && (
          <Button
            className="btn-accent"
            style={{ borderRadius: '8px' }}
            onClick={() => navigate('/courses/new')}>
            + Aggiungi corso
          </Button>
        )}
      </div>

      <Row>
        {courses.map(course => (
          <Col key={course.id} xs={12} md={6} lg={4} className="mb-4">
            <Card
              className="h-100"
              style={{
                backgroundColor: '#1a1a1a',
                border: confirmDeleteId === course.id ? '1px solid #dc3545' : '1px solid #333',
                borderRadius: '12px',
                transition: 'border 0.2s ease'
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
                    🎟️ Capacità:{' '}
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      {course.maxCapacity} posti
                    </span>
                  </p>

                  {confirmDeleteId === course.id ? (
                    <div
                      className="p-3 rounded mb-2"
                      style={{ backgroundColor: '#2a0a0a', border: '1px solid #dc3545' }}>
                      <p style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: '10px' }}>
                        ⚠️ Sei sicuro di voler eliminare <strong>{course.name}</strong>?
                      </p>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          className="w-50"
                          onClick={() => handleDelete(course.id)}
                          style={{
                            backgroundColor: '#dc3545',
                            border: 'none',
                            borderRadius: '8px'
                          }}>
                          Sì, elimina
                        </Button>
                        <Button
                          size="sm"
                          className="w-50"
                          onClick={() => setConfirmDeleteId(null)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #555',
                            color: '#aaaaaa',
                            borderRadius: '8px'
                          }}>
                          Annulla
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button
                        className="w-100 btn-accent mb-2"
                        style={{ borderRadius: '8px' }}
                        onClick={() => navigate(`/courses/${course.id}`)}>
                        Vedi slot disponibili
                      </Button>
                      {isAdmin && (
                        <div className="d-flex gap-2">
                          <Button
                            className="w-50"
                            size="sm"
                            onClick={() => navigate(`/courses/${course.id}/edit`)}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #ffc107',
                              color: '#ffc107',
                              borderRadius: '8px'
                            }}>
                            ✏️ Modifica
                          </Button>
                          <Button
                            className="w-50"
                            size="sm"
                            onClick={() => setConfirmDeleteId(course.id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid #dc3545',
                              color: '#dc3545',
                              borderRadius: '8px'
                            }}>
                            🗑️ Elimina
                          </Button>
                        </div>
                      )}
                    </>
                  )}
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