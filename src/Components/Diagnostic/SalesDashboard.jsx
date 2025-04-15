import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Users, DollarSign, FlaskRound as Flask, Calendar, TrendingUp, Calculator } from 'lucide-react';


const DiagnosticsBaseUrl = import.meta.env.VITE_BACKEND_Diagnostics_BASE_URL;

const theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#4f46e5',
    success: '#22c55e',
    warning: '#eab308',
    background: '#f9fafb',
    card: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
};

const Container = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  text-align: center;
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const FilterTypeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.25rem;
  background-color: ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  width: fit-content;
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  background-color: ${props => props.active ? props.theme.colors.card : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => !props.active && 'rgba(255, 255, 255, 0.5)'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.card};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color};
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const AveragesContainer = styled.div`
  margin: 2rem 0;
  background: ${props => props.theme.colors.card};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AveragesTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AveragesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const AverageCard = styled.div`
  background: ${props => props.theme.colors.background};
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const AverageLabel = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
  margin-bottom: 0.5rem;
`;

const AverageValue = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const AverageChange = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.isPositive ? props.theme.colors.success : '#ef4444'};
  margin-left: 0.5rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.card};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 400px;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

function App() {
  const [salesMappings, setSalesMappings] = useState([]);
  const [selectedSalesMapping, setSelectedSalesMapping] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterType, setFilterType] = useState("date");
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    totalAmount: 0,
    totalTests: 0,
    testCounts: {},
    monthlyData: []
  });

  const [averages, setAverages] = useState({
    patientPerRevenue: 0,
    revenuePerTest: 0,
    testsPerPatient: 0,
    dailyGrowth: {
      patients: 0,
      revenue: 0,
      tests: 0
    }
  });

  useEffect(() => {
    axios.get(`${DiagnosticsBaseUrl}getsalesmapping/`)
      .then(response => {
        const mappings = [...new Set(response.data.map(log => log.salesMapping).filter(Boolean))];
        setSalesMappings(mappings);
      })
      .catch(error => {
        console.error("Error fetching sales mappings:", error);
        setSalesMappings(['Mapping A', 'Mapping B', 'Mapping C']);
      });
  }, []);

  useEffect(() => {
    if (selectedSalesMapping) {
      let apiUrl = `${DiagnosticsBaseUrl}/salesdashboard/?salesMapping=${selectedSalesMapping}`;

      if (filterType === "date") {
        apiUrl += `&date=${format(selectedDate, 'yyyy-MM-dd')}`;
      } else {
        apiUrl += `&month=${format(selectedMonth, 'yyyy-MM')}`;
      }

      axios.get(apiUrl)
        .then(response => {
          setDashboardData(response.data);
        })
        .catch(error => {
          console.error("Error fetching dashboard data:", error);
          setDashboardData({
            totalPatients: 150,
            totalAmount: 25000,
            totalTests: 300,
            testCounts: {
              'Blood Test': 50,
              'X-Ray': 30,
              'MRI': 20,
              'CT Scan': 25,
              'Ultrasound': 35
            },
            monthlyData: [
              { month: 'Jan', revenue: 20000, tests: 280 },
              { month: 'Feb', revenue: 25000, tests: 320 },
              { month: 'Mar', revenue: 30000, tests: 350 },
              { month: 'Apr', revenue: 27000, tests: 310 },
              { month: 'May', revenue: 35000, tests: 400 }
            ]
          });
        });
    }
  }, [selectedSalesMapping, selectedDate, selectedMonth, filterType]);

  useEffect(() => {
    if (dashboardData.totalPatients && dashboardData.totalAmount && dashboardData.totalTests) {
      const totalPatients = dashboardData.totalPatients;
      const totalAmount = dashboardData.totalAmount;
      const totalTests = dashboardData.totalTests;
  
      setAverages({
        patientPerRevenue: totalAmount / totalPatients,
        revenuePerTest: totalAmount / totalTests,
        testsPerPatient: totalTests / totalPatients,
        revenuePerPatient: totalAmount / totalPatients, // Revenue per registered patient
        revenuePercentage: (5 / totalPatients) * totalAmount, // 5 registered patients' revenue percentage
        dailyGrowth: {
          patients: 5.2,
          revenue: 3.8,
          tests: 4.5
        }
      });
    }
  }, [dashboardData]);
  

  const testCountsData = Object.entries(dashboardData.testCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#6366f1', '#4f46e5', '#7c3aed', '#8b5cf6', '#a855f7'];

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          <Title>Sales Analytics Dashboard</Title>
        </Header>

        <FilterTypeToggle>
          <ToggleButton
            active={filterType === "date"}
            onClick={() => setFilterType("date")}
          >
            Daily
          </ToggleButton>
          <ToggleButton
            active={filterType === "month"}
            onClick={() => setFilterType("month")}
          >
            Monthly
          </ToggleButton>
        </FilterTypeToggle>

        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Sales Mapping</FilterLabel>
            <Select 
              value={selectedSalesMapping} 
              onChange={(e) => setSelectedSalesMapping(e.target.value)}
            >
              <option value="">Select Sales Mapping</option>
              {salesMappings.map((mapping, index) => (
                <option key={index} value={mapping}>{mapping}</option>
              ))}
            </Select>
          </FilterGroup>

          {filterType === "date" ? (
            <FilterGroup>
              <FilterLabel>Select Date</FilterLabel>
              <StyledDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </FilterGroup>
          ) : (
            <FilterGroup>
              <FilterLabel>Select Month</FilterLabel>
              <StyledDatePicker
                selected={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
              />
            </FilterGroup>
          )}
        </FiltersContainer>

        <StatsGrid>
          <StatCard>
            <IconWrapper color={theme.colors.primary}>
              <Users size={24} />
            </IconWrapper>
            <StatContent>
              <StatLabel>Total Patients</StatLabel>
              <StatValue>{dashboardData.totalPatients}</StatValue>
            </StatContent>
          </StatCard>

          <StatCard>
            <IconWrapper color={theme.colors.success}>
              <DollarSign size={24} />
            </IconWrapper>
            <StatContent>
              <StatLabel>Total Revenue</StatLabel>
              <StatValue>₹{dashboardData.totalAmount.toLocaleString()}</StatValue>
            </StatContent>
          </StatCard>

          <StatCard>
            <IconWrapper color={theme.colors.warning}>
              <Flask size={24} />
            </IconWrapper>
            <StatContent>
              <StatLabel>Total Tests</StatLabel>
              <StatValue>{dashboardData.totalTests}</StatValue>
            </StatContent>
          </StatCard>
        </StatsGrid>

        <AveragesContainer>
          <AveragesTitle>
            <Calculator size={20} />
            Key Metrics & Averages
          </AveragesTitle>
          <AveragesGrid>
            <AverageCard>
              <AverageLabel>Patients per Revenue</AverageLabel>
              <AverageValue>
                {averages.patientPerRevenue.toFixed(1)}
                <AverageChange isPositive={averages.dailyGrowth.patients > 0}>
                  <TrendingUp size={14} />
                  {averages.dailyGrowth.patients}%
                </AverageChange>
              </AverageValue>
            </AverageCard>

            <AverageCard>
              <AverageLabel>Revenue per Test</AverageLabel>
              <AverageValue>
                ₹{averages.revenuePerTest.toFixed(0)}
                <AverageChange isPositive={averages.dailyGrowth.revenue > 0}>
                  <TrendingUp size={14} />
                  {averages.dailyGrowth.revenue}%
                </AverageChange>
              </AverageValue>
            </AverageCard>

            <AverageCard>
              <AverageLabel>Tests per Patient</AverageLabel>
              <AverageValue>
                {averages.testsPerPatient.toFixed(1)}
                <AverageChange isPositive={averages.dailyGrowth.tests > 0}>
                  <TrendingUp size={14} />
                  {averages.dailyGrowth.tests}%
                </AverageChange>
              </AverageValue>
            </AverageCard>
          </AveragesGrid>
        </AveragesContainer>

    
      </Container>
    </ThemeProvider>
  );
}

export default App;

