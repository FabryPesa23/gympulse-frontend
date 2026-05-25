import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Container className="mt-4">
      <h3>Benvenuto nella tua Dashboard 👋</h3>
      <p className="text-muted">Cosa vuoi fare oggi?</p>

      <Row className="mt-4">
        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h1>📅</h1>
              <Card.Title>Corsi</Card.Title>
              <Card.Text>Scopri i corsi disponibili e prenota il tuo posto</Card.Text>
              <Button variant="dark" onClick={() => navigate('/courses')}>
                Vedi corsi
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h1>🎟️</h1>
              <Card.Title>Le mie prenotazioni</Card.Title>
              <Card.Text>Gestisci le tue prenotazioni attive</Card.Text>
              <Button variant="dark" onClick={() => navigate('/bookings')}>
                Vedi prenotazioni
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h1>👥</h1>
              <Card.Title>Affollamento</Card.Title>
              <Card.Text>Controlla quanto è piena la palestra</Card.Text>
              <Button variant="dark" onClick={() => navigate('/zones')}>
                Vedi zone
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <h1>👤</h1>
              <Card.Title>Il mio profilo</Card.Title>
              <Card.Text>Gestisci i tuoi dati personali</Card.Text>
              <Button variant="dark" onClick={() => navigate('/profile')}>
                Vedi profilo
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard