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

  const inputStyle = {
    backgroundColor: '#222222',
    border: '1px solid #333',
    color: '#ffffff',
    borderRadius: '8px'
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <Card
        style={{
          width: '420px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '16px'
        }}
        className="p-4 shadow">

        <h2 className="text-center mb-2" style={{ color: '#ff6b00', fontWeight: 'bold' }}>
          🏋️ GymPulse
        </h2>
        <h5 className="text-center mb-4" style={{ color: '#aaaaaa', fontWeight: '400' }}>
          Crea il tuo account
        </h5>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#aaaaaa' }}>Nome</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Inserisci nome"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#aaaaaa' }}>Cognome</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Inserisci cognome"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#aaaaaa' }}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Inserisci email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#aaaaaa' }}>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Minimo 6 caratteri"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ color: '#aaaaaa' }}>Telefono (opzionale)</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Inserisci telefono"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 btn-accent"
            disabled={loading}
            style={{ borderRadius: '8px', padding: '10px' }}>
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </Button>
        </Form>

        <p className="text-center mt-3" style={{ color: '#aaaaaa' }}>
          Hai già un account?{' '}
          <Link to="/login" style={{ color: '#ff6b00', textDecoration: 'none' }}>
            Accedi
          </Link>
        </p>
      </Card>
    </Container>
  )
}

export default Register