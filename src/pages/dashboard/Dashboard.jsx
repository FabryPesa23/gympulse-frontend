import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'

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
      </Container>
    </>
  )
}

export default Dashboard