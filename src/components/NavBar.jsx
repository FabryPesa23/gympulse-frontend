import { Navbar, Nav, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import logo from '../assets/logo.svg'

function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY
      const maxScroll = 150
      const newOpacity = Math.min(scroll / maxScroll, 1)
      setOpacity(newOpacity)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  if (!user) return null

  return (
    <Navbar
      expand="lg"
      className="px-4"
      sticky="top"
      style={{
        minHeight: '70px',
        backgroundColor: `rgba(26, 26, 26, ${opacity})`,
        borderBottom: `1px solid rgba(51, 51, 51, ${opacity})`,
        backdropFilter: `blur(${opacity * 10}px)`,
      }}>
      <Navbar.Brand
        onClick={() => navigate('/dashboard')}
        style={{ cursor: 'pointer' }}>
        <img src={logo} alt="GymPulse" height="55" />
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
                color: isActive(path) ? '#ff6b00' : '#ffffff',
                fontWeight: isActive(path) ? '600' : '400',
                borderBottom: isActive(path) ? '2px solid #ff6b00' : '2px solid transparent',
              }}>
              {label}
            </Nav.Link>
          ))}
        </Nav>
        <Nav className="d-flex align-items-center gap-3">
          <Nav.Link
            onClick={() => navigate('/profile')}
            style={{ color: isActive('/profile') ? '#ff6b00' : '#ffffff' }}>
            👤 {user?.firstName}
          </Nav.Link>
          <Button
            size="sm"
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #ff6b00',
              color: '#ff6b00',
              borderRadius: '8px'
            }}>
            Esci
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBar