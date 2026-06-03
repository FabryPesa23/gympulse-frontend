import { Container, Row, Col } from 'react-bootstrap'
import logo from '../assets/logo.svg'

function Footer() {
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
            <img src={logo} alt="GymPulse" height="45" className="mb-3" />
            <p style={{ color: '#aaaaaa', fontSize: '0.9rem' }}>
              La piattaforma smart per gestire la tua esperienza in palestra.
              Prenota corsi, monitora l'affollamento e molto altro.
            </p>
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <h6 style={{ color: '#ff6b00', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px' }}>
              Navigazione
            </h6>
            {['Dashboard', 'Corsi', 'Prenotazioni', 'Affollamento', 'Profilo'].map(item => (
              <p key={item} style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
                {item}
              </p>
            ))}
          </Col>

          <Col xs={6} md={2} className="mb-4">
            <h6 style={{ color: '#ff6b00', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px' }}>
              Servizi
            </h6>
            {['Yoga', 'Pilates', 'Spinning', 'HIIT', 'CrossFit'].map(item => (
              <p key={item} style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
                {item}
              </p>
            ))}
          </Col>

          <Col xs={12} md={4} className="mb-4">
            <h6 style={{ color: '#ff6b00', fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px' }}>
              Contatti
            </h6>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              📍 Via Portuense 23, Roma
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              📞 +39 02 1234567
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              📧 info@gympulse.it
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              🕐 Lun-Ven: 6:00 - 22:00
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '6px' }}>
              🕐 Sab-Dom: 8:00 - 20:00
            </p>
          </Col>
        </Row>

        <hr style={{ borderColor: '#333' }} />

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <p style={{ color: '#aaaaaa', fontSize: '0.8rem', marginBottom: 0 }}>
            © 2026 GymPulse. Tutti i diritti riservati.
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