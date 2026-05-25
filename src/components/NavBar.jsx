import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'fw-bold' : ''

  if (!user) return null

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        🏋️ GymPulse
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar" />
      <Navbar.Collapse id="main-navbar">
        <Nav className="me-auto">
          <Nav.Link
            className={isActive('/dashboard')}
            onClick={() => navigate('/dashboard')}>
            Dashboard
          </Nav.Link>
          <Nav.Link
            className={isActive('/courses')}
            onClick={() => navigate('/courses')}>
            Corsi
          </Nav.Link>
          <Nav.Link
            className={isActive('/bookings')}
            onClick={() => navigate('/bookings')}>
            Prenotazioni
          </Nav.Link>
          <Nav.Link
            className={isActive('/zones')}
            onClick={() => navigate('/zones')}>
            Affollamento
          </Nav.Link>
        </Nav>
        <Nav className="d-flex align-items-center gap-3">
          <Nav.Link
            className={isActive('/profile')}
            onClick={() => navigate('/profile')}>
            👤 {user?.firstName}
          </Nav.Link>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Esci
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBar