import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const AuthForm = (props) => {
  const { isLogin } = props;
  const [input, setInput] = useState({
    name: "",
    bio: "",
    email: "",
    password: "",
  });
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const triggerAPI = (payload) => {
    const url = `${import.meta.env.VITE_SH_BE_URI}api/v1/users/${isLogin ? "login" : "sign-up"}`;
    setLoader(true);
    setError("");
    axios
      .post(url, payload)
      .then((response) => {
        if (!isLogin && response.status === 200) {
          // Auto-login after signup
          localStorage.setItem("token", response.data.data.token);
          navigate("/");
        } else if (response.status === 200) {
          localStorage.setItem("token", response.data.data.token);
          navigate("/");
        }
      })
      .catch((error) => {
        setError(
          error?.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleFormSubmit = (input) => {
    if (isLogin) {
      if (!input.email || !input.password) {
        setError("Please fill all the fields");
        return;
      }
      triggerAPI(input);
    } else {
      if (!input.name || !input.email || !input.password) {
        setError("Please fill all the fields");
        return;
      }
      triggerAPI(input);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)",
          padding: "1rem",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 400,
            borderRadius: 18,
            boxShadow: "0 4px 32px rgba(25, 118, 210, 0.10)",
            padding: "2rem 1.5rem",
            border: "none",
            background:
              "linear-gradient(135deg, #ffffff 60%, #e3f0ff 100%)",
          }}
        >
          <Card.Body>
            <div className="text-center mb-4">
              <img
                src="https://img.icons8.com/color/96/000000/student-center.png"
                alt="logo"
                style={{ width: 64, marginBottom: 8 }}
              />
              <h2
                style={{
                  color: "#1976d2",
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 0,
                }}
              >
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="text-muted" style={{ fontSize: 15 }}>
                {isLogin
                  ? "Login to access StudentHub"
                  : "Sign up to join StudentHub"}
              </p>
            </div>
            {error && (
              <div className="alert alert-danger py-2">{error}</div>
            )}
            <Form>
              {!isLogin && (
                <>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your Name"
                      value={input.name}
                      onChange={(e) =>
                        setInput((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicBio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Tell us about yourself..."
                      value={input.bio}
                      onChange={(e) =>
                        setInput((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={input.email}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={input.password}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3 text-center">
                <Link to={isLogin ? "/sign-up" : "/login"}>
                  <Form.Text
                    className="text-primary"
                    style={{
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                  >
                    {isLogin
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Login"}
                  </Form.Text>
                </Link>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                style={{
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 17,
                  letterSpacing: 0.5,
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleFormSubmit(input);
                  setInput({
                    name: "",
                    bio: "",
                    email: "",
                    password: "",
                  });
                }}
              >
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <style>
        {`
        @media (max-width: 600px) {
          .card {
            padding: 1rem !important;
            border-radius: 12px !important;
            box-shadow: 0 2px 12px rgba(25, 118, 210, 0.10) !important;
          }
          .container, .d-flex.justify-content-center.align-items-center {
            padding: 0 !important;
          }
          h2, .card-title {
            font-size: 1.3rem !important;
          }
        }
        `}
      </style>
    </>
  );
};

export default AuthForm;
