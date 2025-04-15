import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilter, faCalendarDay, faCalendarWeek, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';


const DiagnosticsBaseUrl = import.meta.env.VITE_BACKEND_Diagnostics_BASE_URL;
// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  appearance: none;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4a5568;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const DateInput = styled.input`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4a5568;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${props => props.primary ? '#4299e1' : 'white'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  border: 1px solid ${props => props.primary ? '#4299e1' : '#e2e8f0'};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#3182ce' : '#f7fafc'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: #f7fafc;
  
  th {
    padding: 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: #f7fafc;
    }
    
    &:not(:last-child) td {
      border-bottom: 1px solid #e2e8f0;
    }
  }
  
  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #4a5568;
  }
`;

const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 2rem;
    color: #a0aec0;
  }
`;

const SummarySection = styled.div`
  margin-top: 2rem;
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SummaryLabel = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
`;

// Main Component
const SalesVisitLogReport = () => {
  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
  const getCurrentWeek = () => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  };

  const [logs, setLogs] = useState([]);
  const [salesMapping, setSalesMapping] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [salespersonVisits, setSalespersonVisits] = useState([]);
  const [filter, setFilter] = useState({
    type: 'date',
    value: getCurrentDate(),
    salesPerson: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesMapping();
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const url = `${DiagnosticsBaseUrl}/SalesVisitLog/`;

      const params = {};
      
      if (filter.type === 'date') params.date = filter.value;
      else if (filter.type === 'week') params.week = filter.value;
      else if (filter.type === 'month') params.month = filter.value;
      
      if (filter.salesPerson) params.salesPerson = filter.salesPerson;
      
      const response = await axios.get(url, { params });
      setLogs(response.data);
      updateVisitCounts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const fetchSalesMapping = async () => {
    try {
      const url = `${DiagnosticsBaseUrl}/SalesVisitLog/`;

      const response = await axios.get(url);
      
      // Extract unique sales mapping names from response data
      const salesMappingSet = new Set(response.data.map(item => item.salesMapping).filter(Boolean));
      
      // Convert to an array with 'All' option at the beginning
      const salesMappingArray = [
        { id: 0, name: 'All' }, 
        ...Array.from(salesMappingSet).map((name, index) => ({ id: index + 1, name }))
      ];
      
      setSalesMapping(salesMappingArray);
    } catch (error) {
      console.error('Error fetching salesMapping:', error);
    }
  };

  const updateVisitCounts = (data) => {
    const visitCounts = {};
    let total = 0;
    
    data.forEach((log) => {
      const name = log.salesPersonName || 'Unknown';
      const visits = parseInt(log.noOfVisits, 10) || 0;
      visitCounts[name] = (visitCounts[name] || 0) + visits;
      total += visits;
    });
    
    // Convert to an array of objects for easier use
    const visitData = Object.entries(visitCounts).map(([name, count]) => ({ name, count }));
    
    // Update state
    setSalespersonVisits(visitData);
    setTotalVisits(total);
  };

  const handleFilterChange = (key, value) => {
    let newFilter = { ...filter, [key]: value };
    
    if (key === 'type') {
      if (value === 'date') newFilter.value = getCurrentDate();
      else if (value === 'week') newFilter.value = getCurrentWeek();
      else if (value === 'month') newFilter.value = getCurrentMonth();
    }
    
    setFilter(newFilter);
  };

  const downloadCSV = () => {
    const csvRows = [
      ['Date', 'Time', 'Clinical Name', 'Salesperson', 'No of Visits', 'Comments'],
      ...logs.map(log => [
        new Date(log.date).toLocaleDateString(),
        log.time || 'N/A',
        log.clinicalname || 'Clinical Name Not Available',
        log.salesPersonName || 'N/A',
        log.noOfVisits || 0,
        log.comments || 'No comments',
      ]),
    ];
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sales_visit_log.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Sales Visit Analytics</Title>
      </Header>

      <FilterContainer>
        <FilterGroup>
          <FilterLabel>
            <FontAwesomeIcon icon={faFilter} />
            View by:
          </FilterLabel>
          <Select value={filter.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
            <option value="date">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </Select>
          
          <DateInput
            type={filter.type === 'month' ? 'month' : filter.type === 'week' ? 'week' : 'date'}
            value={filter.value}
            onChange={(e) => handleFilterChange('value', e.target.value)}
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>
            <FontAwesomeIcon icon={faUser} />
            Salesperson:
          </FilterLabel>
          <Select 
            value={filter.salesPerson} 
            onChange={(e) => handleFilterChange('salesPerson', e.target.value)}
          >
            {salesMapping.map((person) => (
              <option key={person.id} value={person.name === 'All' ? '' : person.name}>
                {person.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
        
        <Button primary onClick={downloadCSV}>
          <FontAwesomeIcon icon={faDownload} />
          Export
        </Button>
      </FilterContainer>

      <Table>
        <TableHead>
          <tr>
            <th>Clinical Name</th>
            {/* <th>Referrer Code</th> */}
            <th>Salesperson</th>
            <th>Date</th>
            <th>Time</th>
            <th>Visits</th>
            <th>Comments</th>
          </tr>
        </TableHead>
        <TableBody>
          {loading ? (
            <EmptyRow>
              <td colSpan={7}>Loading data...</td>
            </EmptyRow>
          ) : logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index}>
                <td>{log.clinicalname || 'N/A'}</td>
                {/* <td>{log.referrerCode || 'N/A'}</td> */}
                <td>{log.salesMapping || 'N/A'}</td>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                <td>{log.time || 'N/A'}</td>
                <td>{log.noOfVisits || 0}</td>
                <td>{log.comments || 'No comments'}</td>
              </tr>
            ))
          ) : (
            <EmptyRow>
              <td colSpan={7}>No data available for the selected filters.</td>
            </EmptyRow>
          )}
        </TableBody>
      </Table>

      <SummarySection>
        <SummaryTitle>Performance Summary</SummaryTitle>
        <SummaryGrid>
          <SummaryCard>
            <SummaryLabel>Total Visits</SummaryLabel>
            <SummaryValue>{totalVisits}</SummaryValue>
          </SummaryCard>
          
          {salespersonVisits.length > 0 && salespersonVisits.map((person, index) => (
            <SummaryCard key={index}>
              <SummaryLabel>{person.name}</SummaryLabel>
              <SummaryValue>{person.count}</SummaryValue>
              <SummaryLabel>visits</SummaryLabel>
            </SummaryCard>
          ))}
        </SummaryGrid>
      </SummarySection>
    </PageContainer>
  );
};

export default SalesVisitLogReport;