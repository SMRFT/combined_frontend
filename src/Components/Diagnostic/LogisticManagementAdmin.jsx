import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, User, Clock, Clipboard, ChevronRight, Check, X, FileText, Truck, MessageSquare } from 'lucide-react';


const DiagnosticsBaseUrl = import.meta.env.VITE_BACKEND_Diagnostics_BASE_URL;
// Styled Components with modern design
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #334155;
  background-color: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.75rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const Input = styled.input`
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: ${props => props.readOnly ? '#f1f5f9' : '#f8fafc'};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const DatePickerWrapper = styled.div`
  max-width: 250px;
  margin: 0 auto 2rem auto;
  position: relative;
  
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container {
    width: 100%;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  height: 48px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 2.75rem 0 1rem;
  font-size: 0.9375rem;
  color: #334155;
  background-color: #f8fafc;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const DatePickerIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6366f1;
  pointer-events: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Alert = styled.div`
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: fadeIn 0.3s ease-in-out;
  background-color: ${props => props.type === 'success' ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#065f46' : '#b91c1c'};
  border: 1px solid ${props => props.type === 'success' ? '#6ee7b7' : '#fecaca'};
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AlertIcon = styled.div`
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 2.5rem 0 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #6366f1;
    border-radius: 2px;
  }
`;

const TableContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2.5rem;
  background-color: white;
`;

const TableHeader = styled.div`
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Td = styled.td`
  padding: 1.25rem 1.5rem;
  font-size: 0.9375rem;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${props => {
    if (props.status === 'assigned') return '#e0e7ff';
    if (props.status === 'accepted') return '#dcfce7';
    if (props.status === 'picked') return '#cffafe';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.status === 'assigned') return '#4f46e5';
    if (props.status === 'accepted') return '#16a34a';
    if (props.status === 'picked') return '#0891b2';
    return '#6b7280';
  }};
`;

const EmptyState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #64748b;
`;

const TimeDisplay = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #6366f1;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background-color: #eff6ff;
  width: fit-content;
  margin-bottom: 1.5rem;
`;

// Main Component
const LogisticManagementAdmin = () => {
  const [clinicalNames, setClinicalNames] = useState([]);
  const [selectedLabName, setSelectedLabName] = useState('');
  const [salesperson, setSalesperson] = useState('');
  const [sampleCollectorOptions, setSampleCollectorOptions] = useState([]);
  const [selectedSampleCollector, setSelectedSampleCollector] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [logisticData, setLogisticData] = useState([]);
  const [getlogisticData, setGetLogisticData] = useState([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
  const [selectedTask, setSelectedTask] = useState('');

  // Update the time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    // Initial time set
    updateTime();
    // Update time every second
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Fetch clinical names on component mount
  useEffect(() => {
    axios
      .get(`${DiagnosticsBaseUrl}/get_clinicalname/`)
      .then((response) => {
        setClinicalNames(response.data);
      })
      .catch((error) => {
        console.error('Error fetching clinical names:', error);
      });
  }, []);
  // Fetch Sample Collector Data
  useEffect(() => {
    const fetchSampleCollector = async () => {
      try {
        const response = await axios.get(`${DiagnosticsBaseUrl}/sample-collector/`);
        setSampleCollectorOptions(response.data);
      } catch (error) {
        console.error('Error fetching sample collectors:', error);
      }
    };
    fetchSampleCollector();
  }, []);

  // Fetch the saved logistic data for table display
  const fetchLogisticData = async () => {
    try {
      const response = await axios.get(`${DiagnosticsBaseUrl}/savesamplecollector/`);
      setLogisticData(response.data);
    } catch (error) {
      console.error('Error fetching logistic data:', error);
    }
  };

  const getfetchLogistic = async () => {
    try {
      const response = await axios.get(`${DiagnosticsBaseUrl}/get_logistic_data/`);
      setGetLogisticData(response.data);
    } catch (error) {
      console.error('Error fetching logistic data:', error);
    }
  };

  useEffect(() => {
    fetchLogisticData();
    getfetchLogistic();
  }, []);

  // Handle lab name selection
  const handleLabNameChange = (e) => {
    const selectedName = e.target.value;
    setSelectedLabName(selectedName);
    const selectedLab = clinicalNames.find((lab) => lab.clinicalname === selectedName);
    if (selectedLab) {
      setSalesperson(selectedLab.salesMapping || '');
    } else {
      setSalesperson('');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle Save button click
  const handleSave = () => {
    if (!selectedLabName || !selectedSampleCollector || !selectedTask) {
      setMessage('Please fill in all required fields.');
      setMessageType('danger');
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const payload = {
      labName: selectedLabName,
      salesMapping:salesperson,
      sampleCollector: selectedSampleCollector,
      date: formattedDate,
      sampleordertime: time,
      task: selectedTask
    };

    axios
      .post('https://lab.shinovadatabase.in/save-logistic-data/', payload)
      .then(() => {
        setMessage('Task assigned successfully!');
        setMessageType('success');
        setSelectedLabName('');
        setSalesperson('');
        setSelectedSampleCollector('');
        setSelectedTask('');
        fetchLogisticData();
        getfetchLogistic();
        setTimeout(() => {
          setMessage('');
        }, 5000);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        setMessage('Failed to assign task. Please try again.');
        setMessageType('danger');
        setTimeout(() => {
          setMessage('');
        }, 5000);
      });
  };

  // Filter logistic data to only show today's tasks
  const filterTodayData = () => {
    const today = new Date().toISOString().split('T')[0];
    return logisticData.filter((data) => data.date === today);
  };
  
  // Render status badge with icon
  const renderStatusBadge = (status) => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    
    return (
      <StatusBadge status={statusLower}>
        {statusLower === 'assigned' && <Clipboard size={14} />}
        {statusLower === 'accepted' && <Check size={14} />}
        {statusLower === 'picked' && <Truck size={14} />}
        {status}
      </StatusBadge>
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Logistic Management Admin</Title>
        <Subtitle>Assign and track sample collections across different labs</Subtitle>
      </PageHeader>
      
      <TimeDisplay>
        <Clock size={18} />
        {time}
      </TimeDisplay>
      
      {message && (
        <Alert type={messageType}>
          <AlertIcon>
            {messageType === 'success' ? <Check size={20} /> : <X size={20} />}
          </AlertIcon>
          {message}
        </Alert>
      )}
      
      <Card>
        <Label style={{ textAlign: 'center', display: 'block', marginBottom: '1rem' }}>
          <Calendar size={18} />
          Select Assignment Date
        </Label>
        
        <DatePickerWrapper>
          <StyledDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
          />
          <DatePickerIcon>
            <Calendar size={18} />
          </DatePickerIcon>
        </DatePickerWrapper>
        
        <FormGrid>
          <FormGroup>
            <Label>
              <FileText size={16} />
              Lab Name
            </Label>
            <Select
              value={selectedLabName}
              onChange={handleLabNameChange}
            >
              <option value="">Select Lab Name</option>
              {clinicalNames.map((lab) => (
                <option key={lab.clinicalname} value={lab.clinicalname}>
                  {lab.clinicalname}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <User size={16} />
              Salesperson
            </Label>
            <Input
              type="text"
              placeholder="Salesperson"
              value={salesperson}
              readOnly
            />
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Truck size={16} />
              Sample Collector
            </Label>
            <Select
              value={selectedSampleCollector}
              onChange={(e) => setSelectedSampleCollector(e.target.value)}
            >
              <option value="">Select Sample Collector</option>
              {sampleCollectorOptions.map((collector) => (
                <option key={collector.id} value={collector.name}>
                  {collector.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Clipboard size={16} />
              Task
            </Label>
            <Select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">Select Task</option>
              <option value="assigned">Assigned</option>
            </Select>
          </FormGroup>
        </FormGrid>
        
        <ButtonContainer>
          <Button onClick={handleSave}>
            Assign Task
            <ChevronRight size={18} />
          </Button>
        </ButtonContainer>
      </Card>
      
      <SectionTitle>Today's Task Assignments</SectionTitle>
      <TableContainer>
        <TableHeader>
          <Clipboard size={20} color="#6366f1" />
          <TableTitle>Today's Assigned Collection Tasks</TableTitle>
        </TableHeader>
        {getlogisticData.filter((data) => data.date === new Date().toISOString().split('T')[0]).length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Lab Name</Th>
                <Th>Salesperson</Th>
                <Th>Sample Collector</Th>
                <Th>Order Time</Th>
              </tr>
            </thead>
            <tbody>
              {getlogisticData
                .filter((data) => data.date === new Date().toISOString().split('T')[0])
                .map((data, index) => (
                  <Tr key={index}>
                    <Td>{formatDate(data.date)}</Td>
                    <Td>{data.labName}</Td>
                    <Td>{data.salesMapping}</Td>
                    <Td>{data.sampleCollector}</Td>
                    <Td>{data.sampleordertime}</Td>
                  </Tr>
                ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            No tasks assigned for today. Use the form above to assign new collection tasks.
          </EmptyState>
        )}
      </TableContainer>
      
      <SectionTitle>All Logistic Data</SectionTitle>
      <TableContainer>
        <TableHeader>
          <FileText size={20} color="#6366f1" />
          <TableTitle>Complete Logistics History</TableTitle>
        </TableHeader>
        {filterTodayData().length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Lab Name</Th>
                <Th>Salesperson</Th>
                <Th>Sample Collector</Th>
                <Th>Order Time</Th>
                <Th>Status</Th>
                <Th>Accepted Time</Th>
                <Th>Picked Up Time</Th>
                <Th>Remarks</Th>
              </tr>
            </thead>
            <tbody>
              {filterTodayData().map((data, index) => (
                <Tr key={index}>
                  <Td>{formatDate(data.date)}</Td>
                  <Td>{data.lab_name}</Td>
                  <Td>{data.salesMapping}</Td>
                  <Td>{data.sampleCollector}</Td>
                  <Td>{data.sampleordertime}</Td>
                  <Td>{renderStatusBadge(data.task)}</Td>
                  <Td>{data.sampleacceptedtime || '—'}</Td>
                  <Td>{data.samplepickeduptime || '—'}</Td>
                  <Td>
                    {data.remarks ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MessageSquare size={14} />
                        {data.remarks}
                      </div>
                    ) : '—'}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            No logistics data available for today. Task history will appear here once tasks are assigned.
          </EmptyState>
        )}
      </TableContainer>
    </PageContainer>
  );
};

export default LogisticManagementAdmin;