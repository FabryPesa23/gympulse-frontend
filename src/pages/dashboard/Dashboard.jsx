import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Container className="mt-4">
      <h3 style={{ color: '#ffffff' }}>
        Benvenuto, <span style={{ color: '#ff6b00' }}>{user?.firstName}</span> 👋
      </h3>
      <p style={{ color: '#aaaaaa' }}>Cosa vuoi fare oggi?</p>

      <Row className="mt-4">
        {[
          { emoji: '📅', title: 'Corsi', text: 'Scopri i corsi disponibili e prenota il tuo posto', path: '/courses', label: 'Vedi corsi' },
          { emoji: '🎟️', title: 'Le mie prenotazioni', text: 'Gestisci le tue prenotazioni attive', path: '/bookings', label: 'Vedi prenotazioni' },
          { emoji: '👥', title: 'Affollamento', text: 'Controlla quanto è piena la palestra', path: '/zones', label: 'Vedi zone' },
          { emoji: '👤', title: 'Il mio profilo', text: 'Gestisci i tuoi dati personali', path: '/profile', label: 'Vedi profilo' },
        ].map(({ emoji, title, text, path, label }) => (
          <Col key={path} xs={12} md={6} lg={4} className="mb-3">
            <Card className="card-dark text-center h-100" style={{ borderRadius: '12px' }}>
              <Card.Body className="d-flex flex-column align-items-center justify-content-between p-4">
                <div>
                  <h1>{emoji}</h1>
                  <Card.Title style={{ color: '#ffffff', fontWeight: '600' }}>{title}</Card.Title>
                  <Card.Text style={{ color: '#aaaaaa' }}>{text}</Card.Text>
                </div>
                <Button className="btn-accent w-100 mt-3" onClick={() => navigate(path)}>
                  {label}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Dashboard