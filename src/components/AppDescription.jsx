import { Container, Row, Col } from 'react-bootstrap'

function AppDescription() {
  return (
    <Container className="my-5">
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '16px',
        padding: '40px'
      }}>
        <Row className="align-items-center">
          <Col xs={12} md={7} className="mb-4 mb-md-0">
            <h4 style={{ color: '#ff6b00', marginBottom: '12px' }}>
              Il tuo allenamento, <span style={{ color: '#ffffff' }}>smart</span>
            </h4>
            <p style={{ color: '#aaaaaa', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: 0 }}>
              GymPulse è la piattaforma che trasforma la tua esperienza in palestra.
              Prenota i tuoi corsi preferiti in pochi tap, monitora l affollamento
              in tempo reale e gestisci il tuo profilo — tutto in un unico posto.
              Non perdere mai più il tuo posto in classe!
            </p>
          </Col>
          <Col xs={12} md={5}>
            <Row>
              {[
                { emoji: '🎟️', title: 'Prenota facilmente', text: 'Scegli il corso e prenota in pochi secondi' },
                { emoji: '👥', title: 'Affollamento live', text: 'Sai sempre quanto è piena la palestra' },
                { emoji: '📧', title: 'Notifiche email', text: 'Ricevi conferme e aggiornamenti via email' },
                { emoji: '📋', title: 'Storico prenotazioni', text: 'Tieni traccia di tutti i tuoi corsi passati' },
              ].map((item, index) => (
                <Col key={index} xs={6} className="mb-3">
                  <div style={{
                    backgroundColor: '#222222',
                    borderRadius: '10px',
                    padding: '12px',
                    border: '1px solid #333'
                  }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{item.emoji}</div>
                    <p style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: '600', marginBottom: '2px' }}>{item.title}</p>
                    <p style={{ color: '#aaaaaa', fontSize: '0.75rem', marginBottom: 0 }}>{item.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default AppDescription