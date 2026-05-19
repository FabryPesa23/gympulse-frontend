import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-4">
        <Navbar.Brand>🏋️ GymPulse</Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center gap-3">
          <span className="text-white">Ciao, {user?.firstName}!</span>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Esci
          </Button>
        </Nav>
      </Navbar>

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
        </Row>
      </Container>
    </>
  )
}

export default Dashboard