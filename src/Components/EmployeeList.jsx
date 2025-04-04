import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import bcrypt from 'bcryptjs';

import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  Building, 
  Users, 
  Database, 
  Lock, 
  X, 
  Eye, 
  EyeOff 
} from 'lucide-react';

// Styled components
const PageContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SearchGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const SearchLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(to right, #3b82f6, #2563eb);
  padding: 1.25rem;
  position: relative;
`;

const CardAvatar = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const CardSubtitle = styled.p`
  color: #bfdbfe;
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
`;

const CardBody = styled.div`
  padding: 1.25rem;
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CardInfoIcon = styled.div`
  color: #4b5563;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
`;

const CardInfoText = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  margin: 0;
`;

const CardFooter = styled.div`
  padding: 1rem 1.25rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
`;

const CardButton = styled.button`
  background-color: #eff6ff;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #dbeafe;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`;

const ButtonIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
  font-size: 1rem;
  grid-column: 1 / -1;
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  
  &:hover {
    color: #1f2937;
  }
  
  &:focus {
    outline: none;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalInfo = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
`;

const ModalInfoItem = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ModalInfoLabel = styled.span`
  font-weight: 500;
  color: #4b5563;
  width: 8rem;
`;

const ModalInfoValue = styled.span`
  color: #1f2937;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  padding-right: 2.5rem;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    outline: none;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin: 0.25rem 0 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  gap: 0.75rem;
`;

const CancelButton = styled.button`
  background-color: white;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.5);
  }
`;

const SaveButton = styled.button`
  background-color: #3b82f6;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
  
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [departments, setDepartments] = useState([]);

  const getAllEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/create_employee/');
      const employeeData = response.data.employees || [];
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
      
      // Extract unique departments for filter
      const uniqueDepartments = [...new Set(employeeData.map(emp => emp.department))].filter(Boolean);
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching employees:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, departmentFilter, employees]);

  const filterEmployees = () => {
    let filtered = [...employees];
    
    // Filter by search term (name, mobile, or department)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        (emp.employeeName && emp.employeeName.toLowerCase().includes(term)) ||
        (emp.mobileNumber && emp.mobileNumber.toLowerCase().includes(term)) ||
        (emp.department && emp.department.toLowerCase().includes(term))
      );
    }
    
    // Filter by department
    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }
    
    setFilteredEmployees(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartmentFilter(e.target.value);
  };

  const openCredentialsModal = (employee) => {
    setSelectedEmployee(employee);
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const validatePasswords = () => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSaveCredentials = async () => {
    if (!validatePasswords()) return;
    
    // Encrypt password before sending it to backend
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      await axios.post('http://127.0.0.1:8000/set_employee_password/', {
        employeeId: selectedEmployee.employeeId,
        employeeName: selectedEmployee.employeeName,
        department: selectedEmployee.department,
        designation: selectedEmployee.designation,
        password: hashedPassword  // Send encrypted password
      });
      
      alert('Password set successfully!');
      closeModal();
    } catch (error) {
      console.error('Error setting password:', error.response?.data || error.message);
      setPasswordError('Failed to set password. Please try again.');
    }
};
  const formatArrayToString = (arr) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.join(', ');
  };

  return (
    <PageContainer>
      <Header>
        <Title>Employee Directory</Title>
      </Header>
      
      <SearchContainer>
        <SearchGroup>
          <SearchLabel>Search</SearchLabel>
          <SearchInputWrapper>
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by name, mobile, or department"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchInputWrapper>
        </SearchGroup>
        
        <SearchGroup>
          <SearchLabel>Department</SearchLabel>
          <SearchInputWrapper>
            <SearchIcon>
              <Building size={18} />
            </SearchIcon>
            <Select
              value={departmentFilter}
              onChange={handleDepartmentChange}
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </Select>
          </SearchInputWrapper>
        </SearchGroup>
      </SearchContainer>
      
      <CardsGrid>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <Card key={employee.employeeId}>
              <CardHeader>
                <CardAvatar>
                  <User size={32} color="#4b5563" />
                </CardAvatar>
                <CardTitle>{employee.employeeName || 'N/A'}</CardTitle>
                <CardSubtitle>{employee.designation || 'No Designation'}</CardSubtitle>
              </CardHeader>
              
              <CardBody>
                <CardInfo>
                  <CardInfoIcon>
                    <Briefcase size={18} />
                  </CardInfoIcon>
                  <CardInfoText>{employee.department || 'No Department'}</CardInfoText>
                </CardInfo>
                
                <CardInfo>
                  <CardInfoIcon>
                    <Phone size={18} />
                  </CardInfoIcon>
                  <CardInfoText>{employee.mobileNumber || 'No Phone'}</CardInfoText>
                </CardInfo>
                
                <CardInfo>
                  <CardInfoIcon>
                    <Mail size={18} />
                  </CardInfoIcon>
                  <CardInfoText>{employee.email || 'No Email'}</CardInfoText>
                </CardInfo>
                
                <CardInfo>
                  <CardInfoIcon>
                    <User size={18} />
                  </CardInfoIcon>
                  <CardInfoText>
                    Primary Role: {employee.primaryRole || 'None'}
                  </CardInfoText>
                </CardInfo>
                
                {employee.additionalRoles && employee.additionalRoles.length > 0 && (
                  <CardInfo>
                    <CardInfoIcon>
                      <Users size={18} />
                    </CardInfoIcon>
                    <div>
                      <CardInfoText>Additional Roles:</CardInfoText>
                      <BadgeContainer>
                        {employee.additionalRoles.map((role, index) => (
                          <Badge key={index}>{role}</Badge>
                        ))}
                      </BadgeContainer>
                    </div>
                  </CardInfo>
                )}
                
                {employee.dataEntitlements && employee.dataEntitlements.length > 0 && (
                  <CardInfo>
                    <CardInfoIcon>
                      <Database size={18} />
                    </CardInfoIcon>
                    <div>
                      <CardInfoText>Data Entitlements:</CardInfoText>
                      <BadgeContainer>
                        {employee.dataEntitlements.map((entitlement, index) => (
                          <Badge key={index}>{entitlement}</Badge>
                        ))}
                      </BadgeContainer>
                    </div>
                  </CardInfo>
                )}
              </CardBody>
              
              <CardFooter>
                <CardButton onClick={() => openCredentialsModal(employee)}>
                  <ButtonIcon>
                    <Lock size={16} />
                  </ButtonIcon>
                  Login Credentials
                </CardButton>
              </CardFooter>
            </Card>
          ))
        ) : (
          <NoResults>
            <p>No employees found matching your search criteria.</p>
          </NoResults>
        )}
      </CardsGrid>
      
      {/* Credentials Modal */}
      {isModalOpen && selectedEmployee && (
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>Set Login Credentials</ModalTitle>
              <CloseButton onClick={closeModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <ModalInfo>
                <ModalInfoItem>
                  <ModalInfoLabel>Employee ID:</ModalInfoLabel>
                  <ModalInfoValue>{selectedEmployee.employeeId}</ModalInfoValue>
                </ModalInfoItem>
                <ModalInfoItem>
                  <ModalInfoLabel>Name:</ModalInfoLabel>
                  <ModalInfoValue>{selectedEmployee.employeeName}</ModalInfoValue>
                </ModalInfoItem>
                <ModalInfoItem>
                  <ModalInfoLabel>Department:</ModalInfoLabel>
                  <ModalInfoValue>{selectedEmployee.department || 'N/A'}</ModalInfoValue>
                </ModalInfoItem>
                <ModalInfoItem>
                  <ModalInfoLabel>Designation:</ModalInfoLabel>
                  <ModalInfoValue>{selectedEmployee.designation || 'N/A'}</ModalInfoValue>
                </ModalInfoItem>
              </ModalInfo>
              
              <FormGroup>
                <FormLabel htmlFor="password">Password</FormLabel>
                <PasswordInputWrapper>
                  <PasswordInput
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </PasswordToggle>
                </PasswordInputWrapper>
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <PasswordInputWrapper>
                  <PasswordInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </PasswordToggle>
                </PasswordInputWrapper>
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                
              </FormGroup>
            </ModalBody>
            
            <ModalFooter>
              <CancelButton onClick={closeModal}>Cancel</CancelButton>
              <SaveButton 
                onClick={handleSaveCredentials}
                disabled={!password || !confirmPassword}
              >
                Save Credentials
              </SaveButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default EmployeeList;