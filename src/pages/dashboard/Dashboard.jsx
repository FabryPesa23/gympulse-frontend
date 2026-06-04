import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, Button, Badge, ProgressBar, Spinner,
} from "react-bootstrap";

function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [zones, setZones] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingZones, setLoadingZones] = useState(true);

  useEffect(() => {
    fetchBookings();
    fetchZones();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchZones = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/zones");
      const data = await response.json();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingZones(false);
    }
  };

  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const nextBookings = confirmedBookings.slice(0, 3);

  const getStatusColor = (status) => {
    if (status === "LOW") return "success";
    if (status === "MEDIUM") return "warning";
    if (status === "HIGH") return "danger";
    return "secondary";
  };

  const getStatusLabel = (status) => {
    if (status === "LOW") return "🟢 Libera";
    if (status === "MEDIUM") return "🟡 Affollata";
    if (status === "HIGH") return "🔴 Piena";
    return "⚪ N/D";
  };

  const cardStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "12px",
  };

  return (
    <Container className="mt-4 mb-5">

      {/* HERO SECTION */}
      <div
        className="p-4 mb-4 rounded-3"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a1500 100%)",
          border: "1px solid #ff6b00",
          borderRadius: "16px",
        }}>
        <Row className="align-items-center">
          <Col>
            <h2 style={{ color: "#ffffff", fontWeight: "700" }}>
              Bentornato,{" "}
              <span style={{ color: "#ff6b00" }}>{user?.firstName}</span>! 💪
            </h2>
            <p style={{ color: "#aaaaaa", marginBottom: 0 }}>
              Pronto per allenarti oggi? Hai{" "}
              <span style={{ color: "#ff6b00", fontWeight: "600" }}>
                {confirmedBookings.length}
              </span>{" "}
              {confirmedBookings.length === 1 ? "prenotazione attiva" : "prenotazioni attive"}
            </p>
          </Col>
          <Col xs="auto">
            <Button
              className="btn-accent"
              style={{ borderRadius: "8px" }}
              onClick={() => navigate("/courses")}>
              + Prenota un corso
            </Button>
          </Col>
        </Row>
      </div>

      {/* STATISTICHE */}
      <Row className="mb-4">
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center p-3">
            <h2 style={{ color: "#ff6b00", fontWeight: "700" }}>{confirmedBookings.length}</h2>
            <p style={{ color: "#aaaaaa", marginBottom: 0, fontSize: "0.85rem" }}>Prenotazioni attive</p>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center p-3">
            <h2 style={{ color: "#ff6b00", fontWeight: "700" }}>
              {bookings.filter((b) => b.status === "CANCELLED").length}
            </h2>
            <p style={{ color: "#aaaaaa", marginBottom: 0, fontSize: "0.85rem" }}>Cancellate</p>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center p-3">
            <h2 style={{ color: "#ff6b00", fontWeight: "700" }}>{bookings.length}</h2>
            <p style={{ color: "#aaaaaa", marginBottom: 0, fontSize: "0.85rem" }}>Totale prenotazioni</p>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center p-3">
            <h2 style={{ color: "#ff6b00", fontWeight: "700" }}>{zones.length}</h2>
            <p style={{ color: "#aaaaaa", marginBottom: 0, fontSize: "0.85rem" }}>Zone monitorate</p>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* PROSSIME PRENOTAZIONI */}
        <Col xs={12} lg={6} className="mb-4">
          <Card style={cardStyle}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: "#ffffff", marginBottom: 0 }}>
                  📅 Prossime <span style={{ color: "#ff6b00" }}>prenotazioni</span>
                </h5>
                <Button
                  size="sm"
                  onClick={() => navigate("/bookings")}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #ff6b00",
                    color: "#ff6b00",
                    borderRadius: "8px",
                  }}>
                  Vedi tutte
                </Button>
              </div>
              {loadingBookings ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" style={{ color: "#ff6b00" }} />
                </div>
              ) : nextBookings.length === 0 ? (
                <div className="text-center py-3">
                  <p style={{ color: "#aaaaaa" }} className="mb-2">Nessuna prenotazione attiva</p>
                  <Button
                    className="btn-accent"
                    size="sm"
                    style={{ borderRadius: "8px" }}
                    onClick={() => navigate("/courses")}>
                    Prenota ora
                  </Button>
                </div>
              ) : (
                nextBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 mb-2 rounded"
                    style={{ backgroundColor: "#222222", border: "1px solid #333" }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p style={{ color: "#ffffff", fontWeight: "600", marginBottom: "4px" }}>
                          {booking.courseName}
                        </p>
                        <p style={{ color: "#aaaaaa", fontSize: "0.85rem", marginBottom: "2px" }}>
                          👨‍🏫 {booking.instructor}
                        </p>
                        <p style={{ color: "#aaaaaa", fontSize: "0.85rem", marginBottom: 0 }}>
                          📅 {booking.date} &nbsp; 🕐 {booking.startTime}
                        </p>
                      </div>
                      <Badge bg="success">Confermata</Badge>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* AFFOLLAMENTO LIVE */}
        <Col xs={12} lg={6} className="mb-4">
          <Card style={cardStyle}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: "#ffffff", marginBottom: 0 }}>
                  👥 Affollamento <span style={{ color: "#ff6b00" }}>live</span>
                </h5>
                <Button
                  size="sm"
                  onClick={() => navigate("/zones")}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #ff6b00",
                    color: "#ff6b00",
                    borderRadius: "8px",
                  }}>
                  Vedi tutto
                </Button>
              </div>
              {loadingZones ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" style={{ color: "#ff6b00" }} />
                </div>
              ) : (
                zones.map((zone) => (
                  <div key={zone.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ color: "#ffffff", fontSize: "0.9rem" }}>{zone.name}</span>
                      <span style={{
                        fontSize: "0.85rem",
                        color: zone.occupancyStatus === "HIGH" ? "#dc3545"
                          : zone.occupancyStatus === "MEDIUM" ? "#ffc107"
                          : zone.occupancyStatus === "LOW" ? "#28a745"
                          : "#aaaaaa",
                      }}>
                        {getStatusLabel(zone.occupancyStatus)}
                      </span>
                    </div>
                    <ProgressBar
                      now={zone.currentLevel || 0}
                      variant={getStatusColor(zone.occupancyStatus)}
                      style={{ backgroundColor: "#333", borderRadius: "8px", height: "8px" }}
                    />
                    <small style={{ color: "#aaaaaa" }}>{zone.currentLevel || 0}% occupato</small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* NAVIGAZIONE RAPIDA */}
      <h5 className="mb-3" style={{ color: "#ffffff" }}>
        ⚡ Navigazione <span style={{ color: "#ff6b00" }}>rapida</span>
      </h5>
      <Row>
        {[
          { emoji: "📅", title: "Corsi", text: "Scopri e prenota", path: "/courses" },
          { emoji: "🎟️", title: "Prenotazioni", text: "Gestisci le tue prenotazioni", path: "/bookings" },
          { emoji: "👥", title: "Affollamento", text: "Controlla le zone", path: "/zones" },
          { emoji: "👤", title: "Profilo", text: "I tuoi dati", path: "/profile" },
        ].map(({ emoji, title, text, path }) => (
          <Col key={path} xs={6} md={3} className="mb-3">
            <Card
              style={{ ...cardStyle, cursor: "pointer" }}
              className="text-center h-100"
              onClick={() => navigate(path)}>
              <Card.Body className="p-3">
                <h2>{emoji}</h2>
                <p style={{ color: "#ffffff", fontWeight: "600", marginBottom: "4px" }}>{title}</p>
                <p style={{ color: "#aaaaaa", fontSize: "0.8rem", marginBottom: 0 }}>{text}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Dashboard;