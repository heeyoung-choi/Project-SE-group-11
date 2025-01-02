import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function LoginForm({handleLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submission

    handleLogin(email, password);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="border p-4 rounded shadow" style={{ width: '350px', background: '#f8f9fa' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Updates state
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Updates state
            />
          </Form.Group>

          {error && <div className="text-danger mb-3">{error}</div>}

          <Button variant="primary" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
