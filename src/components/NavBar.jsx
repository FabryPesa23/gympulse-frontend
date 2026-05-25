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

  const isActive = (path) => location.pathname === path

  if (!user) return null

  return (
    <Navbar expand="lg" className="px-3 navbar-dark-custom">
      <Navbar.Brand
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer', color: '#ff6b00', fontWeight: 'bold', fontSize: '1.3rem' }}>
        🏋️ GymPulse
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar" style={{ borderColor: '#333' }} />
      <Navbar.Collapse id="main-navbar">
        <Nav className="me-auto">
          {[
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/courses', label: 'Corsi' },
            { path: '/bookings', label: 'Prenotazioni' },
            { path: '/zones', label: 'Affollamento' },
          ].map(({ path, label }) => (
            <Nav.Link
              key={path}
              onClick={() => navigate(path)}
              style={{
                color: isActive(path) ? '#ff6b00' : '#aaaaaa',
                fontWeight: isActive(path) ? '600' : '400',
                borderBottom: isActive(path) ? '2px solid #ff6b00' : 'none'
              }}>
              {label}
            </Nav.Link>
          ))}
        </Nav>
        <Nav className="d-flex align-items-center gap-3">
          <Nav.Link
            onClick={() => navigate('/profile')}
            style={{ color: isActive('/profile') ? '#ff6b00' : '#aaaaaa' }}>
            👤 {user?.firstName}
          </Nav.Link>
          <Button
            size="sm"
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #ff6b00',
              color: '#ff6b00'
            }}>
            Esci
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBar