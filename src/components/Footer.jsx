import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6'

function Footer() {
  const navigate = useNavigate()

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Corsi', path: '/courses' },
    { label: 'Prenotazioni', path: '/bookings' },
    { label: 'Affollamento', path: '/zones' },
    { label: 'Profilo', path: '/profile' },
  ]

  const socialLinks = [
    { label: 'Facebook', icon: FaFacebook, url: 'https://facebook.com' },
    { label: 'Instagram', icon: FaInstagram, url: 'https://instagram.com' },
    { label: 'Twitter / X', icon: FaXTwitter, url: 'https://x.com' },
    { label: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com' },
    { label: 'YouTube', icon: FaYoutube, url: 'https://youtube.com' },
  ]

  const linkStyle = {
    color: '#aaaaaa',
    fontSize: '0.85rem',
    marginBottom: '6px',
    cursor: 'pointer',
    display: 'block',
    transition: 'color 0.2s ease',
  }

  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      borderTop: '1px solid #333',
      marginTop: '60px',
      padding: '40px 0 20px'
    }}>
      <Container>
        <Row className="mb-4">
          <Col xs={12} md={4} className="mb-4">
            <img
              src={logo}
              alt="GymPulse"
              height="45"
              className="mb-3"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            />
            <p style={{ color: '#aaaaaa', fontSize: '0.9rem' }}>
              La piattaforma smart per gestire la tua esperienza in palestra.
              Prenota corsi, monitora l'affollamento e molto altro.
            </p>
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <h6 style={{ color: '#ff6b00', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px' }}>
              Navigazione
            </h6>
            {navLinks.map((item, index) => (
              <p
                key={index}
                style={linkStyle}
                onClick={() => navigate(item.path)}
                onMouseEnter={e => e.target.style.color = '#ff6b00'}
                onMouseLeave={e => e.target.style.color = '#aaaaaa'}
              >
                {item.label}
              </p>
            ))}
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <h6 style={{ color: '#ff6b00', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px' }}>
              Social
            </h6>
            <div className="d-flex flex-column gap-2">
              {socialLinks.map((item, index) => {
                const Icon = item.icon
                return (
                  <span
                    key={index}
                    style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => window.open(item.url, '_blank')}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#ff6b00'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#aaaaaa'
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </span>
                )
              })}
            </div>
          </Col>

          <Col xs={12} md={4} className="mb-4">
            <h6 style={{ color: '#ff6b00', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px' }}>
              Contatti
            </h6>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              Via Portuense 23, Roma
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              +39 333 1234567
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              info@gympulse.it
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              Lun-Ven 6:00 - 22:00
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              Sab-Dom 8:00 - 20:00
            </p>
          </Col>
        </Row>

        <hr style={{ borderColor: '#333' }} />

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <p style={{ color: '#aaaaaa', fontSize: '0.8rem', marginBottom: 0 }}>
            2026 GymPulse. Tutti i diritti riservati.
          </p>
          <p style={{ color: '#aaaaaa', fontSize: '0.8rem', marginBottom: 0 }}>
            Sviluppato da <span style={{ color: '#ff6b00' }}>Fabrizio Pesaresi</span>
          </p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer