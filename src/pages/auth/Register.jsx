import { useState } from 'react'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Errore durante la registrazione')
        return
      }

      login(data.token, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      })

      navigate('/dashboard')
    } catch (err) {
      setError('Errore di connessione al server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <h2 className="text-center mb-4">🏋️ GymPulse</h2>
        <h5 className="text-center mb-4">Crea il tuo account</h5>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Inserisci nome"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Inserisci cognome"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Inserisci email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Minimo 6 caratteri"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefono (opzionale)</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Inserisci telefono"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </Button>
        </Form>

        <p className="text-center mt-3">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </Card>
    </Container>
  )
}

export default Register