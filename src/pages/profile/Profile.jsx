import { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Spinner, Image } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { token, user, login } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setProfile(data)
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        dateOfBirth: data.dateOfBirth || ''
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setMessageType('danger')
        setMessage('Errore durante il salvataggio')
        return
      }

      setProfile(data)
      setMessageType('success')
      setMessage('Profilo aggiornato con successo!')
    } catch (err) {
      setMessageType('danger')
      setMessage('Errore di connessione al server')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8080/api/users/me/photo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        setMessageType('danger')
        setMessage('Errore durante il caricamento della foto')
        return
      }

      setProfile(data)
      setMessageType('success')
      setMessage('Foto profilo aggiornata!')
    } catch (err) {
      setMessageType('danger')
      setMessage('Errore di connessione al server')
    }
  }

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" />
    </Container>
  )

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <Button variant="outline-dark" className="mb-3" onClick={() => navigate('/dashboard')}>
        ← Torna alla dashboard
      </Button>

      <h3 className="mb-4">👤 Il mio profilo</h3>

      {message && <Alert variant={messageType}>{message}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Body className="text-center">
          {profile?.profileImageUrl ? (
            <Image
              src={profile.profileImageUrl}
              roundedCircle
              width={100}
              height={100}
              className="mb-3"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-dark d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 100, height: 100 }}
            >
              <span className="text-white fs-3">
                {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
              </span>
            </div>
          )}
          <h5>{profile?.firstName} {profile?.lastName}</h5>
          <p className="text-muted mb-1">{profile?.email}</p>
          <p className="text-muted mb-3">
            <span className="badge bg-dark">{profile?.role}</span>
          </p>
          <label className="btn btn-outline-dark btn-sm">
            📷 Cambia foto
            <input
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handlePhotoUpload}
            />
          </label>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Modifica dati</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data di nascita</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100" disabled={saving}>
              {saving ? 'Salvataggio...' : 'Salva modifiche'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Profile