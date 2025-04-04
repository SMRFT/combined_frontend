import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, Search } from 'lucide-react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Content = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.active ? '#2563eb' : '#6b7280'};
  border-bottom: 2px solid ${props => props.active ? '#2563eb' : 'transparent'};
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.active ? '#2563eb' : '#111827'};
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #6b7280;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  ${props => props.active ? `
    background-color: #def7ec;
    color: #03543f;
  ` : `
    background-color: #fde8e8;
    color: #9b1c1c;
  `}
`;

// Toggle Switch Styled Components
const ToggleWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.active ? '#10b981' : '#ef4444'};
  transition: 0.4s;
  border-radius: 34px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transform: ${props => props.active ? 'translateX(24px)' : 'translateX(0)'};
  }

  &:hover {
    opacity: 0.9;
  }
`;

function Admin() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState({});

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_data_departments/');
        setDepartments(response.data.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchDesignations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/get_data_designation/');
        setDesignations(response.data.designations);
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };

    fetchDepartments();
    fetchDesignations();
  }, []);

  const handleStatusToggle = async (item, type) => {
    const id = type === 'department' ? item.department_code : item.Designation_code;
    if (loading[id]) return;

    setLoading(prev => ({ ...prev, [id]: true }));

    try {
      const endpoint = type === 'department'
        ? `http://127.0.0.1:8000/update_department/${id}/`
        : `http://127.0.0.1:8000/update_designation/${id}/`;

      const response = await axios.put(endpoint, {
        is_active: !item.is_active
      });

      if (response.status === 200) {
        const updatedStatus = response.data.new_status;  // ✅ Ensure UI matches DB
        if (type === 'department') {
          setDepartments(departments.map(dept =>
            dept.department_code === id ? { ...dept, is_active: updatedStatus } : dept
          ));
        } else {
          setDesignations(designations.map(desig =>
            desig.Designation_code === id ? { ...desig, is_active: updatedStatus } : desig
          ));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
};


  const filteredDepartments = departments.filter(dept =>
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.department_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDesignations = designations.filter(desig =>
    desig.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    desig.Designation_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Content>
        <Title>Admin Dashboard</Title>
        
        <TabContainer>
          <TabList>
            <Tab
              active={activeTab === 'departments'}
              onClick={() => setActiveTab('departments')}
            >
              <Users size={20} />
              Departments
            </Tab>
            <Tab
              active={activeTab === 'designations'}
              onClick={() => setActiveTab('designations')}
            >
              <Briefcase size={20} />
              Designations
            </Tab>
          </TabList>
        </TabContainer>

        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <Card>
          <TableContainer>
            {activeTab === 'departments' ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Code</Th>
                    <Th>Name</Th>
                    <Th>Status</Th>
                    <Th>Description</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept) => (
                    <Tr key={dept.department_code}>
                      <Td>{dept.department_code}</Td>
                      <Td>{dept.department_name}</Td>
                      <Td>
                        <StatusBadge active={dept.is_active}>
                          {dept.is_active ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </Td>
                      <Td>{dept.description}</Td>
                      <Td>
                        <ToggleWrapper>
                          <ToggleInput
                            type="checkbox"
                            checked={dept.is_active}
                            onChange={() => handleStatusToggle(dept, 'department')}
                            disabled={loading[dept.department_code]}
                          />
                          <ToggleSlider active={dept.is_active} />
                        </ToggleWrapper>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Code</Th>
                    <Th>Designation</Th>
                    <Th>Status</Th>
                    <Th>Description</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDesignations.map((desig) => (
                    <Tr key={desig.Designation_code}>
                      <Td>{desig.Designation_code}</Td>
                      <Td>{desig.designation}</Td>
                      <Td>
                        <StatusBadge active={desig.is_active}>
                          {desig.is_active ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </Td>
                      <Td>{desig.decription}</Td>
                      <Td>
                        <ToggleWrapper>
                          <ToggleInput
                            type="checkbox"
                            checked={desig.is_active}
                            onChange={() => handleStatusToggle(desig, 'designation')}
                            disabled={loading[desig.Designation_code]}
                          />
                          <ToggleSlider active={desig.is_active} />
                        </ToggleWrapper>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </TableContainer>
        </Card>
      </Content>
    </Container>
  );
}

export default Admin;