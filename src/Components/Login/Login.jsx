import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import {validate} from "../jwt-check";

const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const FormWrapper = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 420px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  margin-bottom: 1.8rem;
  color: #333;
  font-weight: 600;
  font-size: 1.8rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #3b324b, #dd2476);
    border-radius: 3px;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  position: absolute;
  left: 15px;
  top: ${props => props.filled ? '-10px' : '12px'};
  font-size: ${props => props.filled ? '12px' : '16px'};
  color: ${props => props.filled ? '#3b324b' : '#aaa'};
  background: ${props => props.filled ? 'white' : 'transparent'};
  padding: 0 5px;
  transition: all 0.2s ease;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
  
  &:focus {
    border-color: #3b324b;
    box-shadow: 0 0 0 2px rgba(59, 50, 75, 0.2);
    outline: none;
  }
  
  &:focus + ${InputLabel} {
    top: -10px;
    font-size: 12px;
    color: #3b324b;
    background: white;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 1rem;
  background: linear-gradient(90deg, #3b324b, #6b5b95);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 15px rgba(59, 50, 75, 0.2);
  
  &:hover {
    background: linear-gradient(90deg, #3b324b, #dd2476);
    box-shadow: 0 6px 20px rgba(221, 36, 118, 0.25);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 1rem;
  background: rgba(231, 76, 60, 0.1);
  padding: 10px;
  border-radius: 8px;
  animation: shake 0.5s;
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.password) {
      setError("Please enter both Employee ID and Password.");
      return;
    }

    try {
      const res = await axios.post(securityBaseUrl + "create_employee/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { access_token } = res.data;

      localStorage.setItem("access_token", access_token);

      const user = validate(access_token);
      console.log("User id:", user.id());
      console.log("User name:", user.name());
      console.log("User email:", user.email());
      console.log("Allowed Actions:", user.allowedActions());
      console.log("Allowed Data:", user.allowedData());
      console.log("Allowed Pages:", user.allowedPages());
      
      console.log("Check if user has RW access to page SD-P-BG and branch SHB003:", user.checkAccess("SHB003", "SD-P-BG-RW"));
      console.log("Check if user has RW access to page SD-P-BG and branch SHB003:", user.checkAccess("SHB003", "SD-P-BG", "RW"));
      console.log("Check if user has RW access to page SD-P-BG:", user.checkRoleAccess("SD-P-BG-RW"));
      console.log("Check if user has RW access to page SD-P-BG:", user.checkRoleAccess("SD-P-BG", "RW"));
      console.log("Check if user has RW access to branch SHB003:", user.checkDataAccess("SHB003"));

      console.log("Check if user has RW access to page SD-P-XX and branch SHB003:", user.checkAccess("SHB003", "SD-P-XX-RW"));
      console.log("Check if user has RW access to page SD-P-XX and branch SHB003:", user.checkAccess("SHB003", "SD-P-XX", "RW"));
      console.log("Check if user has RW access to page SD-P-XX:", user.checkRoleAccess("SD-P-XX-RW"));
      console.log("Check if user has RW access to page SD-P-XX:", user.checkRoleAccess("SD-P-XX", "RW"));
      console.log("Check if user has RW access to branch SHB009:", user.checkDataAccess("SHB009"));

      navigate("/Profile");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Employee Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input 
              type="text" 
              name="employeeId" 
              id="employeeId"
              value={formData.employeeId}
              onChange={handleChange} 
              required 
            />
            <InputLabel 
              htmlFor="employeeId" 
              filled={formData.employeeId.length > 0}
            >
              Employee ID
            </InputLabel>
          </InputGroup>
          
          <InputGroup>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputLabel 
              htmlFor="password"
              filled={formData.password.length > 0}
            >
              Password
            </InputLabel>
          </InputGroup>
          
          <Button type="submit">Sign In</Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default Login;