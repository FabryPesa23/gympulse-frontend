import { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoVertical from "../../assets/logo-vertical.svg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, updateProfileImage } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Credenziali non valide");
        return;
      }

      login(data.token, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });

      // Carica subito la foto profilo
      try {
        const profileResponse = await fetch("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const profileData = await profileResponse.json();
        if (profileData.profileImageUrl) {
          updateProfileImage(profileData.profileImageUrl)
        }
      } catch (err) {
        console.error(err)
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Errore di connessione al server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{
          width: "420px",
          backgroundColor: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "16px",
        }}
        className="p-4 shadow"
      >
        <div className="text-center mb-2">
          <img src={logoVertical} alt="GymPulse" style={{ width: "180px" }} />
          <p style={{ color: "#aaaaaa", fontSize: "0.9rem", marginTop: "4px", marginBottom: 0 }}>
            Accedi al tuo account
          </p>
        </div>

        <hr style={{ borderColor: '#333', marginBottom: '20px' }} />

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#aaaaaa" }}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                backgroundColor: "#222222",
                border: "1px solid #333",
                color: "#ffffff",
                borderRadius: "8px",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ color: "#aaaaaa" }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Inserisci password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: "#222222",
                border: "1px solid #333",
                color: "#ffffff",
                borderRadius: "8px",
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 btn-accent"
            disabled={loading}
            style={{ borderRadius: "8px", padding: "10px" }}
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </Button>
        </Form>

        <p className="text-center mt-3" style={{ color: "#aaaaaa" }}>
          Non hai un account?{" "}
          <Link to="/register" style={{ color: "#ff6b00", textDecoration: "none" }}>
            Registrati
          </Link>
        </p>
      </Card>
    </Container>
  );
}

export default Login;