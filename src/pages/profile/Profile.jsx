import { useState, useEffect } from 'react'
import { Container, Card, Form, Button, Alert, Spinner, Image } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { token } = useAuth()
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
    const form = new FormData()
    form.append('file', file)
    try {
      const response = await fetch('http://localhost:8080/api/users/me/photo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
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

  const inputStyle = {
    backgroundColor: '#222222',
    border: '1px solid #333',
    color: '#ffffff',
    borderRadius: '8px'
  }

  if (loading) return (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" style={{ color: '#ff6b00' }} />
    </Container>
  )

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <Button
        className="mb-3"
        onClick={() => navigate('/dashboard')}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #ff6b00',
          color: '#ff6b00',
          borderRadius: '8px'
        }}>
        ← Torna alla dashboard
      </Button>

      <h3 className="mb-4" style={{ color: '#ffffff' }}>
        👤 Il mio <span style={{ color: '#ff6b00' }}>profilo</span>
      </h3>

      {message && <Alert variant={messageType}>{message}</Alert>}

      <Card
        className="mb-4"
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '12px'
        }}>
        <Card.Body className="text-center">
          {profile?.profileImageUrl ? (
            <Image
              src={profile.profileImageUrl}
              roundedCircle
              width={100}
              height={100}
              className="mb-3"
              style={{ objectFit: 'cover', border: '3px solid #ff6b00' }}
            />
          ) : (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: 100,
                height: 100,
                backgroundColor: '#ff6b00'
              }}>
              <span className="text-white fs-3 fw-bold">
                {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
              </span>
            </div>
          )}
          <h5 style={{ color: '#ffffff' }}>{profile?.firstName} {profile?.lastName}</h5>
          <p style={{ color: '#aaaaaa' }} className="mb-1">{profile?.email}</p>
          <p className="mb-3">
            <span
              className="badge"
              style={{ backgroundColor: '#ff6b00', color: '#ffffff' }}>
              {profile?.role}
            </span>
          </p>
          <label
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #ff6b00',
              color: '#ff6b00',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>
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

      <Card
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '12px'
        }}>
        <Card.Body>
          <h5 className="mb-3" style={{ color: '#ffffff' }}>Modifica dati</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Nome</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#aaaaaa' }}>Telefono</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#aaaaaa' }}>Data di nascita</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={inputStyle}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-accent"
              disabled={saving}
              style={{ borderRadius: '8px', padding: '10px' }}>
              {saving ? 'Salvataggio...' : 'Salva modifiche'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Profile