import { useState, useEffect } from "react";
import {
  Container, Card, Badge, Button, Spinner, Alert, Row, Col,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
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
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        setMessageType("danger");
        setMessage("Errore durante la cancellazione");
        return;
      }
      setMessageType("success");
      setMessage("Prenotazione cancellata con successo");
      setConfirmCancelId(null);
      fetchBookings();
    } catch (err) {
      setMessageType("danger");
      setMessage("Errore di connessione al server");
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}/delete`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        setMessageType("danger");
        setMessage("Errore durante l'eliminazione");
        return;
      }
      setMessageType("success");
      setMessage("Prenotazione eliminata dallo storico");
      setConfirmDeleteId(null);
      fetchBookings();
    } catch (err) {
      setMessageType("danger");
      setMessage("Errore di connessione al server");
    }
  };

  const getStatusColor = (status) => {
    if (status === "CONFIRMED") return "success";
    if (status === "CANCELLED") return "danger";
    return "secondary";
  };

  const getStatusLabel = (status) => {
    if (status === "CONFIRMED") return "Confermata";
    if (status === "CANCELLED") return "Cancellata";
    return status;
  };

  if (loading)
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" style={{ color: "#ff6b00" }} />
      </Container>
    );

  return (
    <Container className="mt-4">
      <Button
        className="mb-3"
        onClick={() => navigate("/dashboard")}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #ff6b00",
          color: "#ff6b00",
          borderRadius: "8px",
        }}
      >
        Torna alla dashboard
      </Button>

      <h3 className="mb-4" style={{ color: "#ffffff" }}>
        Le mie <span style={{ color: "#ff6b00" }}>prenotazioni</span>
      </h3>

      {message && <Alert variant={messageType}>{message}</Alert>}

      {bookings.length === 0 ? (
        <Card
          className="text-center p-4"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "#aaaaaa" }} className="mb-3">
            Non hai ancora nessuna prenotazione
          </p>
          <Button
            className="btn-accent mx-auto"
            style={{ borderRadius: "8px", width: "fit-content" }}
            onClick={() => navigate("/courses")}
          >
            Scopri i corsi
          </Button>
        </Card>
      ) : (
        <Row>
          {bookings.map((booking) => (
            <Col key={booking.id} xs={12} md={6} className="mb-3">
              <Card
                style={{
                  backgroundColor: "#1a1a1a",
                  border: confirmCancelId === booking.id
                    ? "1px solid #dc3545"
                    : confirmDeleteId === booking.id
                    ? "1px solid #555"
                    : "1px solid #333",
                  borderRadius: "12px",
                  transition: "border 0.2s ease"
                }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 style={{ color: "#ffffff", fontWeight: "600" }}>
                      {booking.courseName}
                    </h5>
                    <Badge bg={getStatusColor(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </div>
                  <p className="mb-1" style={{ color: "#aaaaaa" }}>
                    👨‍🏫 <span style={{ color: "#ffffff" }}>{booking.instructor}</span>
                  </p>
                  <p className="mb-1" style={{ color: "#aaaaaa" }}>
                    📅 <span style={{ color: "#ffffff" }}>{booking.date}</span>
                  </p>
                  <p className="mb-3" style={{ color: "#aaaaaa" }}>
                    🕐 <span style={{ color: "#ffffff" }}>{booking.startTime} - {booking.endTime}</span>
                  </p>

                  {booking.status === "CONFIRMED" && (
                    confirmCancelId === booking.id ? (
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#2a0a0a", border: "1px solid #dc3545" }}
                      >
                        <p style={{ color: "#ffffff", fontSize: "0.85rem", marginBottom: "10px" }}>
                          Sei sicuro di voler cancellare questa prenotazione?
                        </p>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            className="w-50"
                            onClick={() => handleCancel(booking.id)}
                            style={{
                              backgroundColor: "#dc3545",
                              border: "none",
                              borderRadius: "8px"
                            }}
                          >
                            Si, cancella
                          </Button>
                          <Button
                            size="sm"
                            className="w-50"
                            onClick={() => setConfirmCancelId(null)}
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #555",
                              color: "#aaaaaa",
                              borderRadius: "8px"
                            }}
                          >
                            Annulla
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setConfirmCancelId(booking.id)}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #dc3545",
                          color: "#dc3545",
                          borderRadius: "8px",
                        }}
                      >
                        Cancella prenotazione
                      </Button>
                    )
                  )}

                  {booking.status === "CANCELLED" && (
                    confirmDeleteId === booking.id ? (
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#1a1a1a", border: "1px solid #555" }}
                      >
                        <p style={{ color: "#ffffff", fontSize: "0.85rem", marginBottom: "10px" }}>
                          Rimuovere questa prenotazione dallo storico?
                        </p>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            className="w-50"
                            onClick={() => handleDelete(booking.id)}
                            style={{
                              backgroundColor: "#555",
                              border: "none",
                              borderRadius: "8px",
                              color: "#ffffff"
                            }}
                          >
                            Si, rimuovi
                          </Button>
                          <Button
                            size="sm"
                            className="w-50"
                            onClick={() => setConfirmDeleteId(null)}
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid #555",
                              color: "#aaaaaa",
                              borderRadius: "8px"
                            }}
                          >
                            Annulla
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setConfirmDeleteId(booking.id)}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #555",
                          color: "#aaaaaa",
                          borderRadius: "8px",
                        }}
                      >
                        Rimuovi
                      </Button>
                    )
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Bookings;