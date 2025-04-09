import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import styled from 'styled-components';
import Sidebar from "./Components/Navbar/Sidebar";
import Dashboard from "./Components/Diagnostic/Dashboard";
import Login from "./Components/Login/Login";
import SignOut from "./Components/Diagnostic/SignOut";
import Admin from "./Components/Global/Admin";
import Profile from "./Components/Global/Profile";
import PatientForm from './Components/Diagnostic/PatientForm';

// Wrapper for the main content to shift it to the right of the sidebar
const ContentWrapper = styled.div`
  margin-top: 15px;
  padding: 20px;
  margin-left: 260px;

  @media (max-width: 1024px) {
    margin-left: 200px;
  }

  @media (max-width: 768px) {
    margin-left: 100px;
  }

  @media (max-width: 480px) {
    margin-left: 20px;
  }
`;

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
    {!isLoginPage && <Sidebar />}
    {isLoginPage ? (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    ) : (
      <ContentWrapper>
        <Routes>
      
          <Route path="/Dashboard" element={< Dashboard/>} />
          <Route path="/SignOut" element={<SignOut/>} />
          <Route path="/Admin" element={<Admin/>} />
          <Route path="/Profile" element={<Profile/>} />

         <Route path="/PatientForm" element={<PatientForm/>} />
          {/* <Route path="/SampleCollectorForm" element={<SampleCollectorForm />} />
          <Route path="/ClinicalName" element={<ClinicalName />} />
          <Route path="/RefBy" element={<RefBy />} />
          
          <Route path="/PrintBill" element={<PrintBill />} />
          <Route path="/SampleStatus" element={<SampleStatus />} />
          <Route path="/BarcodeGeneration" element={<BarcodeGeneration />} />
          <Route path="/BarcodeTestDetails" element={<BarcodeTestDetails />} />
          <Route path="/PatientOverview" element={<PatientOverview />} />
          <Route path="/PatientDetails" element={<PatientDetails />} />
          <Route path="/TestDetails" element={<TestDetailsForm />} />
          <Route path="/SampleStatusUpdate" element={<SampleStatusUpdate />} />
          <Route path="/TestEdit" element={<TestEdit />} />
          <Route path="/PatientList" element={<PatientList />} />
          <Route path="/DoctorForm" element={<DoctorForm />} />
          <Route path="/Invoice" element={<Invoicemain />} />
          <Route path="/CashTally" element={<CashTally />} />
          <Route path="/PatientOverallReport" element={<PatientOverallReport />} />
          <Route path="/SalesVisitDashboard" element={<SalesVisitDashboard />} />
          <Route path="/SalesVisitLog" element={<SalesVisitLog />} />
          <Route path="/SalesVisitLogReport" element={<SalesVisitLogReport />} />
          <Route path="/SalesReport" element={<SalesReport />} />
          <Route path="/LogisticManagementAdmin" element={<LogisticManagementAdmin />} />
          <Route path="/LogisticManagementApproval" element={<LogisticManagementApproval />} />
          <Route path="/PatientEditForm" element={<PatientEditForm />} />
          <Route path="/MIS" element={<MIS />} />
          <Route path="/SalesDashboard" element={<SalesDashboard />} />
          <Route path="/LogisticsDashboard" element={<LogisticsDashboard />} />
          <Route path="/LogisticsTAT" element={<LogisticsTAT />} />
          <Route path="/Refund" element={<Refund />} />
          <Route path="/Cancellation" element={<Cancellation />} />
          <Route path="/PatientBilling" element={<PatientBilling />} />
          <Route path="/B2B" element={<B2B />} />
          <Route path="/B2BApproval" element={<B2BApproval />} />
          <Route path="/B2BFinalApproval" element={<B2BFinalApproval />} />
          <Route path="/PatientTAT" element={<PatientTAT />} />
         
          <Route path="/EmployeeList" element={<EmployeeList/>} /> */}
          
          
        </Routes>
      </ContentWrapper>
    )}
  </>
  );
}

export default App;