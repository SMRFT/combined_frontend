import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import styled from 'styled-components';
import Sidebar from "./Components/Navbar/Sidebar";
import Dashboard from "./Components/Diagnostic/Dashboard";
import Login from "./Components/Login/Login";
import SignOut from "./Components/Diagnostic/SignOut";
import Admin from "./Components/Global/Admin";
import Profile from "./Components/Global/Profile";
import PatientForm from './Components/Diagnostic/PatientForm';
import EmployeeList from "./Components/Global/EmployeeList";
import B2B from "./Components/Diagnostic/B2B";
import B2BApproval from "./Components/Diagnostic/B2BApproval";
import BarcodeGeneration from "./Components/Diagnostic/BarcodeGeneration";
import PrintBill from "./Components/Diagnostic/PrintBill";
import BarcodeTestDetails from "./Components/Diagnostic/BarcodeTestDetails";
import SampleCollectorForm from "./Components/Diagnostic/SampleCollectorForm";
import SampleStatus from "./Components/Diagnostic/SampleStatus";
import SampleStatusUpdate from "./Components/Diagnostic/SampleStatusUpdate";
import PatientDetails from "./Components/Diagnostic/PatientDetails";
import TestDetails from "./Components/Diagnostic/TestDetails";
import PatientList from "./Components/Diagnostic/PatientList";
import SalesVisitLog from "./Components/Diagnostic/SalesVisitLog";
import SalesVisitLogReport from "./Components/Diagnostic/SalesVisitLogReport";
import SalesReport from "./Components/Diagnostic/SalesReport";
import SalesVisitDashboard from "./Components/Diagnostic/SalesVisitDashboard";
import LogisticManagementAdmin from "./Components/Diagnostic/LogisticManagementAdmin";
import LogisticManagementApproval from "./Components/Diagnostic/LogisticManagementApproval";
import LogisticsDashboard from "./Components/Diagnostic/LogisticsDashboard";
import LogisticsTAT from "./Components/Diagnostic/LogisticsTAT";
import Cancellation from "./Components/Diagnostic/Cancellation";
import CashTally from "./Components/Diagnostic/CashTally";
import Invoicemain from "./Components/Diagnostic/Invoicemain";
import PatientOverview from "./Components/Diagnostic/PatientOverview";
import ClinicalName from "./Components/Diagnostic/ClinicalName";
import RefBy  from "./Components/Diagnostic/RefBy";
import TestEdit from "./Components/Diagnostic/TestEdit";
import DoctorForm from "./Components/Diagnostic/DoctorForm";


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
     
            {/* Global */}

          
          <Route path="/Admin" element={<Admin/>} />
          <Route path="/Profile" element={<Profile/>} />
          <Route path="/EmployeeList" element={<EmployeeList/>} />


            {/* Diagnostic */}

         <Route path="/PatientForm" element={<PatientForm/>} />
         <Route path="/Dashboard" element={< Dashboard/>} />
         <Route path="/SignOut" element={<SignOut/>} />
          <Route path="/B2B" element={<B2B />} />
          <Route path="/B2BApproval" element={<B2BApproval />} />
          <Route path="/BarcodeGeneration" element={<BarcodeGeneration />} />
          <Route path="/PrintBill" element={<PrintBill />} />
          <Route path="/BarcodeTestDetails" element={<BarcodeTestDetails />} />
          <Route path="/SampleCollectorForm" element={<SampleCollectorForm />} />
          <Route path="/SampleStatus" element={<SampleStatus />} />
          <Route path="/SampleStatusUpdate" element={<SampleStatusUpdate />} />
          <Route path="/PatientDetails" element={<PatientDetails />} />
          <Route path="/TestDetails" element={<TestDetails />} />
          <Route path="/PatientList" element={<PatientList />} />
          <Route path="/SalesVisitLog" element={<SalesVisitLog />} />
          <Route path="/SalesVisitLogReport" element={<SalesVisitLogReport />} />
          <Route path="/SalesReport" element={<SalesReport />} />
          <Route path="/SalesVisitDashboard" element={<SalesVisitDashboard />} />
          <Route path="/LogisticManagementAdmin" element={<LogisticManagementAdmin />} />
          <Route path="/LogisticManagementApproval" element={<LogisticManagementApproval />} />
          <Route path="/LogisticsDashboard" element={<LogisticsDashboard />} />
          <Route path="/LogisticsTAT" element={<LogisticsTAT />} />
          <Route path="/Cancellation" element={<Cancellation />} />
          <Route path="/CashTally" element={<CashTally />} />
          <Route path="/Invoicemain" element={<Invoicemain />} />
          <Route path="/PatientOverview" element={<PatientOverview/>} />
          <Route path="/ClinicalName" element={<ClinicalName />} />
          <Route path="/RefBy" element={<RefBy />} />
          <Route path="/TestEdit" element={<TestEdit />} />
          <Route path="/DoctorForm" element={<DoctorForm />} />
          

          {/* 
         
              
                
         
          
          <Route path="/PatientOverallReport" element={<PatientOverallReport />} />
          <Route path="/PatientEditForm" element={<PatientEditForm />} />
          <Route path="/MIS" element={<MIS />} />
          <Route path="/SalesDashboard" element={<SalesDashboard />} />

        
          <Route path="/Refund" element={<Refund />} />
          
          <Route path="/PatientBilling" element={<PatientBilling />} />
          
          
          <Route path="/B2BFinalApproval" element={<B2BFinalApproval />} />
          <Route path="/PatientTAT" element={<PatientTAT />} />
         
          */}
          
          
        </Routes>
      </ContentWrapper>
    )}
  </>
  );
}

export default App;