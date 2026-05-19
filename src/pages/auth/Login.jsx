import { useState } from 'react'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Credenziali non valide')
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
        <h5 className="text-center mb-4">Accedi al tuo account</h5>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Inserisci password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </Form>

        <p className="text-center mt-3">
          Non hai un account? <Link to="/register">Registrati</Link>
        </p>
      </Card>
    </Container>
  )
}

export default Login