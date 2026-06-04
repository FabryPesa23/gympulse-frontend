import { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'

function CourseForm() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: '',
    maxCapacity: '',
    durationMinutes: '',
    difficulty: 'BEGINNER',
    imageUrl: '',
    categoryId: ''
  })

  useEffect(() => {
    fetchCategories()
    if (isEdit) fetchCourse()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/courses/${id}`)
      const data = await response.json()
      setFormData({
        name: data.name || '',
        description: data.description || '',
        instructor: data.instructor || '',
        maxCapacity: data.maxCapacity || '',
        durationMinutes: data.durationMinutes || '',
        difficulty: data.difficulty || 'BEGINNER',
        imageUrl: data.imageUrl || '',
        categoryId: data.category?.id || ''
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const url = isEdit
      ? `http://localhost:8080/api/courses/${id}`
      : 'http://localhost:8080/api/courses'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          maxCapacity: Number(formData.maxCapacity),
          durationMinutes: Number(formData.durationMinutes),
          categoryId: Number(formData.categoryId)
        })
      })

      if (!response.ok) {
        setMessageType('danger')
        setMessage('Errore durante il salvataggio')
        return
      }

      navigate('/courses')
    } catch (err) {
      setMessageType('danger')
      setMessage('Errore di connessione al server')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    backgroundColor: '#222222',
    border: '1px solid #333',
    color: '#ffffff',
    borderRadius: '8px'
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
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

      <h3 className="mb-4" style={{ color: '#ffffff' }}>
        {isEdit ? '✏️ Modifica' : '➕ Nuovo'}{' '}
        <span style={{ color: '#ff6b00' }}>corso</span>
      </h3>

      {message && <Alert variant={messageType}>{message}</Alert>}

      <Card style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '12px'
      }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Nome corso</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Istruttore</Form.Label>
              <Form.Control
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Categoria</Form.Label>
              <Form.Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                style={inputStyle}>
                <option value="">-- Seleziona categoria --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Difficoltà</Form.Label>
              <Form.Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                style={inputStyle}>
                <option value="BEGINNER">Principiante</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzato</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Capacità massima</Form.Label>
              <Form.Control
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Durata (minuti)</Form.Label>
              <Form.Control
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#aaaaaa' }}>URL immagine (opzionale)</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                style={inputStyle}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-accent"
              disabled={loading}
              style={{ borderRadius: '8px', padding: '10px' }}>
              {loading ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : 'Crea corso'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CourseForm