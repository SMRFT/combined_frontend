import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { Trash2, Calendar, CreditCard, DollarSign, AlertCircle } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import headerImage from './Images/Header.png';

const DiagnosticsBaseUrl = import.meta.env.VITE_BACKEND_Diagnostics_BASE_URL;

// Styled components with modern design
const Container = styled.div`
 padding: 2rem;
 max-width: 1200px;
 margin: 0 auto;
 font-family: 'Inter', sans-serif;
 color: #334155;
`

const Card = styled.div`
 background: white;
 border-radius: 16px;
 box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
 padding: 1.5rem;
 margin-bottom: 2rem;
 transition: all 0.3s ease;
`

const Header = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 2rem;
 flex-wrap: wrap;
 gap: 1rem;
 
 h2 {
 margin: 0;
 font-weight: 700;
 font-size: 1.75rem;
 color: #1e293b;
 position: relative;
 
 &:after {
 content: '';
 position: absolute;
 bottom: -8px;
 left: 0;
 width: 40px;
 height: 3px;
 background: #6366f1;
 border-radius: 2px;
 }
 }
`

const DatePicker = styled.div`
 display: flex;
 align-items: center;
 background: #f8fafc;
 border-radius: 12px;
 padding: 0.5rem 1rem;
 border: 1px solid #e2e8f0;
 
 input {
 border: none;
 background: transparent;
 font-size: 0.95rem;
 color: #475569;
 padding: 0.5rem;
 outline: none;
 cursor: pointer;
 }
 
 label {
 display: flex;
 align-items: center;
 gap: 0.5rem;
 margin-right: 0.5rem;
 font-weight: 500;
 color: #64748b;
 }
`

const Table = styled.table`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 margin-top: 1rem;
`

const TableHead = styled.thead`
 th {
 padding: 12px 16px;
 text-align: left;
 font-weight: 600;
 color: #64748b;
 border-bottom: 2px solid #e2e8f0;
 font-size: 0.9rem;
 text-transform: uppercase;
 letter-spacing: 0.05em;
 }
`

const TableRow = styled.tr`
 transition: background-color 0.2s;
 
 &:hover {
 background-color: #f8fafc;
 }
`

const TableCell = styled.td`
 padding: 16px;
 border-bottom: 1px solid #e2e8f0;
 color: #334155;
 font-size: 0.95rem;
`

const Button = styled.button`
 padding: 0.6rem 1.2rem;
 background-color: ${(props) => (props.primary ? "#6366f1" : "#f8fafc")};
 color: ${(props) => (props.primary ? "white" : "#475569")};
 border: 1px solid ${(props) => (props.primary ? "#6366f1" : "#e2e8f0")};
 border-radius: 8px;
 cursor: pointer;
 font-weight: 500;
 font-size: 0.9rem;
 transition: all 0.2s;
 display: flex;
 align-items: center;
 gap: 0.5rem;
 
 &:hover {
 background-color: ${(props) => (props.primary ? "#4f46e5" : "#f1f5f9")};
 transform: translateY(-1px);
 }
 
 &:disabled {
 opacity: 0.6;
 cursor: not-allowed;
 transform: none;
 }
`

const ButtonGroup = styled.div`
 display: flex;
 gap: 1rem;
 margin-top: 1.5rem;
`

const BillingForm = styled.div`
 background-color: #f8fafc;
 border-radius: 12px;
 padding: 1.5rem;
 margin-top: 1.5rem;
`

const Fieldset = styled.fieldset`
 border: 1px solid #e2e8f0;
 border-radius: 12px;
 padding: 25px;
 margin: 20px 0;
 background: white;
 box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
 
 h4 {
 text-align: center;
 margin-top: 0;
 margin-bottom: 1.5rem;
 color: #1e293b;
 font-weight: 600;
 font-size: 1.25rem;
 }
`

const FormRow = styled.div`
 display: flex;
 flex-wrap: wrap;
 gap: 1rem;
 margin-bottom: 1.5rem;
 
 @media (max-width: 768px) {
 flex-direction: column;
 }
`

const FormGroup = styled.div`
 flex: 1;
 min-width: 200px;
 
 label {
 display: block;
 margin-bottom: 0.5rem;
 font-weight: 500;
 color: #64748b;
 font-size: 0.9rem;
 }
 
 input, select {
 width: 100%;
 padding: 0.75rem;
 border: 1px solid #e2e8f0;
 border-radius: 8px;
 font-size: 0.95rem;
 color: #334155;
 background-color: #f8fafc;
 transition: all 0.2s;
 
 &:focus {
 outline: none;
 border-color: #6366f1;
 box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
 }
 
 &:disabled {
 background-color: #f1f5f9;
 cursor: not-allowed;
 }
 }
`

const TestSearchContainer = styled.div`
 position: relative;
 width: 100%;
`

const SearchInput = styled.div`
 display: flex;
 align-items: center;
 
 input {
 flex: 1;
 border-top-right-radius: 0;
 border-bottom-right-radius: 0;
 }
 
 button {
 padding: 0.75rem;
 background-color: #6366f1;
 color: white;
 border: 1px solid #6366f1;
 border-radius: 0 8px 8px 0;
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: all 0.2s;
 
 &:hover {
 background-color: #4f46e5;
 }
 }
`

const Dropdown = styled.div`
 position: absolute;
 top: 100%;
 left: 0;
 width: 100%;
 max-height: 200px;
 overflow-y: auto;
 background-color: white;
 border: 1px solid #e2e8f0;
 border-radius: 8px;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 z-index: 10;
 margin-top: 4px;
`

const DropdownItem = styled.div`
 padding: 0.75rem 1rem;
 cursor: pointer;
 transition: background-color 0.2s;
 
 &:hover {
 background-color: #f1f5f9;
 }
`

const TestTable = styled.table`
 width: 100%;
 border-collapse: separate;
 border-spacing: 0;
 margin: 1.5rem 0;
 
 th {
 padding: 12px 16px;
 text-align: left;
 font-weight: 600;
 color: #64748b;
 border-bottom: 2px solid #e2e8f0;
 font-size: 0.9rem;
 }
 
 td {
 padding: 12px 16px;
 border-bottom: 1px solid #e2e8f0;
 color: #334155;
 font-size: 0.95rem;
 }
 
 tr:last-child td {
 border-bottom: none;
 }
`

const DeleteButton = styled.button`
 background: none;
 border: none;
 color: #ef4444;
 cursor: pointer;
 padding: 0.25rem;
 border-radius: 4px;
 transition: all 0.2s;
 
 &:hover {
 background-color: #fee2e2;
 }
`

const Alert = styled.div`
 padding: 1rem;
 border-radius: 8px;
 margin-bottom: 1rem;
 display: flex;
 align-items: center;
 gap: 0.75rem;
 background-color: ${(props) =>
 props.variant === "danger" ? "#fee2e2" : props.variant === "warning" ? "#fef3c7" : "#ecfdf5"};
 color: ${(props) => (props.variant === "danger" ? "#b91c1c" : props.variant === "warning" ? "#92400e" : "#065f46")};
`

const PatientInfo = styled.div`
 display: flex;
 align-items: center;
 gap: 1rem;
 margin-bottom: 1.5rem;
 padding: 1rem;
 background-color: #f1f5f9;
 border-radius: 8px;
 
 div {
 h4 {
 margin: 0 0 0.25rem 0;
 font-size: 1.1rem;
 color: #1e293b;
 }
 
 p {
 margin: 0;
 color: #64748b;
 font-size: 0.9rem;
 }
 }

 .test-details {
 margin-top: 0.5rem;
 padding-top: 0.5rem;
 border-top: 1px dashed #e2e8f0;
 
 h5 {
 margin: 0 0 0.5rem 0;
 font-size: 0.9rem;
 color: #64748b;
 }
 
 .test-tags {
 display: flex;
 flex-wrap: wrap;
 gap: 0.5rem;
 }
 
 .test-tag {
 background-color: #f1f5f9;
 border-radius: 4px;
 padding: 0.25rem 0.5rem;
 font-size: 0.8rem;
 color: #475569;
 }
 }
`

const Badge = styled.span`
 display: inline-block;
 padding: 0.25rem 0.75rem;
 border-radius: 9999px;
 font-size: 0.75rem;
 font-weight: 500;
 background-color: ${(props) => (props.type === "B2B" ? "#dbeafe" : props.type === "Walk-in" ? "#dcfce7" : "#fef3c7")};
 color: ${(props) => (props.type === "B2B" ? "#1e40af" : props.type === "Walk-in" ? "#166534" : "#92400e")};
`

const TestBadge = styled.span`
 display: inline-block;
 padding: 0.15rem 0.5rem;
 border-radius: 4px;
 font-size: 0.7rem;
 background-color: #f1f5f9;
 color: #475569;
 margin-right: 0.25rem;
 margin-bottom: 0.25rem;
`

const TestsContainer = styled.div`
 display: flex;
 flex-wrap: wrap;
 margin-top: 0.5rem;
`

const PaymentOptions = styled.div`
 display: flex;
 flex-wrap: wrap;
 gap: 0.75rem;
 margin-top: 0.5rem;
`

const PaymentOption = styled.div`
 input {
 display: none;
 }
 
 label {
 display: flex;
 align-items: center;
 gap: 0.5rem;
 padding: 0.5rem 1rem;
 border: 1px solid #e2e8f0;
 border-radius: 8px;
 cursor: pointer;
 transition: all 0.2s;
 
 &:hover {
 background-color: #f1f5f9;
 }
 }
 
 input:checked + label {
 background-color: #ede9fe;
 border-color: #8b5cf6;
 color: #6d28d9;
 }
`

// Add a styled component for the existing tests section
const ExistingTestsHeader = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 1rem;
 
 h5 {
 margin: 0;
 color: #1e293b;
 font-weight: 600;
 font-size: 1rem;
 }
 
 span {
 color: #6366f1;
 font-weight: 500;
 font-size: 0.9rem;
 }
`

const PatientBilling = () => {
 const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
 const [patients, setPatients] = useState([])
 const [selectedPatient, setSelectedPatient] = useState(null)
 const [formData, setFormData] = useState({
 testname: [],
 totalAmount: 0,
 discount: "",
 payment_method: "",
 payment_detail: "",
 credit_amount: "",
 PartialPayment: "",
 })
 const [loading, setLoading] = useState(false)
 const [isBillingView, setIsBillingView] = useState(false)
 const storedName = localStorage.getItem("name")
 const [formData2, setFormData2] = useState({
 testname: "",
 amount: "",
 collection_container: "",
 })
 const [testOptions, setTestOptions] = useState([])
 const [filteredOptions, setFilteredOptions] = useState([])
 const [selectedTests, setSelectedTests] = useState([])

 const [showTestMessage, setShowTestMessage] = useState(false)
 const [showPaymentMessage, setShowPaymentMessage] = useState(false)

 useEffect(() => {
 fetchPatients(selectedDate)
 }, [selectedDate])

 useEffect(() => {
 // Fetch test details
 axios
 .get(`${DiagnosticsBaseUrl}test_details/`)
 .then((response) => {
 const normalizedData = response.data.map((test) => ({
 ...test,
 test_name: test["test_name"].trim(),
 }))
 setTestOptions(normalizedData)
 setFilteredOptions(normalizedData)
 })
 .catch((error) => {
 console.error("Error fetching test details:", error)
 toast.error("Failed to load test details")
 })
 }, [])

 // Update total amount whenever selected tests or discount changes
 useEffect(() => {
 calculateTotalAmount()
 }, [selectedTests, formData.discount])

 const fetchPatients = async (date) => {
 setLoading(true)
 try {
 const response = await axios.get(`${DiagnosticsBaseUrl}get_patients/?date=${date}`)

 // Process patients data to ensure tests are properly formatted
 const patientsWithTests = response.data.map((patient) => {
 // Handle tests that might be stored as JSON strings
 let processedTests = []

 if (patient.tests) {
 if (typeof patient.tests === "string") {
 try {
 processedTests = JSON.parse(patient.tests)
 } catch (e) {
 console.error("Error parsing tests JSON:", e)
 processedTests = []
 }
 } else if (Array.isArray(patient.tests)) {
 processedTests = patient.tests
 }
 }

 return {
 ...patient,
 tests: processedTests,
 }
 })

 setPatients(patientsWithTests)
 console.log("Processed patients with tests:", patientsWithTests)
 } catch (error) {
 console.error("Error fetching patients:", error)
 toast.error("Failed to fetch patients")
 } finally {
 setLoading(false)
 }
 }

 // Modify the handleBillingClick function to fetch patient's existing test data
 const handleBillingClick = (patient) => {
 setSelectedPatient(patient)
 setIsBillingView(true)

 // Reset form data when selecting a new patient
 setFormData({
 testname: [],
 totalAmount: 0,
 discount: "",
 payment_method: "",
 payment_detail: "",
 credit_amount: "",
 PartialPayment: "",
 })

 // Initialize selectedTests with patient's existing tests if available
 if (patient.tests && patient.tests.length > 0) {
 // Convert tests to the format expected by selectedTests
 const formattedTests = patient.tests.map((test) => {
 // Handle different possible formats of test data
 if (typeof test === "string") {
 return {
 testname: test,
 collection_container: "N/A",
 amount: 0, // You might want to fetch the actual amount from your test options
 }
 } else if (typeof test === "object") {
 return {
 testname: test.testname || test.test_name || "Unknown Test",
 collection_container: test.collection_container || "N/A",
 amount: Number.parseFloat(test.amount || 0),
 }
 }
 return {
 testname: "Unknown Test",
 collection_container: "N/A",
 amount: 0,
 }
 })

 setSelectedTests(formattedTests)

 // Calculate initial total amount
 const initialTotal = formattedTests.reduce((sum, test) => sum + Number(test.amount), 0)
 setFormData((prev) => ({
 ...prev,
 totalAmount: initialTotal,
 }))

 toast.info(`Loaded ${formattedTests.length} existing tests for this patient`)
 } else {
 setSelectedTests([])
 // Still fetch from API as a fallback
 fetchPatientTests(patient.patient_id)
 }
 }

 const fetchPatientTests = async (patientId) => {
  setLoading(true)
  try {
    const response = await axios.get(`${DiagnosticsBaseUrl}/patient/tests/${patientId}/${selectedDate}/`)
    if (response.data && response.data.testname) {
      // Parse the JSON string if it's stored as a string
      let tests = []
      try {
        if (typeof response.data.testname === "string") {
          tests = JSON.parse(response.data.testname)
        } else if (Array.isArray(response.data.testname)) {
          tests = response.data.testname
        }
        setSelectedTests(tests)
        // Calculate total amount based on existing tests
        const total = tests.reduce((sum, test) => sum + Number(test.amount), 0)
        setFormData((prev) => ({
          ...prev,
          totalAmount: total,
          discount: response.data.discount || "",
          payment_method: response.data.payment_method?.paymentmethod || "", // Fix: Extract string from object
          payment_detail: response.data.payment_method?.creditdetails || "", // Fix: Extract credit details
        }))
        toast.info(`Loaded ${tests.length} existing tests for this patient`)
      } catch (error) {
        console.error("Error parsing test data:", error)
      }
    }
  } catch (error) {
    console.error("Error fetching patient tests:", error)
    // If API endpoint doesn't exist or returns an error, don't show an error toast
    // as the patient might not have any tests yet
  } finally {
    setLoading(false)
  }
}


 const handleChange = (e) => {
 const { name, value } = e.target
 setFormData({ ...formData, [name]: value })

 // Hide payment alert when payment method is selected
 if (name === "payment_method" && value) {
 setShowPaymentMessage(false)
 }

 if (name === "payment_method" && value === "Credit") {
 setFormData((prevData) => ({
 ...prevData,
 credit_amount: prevData.totalAmount,
 }))
 }

 // If the payment method is "PartialPayment", set remainingAmount as credit_amount
 if (name === "payment_method" && value === "PartialPayment") {
 const remainingAmount = formData.PartialPayment?.remainingAmount || formData.totalAmount

 setFormData((prevData) => ({
 ...prevData,
 credit_amount: remainingAmount,
 }))
 }
 }

 const handleTestNameChange = (e) => {
 const input = e.target.value.trim()
 setFormData2({ ...formData2, testname: input, amount: "", collection_container: "" })

 if (input.length >= 1) {
 // Check if input matches a shortcut
 const matchedByShortcut = testOptions.find(
 (test) => test.shortcut && test.shortcut.toLowerCase() === input.toLowerCase(),
 )

 if (matchedByShortcut) {
 // If shortcut matches, set the test name and show only this option
 setFormData2({
 ...formData2,
 testname: matchedByShortcut.test_name,
 amount: "",
 collection_container: "",
 })
 setFilteredOptions([matchedByShortcut])
 } else {
 // Otherwise, filter test names normally
 const filtered = testOptions.filter(
 (test) => test["test_name"] && test["test_name"].toLowerCase().startsWith(input.toLowerCase()),
 )
 setFilteredOptions(filtered)
 }
 } else {
 setFilteredOptions([])
 }

 // Hide test alert when test name is entered
 if (input.trim()) {
 setShowTestMessage(false)
 }
 }

 const handleOptionClick = (selectedTestDetail) => {
 if (!selectedPatient) {
 toast.error("No patient selected.")
 return
 }

 // Determine the amount based on the segment
 let amount = 0
 if (selectedPatient.segment === "B2B") {
 amount = Number(selectedTestDetail["L2L_Rate_Card"] || 0)
 } else if (selectedPatient.segment === "Walk-in" || selectedPatient.segment === "Home Collection") {
 amount = Number(selectedTestDetail["MRP"] || 0)
 } else {
 toast.error("Invalid segment type.")
 return
 }

 const newTest = {
 testname: selectedTestDetail["test_name"],
 collection_container: selectedTestDetail["collection_container"],
 amount: amount,
 }

 const alreadySelected = selectedTests.some((test) => test.testname === newTest.testname)
 if (alreadySelected) {
 toast.error("This test is already selected.")
 return
 }

 setSelectedTests((prev) => [...prev, newTest])
 setFormData2({ testname: "", amount: "", collection_container: "" })
 setFilteredOptions([])
 toast.success("Test added successfully")
 }

 const handleDelete = (index) => {
 const updatedTests = selectedTests.filter((_, i) => i !== index)
 setSelectedTests(updatedTests)
 toast.info("Test removed")
 }

 const calculateTotalAmount = () => {
 const total = selectedTests.reduce((sum, test) => sum + Number(test.amount), 0)
 let discountedTotal = total

 if (typeof formData.discount === "string" && formData.discount.trim().endsWith("%")) {
 // Discount is percentage-based
 const percentage = Number.parseFloat(formData.discount.replace("%", "")) || 0
 discountedTotal = total - total * (percentage / 100)
 } else {
 // Discount is fixed amount
 const fixedDiscount = Number.parseFloat(formData.discount) || 0
 discountedTotal = total - fixedDiscount
 }

 // Ensure the total doesn't go below 0
 discountedTotal = Math.max(0, discountedTotal)

 setFormData((prev) => ({
 ...prev,
 totalAmount: discountedTotal,
 }))
 }

 const handleDiscountChange = (e) => {
 const discountValue = e.target.value
 setFormData((prev) => ({
 ...prev,
 discount: discountValue,
 }))
 }

 const handleSave = () => {
 if (selectedTests.length === 0) {
 setShowTestMessage(true)
 toast.error("Please select at least one test")
 return
 }

 if (!formData.payment_method) {
 setShowPaymentMessage(true)
 toast.error("Please select a payment method")
 return
 }

 handleUpdateBilling()
 }

 const handleUpdateBilling = async () => {
  if (!selectedPatient) return;
  
  setLoading(true);

  // Convert test details to JSON string
  const updatedTestDetails = JSON.stringify(
    selectedTests.map((test) => ({
      testname: test.testname,
      collection_container: test.collection_container,
      amount: test.amount,
      refund: false,
      cancellation: false,
    }))
  );

  // Prepare payment method data in the correct format
  let paymentMethodData = {
    paymentmethod: formData.payment_method,
    [`${formData.payment_method.toLowerCase()}details`]: formData.payment_detail || "",
  };

  // If it's PartialPayment, structure it correctly
  if (formData.payment_method === "PartialPayment") {
    paymentMethodData = {
      paymentmethod: "PartialPayment",
      partialpaymentdetails: "credit", // Set to "credit" explicitly
    };
  }

  // Convert payment method data to JSON string
  const updatedPaymentMethodData = JSON.stringify(paymentMethodData);

  // Convert remainingAmount and credit_amount to integers
  const billingData = {
    testname: updatedTestDetails,
    totalAmount: parseInt(formData.totalAmount, 10) || 0, // Ensure it's an integer
    discount: parseInt(formData.discount, 10) || 0, // Ensure it's an integer
    payment_method: updatedPaymentMethodData, // Store as JSON string
    credit_amount: parseInt(formData.credit_amount, 10) || 0, // Convert to integer
    PartialPayment: JSON.stringify({
      ...formData.PartialPayment,
    }),
  };

  try {
    await axios.patch(
      `${DiagnosticsBaseUrl}/patient/update_billing/${selectedPatient.patient_id}/`,
      billingData
    );
    toast.success("Billing updated successfully!");
    fetchPatients(selectedDate);
    setIsBillingView(false);
  } catch (error) {
    console.error("Error updating billing:", error);
    toast.error("Failed to update billing. Please try again.");
  } finally {
    setLoading(false);
  }
};


 const printRef = useRef();
 const handlePrint = () => {
 // Ensure patient.testname is an array or fallback to an empty array
 const numberToWords = (num) => {
 const a = [
 '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
 const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
 const toWords = (n) => {
 if (n < 20) return a[n];
 if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
 if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + toWords(n % 100) : '');
 return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
 };
 return toWords(num);
 };
 const tableRows = selectedTests?.map((test, index) => `
 <tr>
 <td>${index + 1}</td>
 <td>${test.testname || ''}</td>
 <td>${test.amount || ''}</td>
 </tr>
 `).join('') || '';
 // Ensure other patient properties are defined, using defaults if needed
 const amountInWords = formData.totalAmount
 ? numberToWords(formData.totalAmount) + " Only"
 : 'Zero only';
 <div>{storedName}</div>// Replace with the actual logged-in employee's name
 // Dynamically populate the receipt with patient values
 const printableContent = `
 <html>
 <head>
 <title>Shanmuga Diagnostics</title>
 <style>
 body {
 font-family: Arial, sans-serif;
 margin: 0;
 padding: 0;
 color: #000;
 }
 .container {
 width: 90%;
 margin: 20px auto;
 padding: 10px;
 border: 1px solid #000;
 font-size: 14px;
 }
 .header {
 text-align: center;
 border-bottom: 1px solid #000;
 padding-bottom: 10px;
 margin-bottom: 10px;
 }
 .header h1 {
 margin: 0;
 font-size: 18px;
 }
 .header p {
 margin: 5px 0;
 }
 .header img {
 width: 100%; /* Scale the image to the container's width */
 max-width: 100%; /* Ensures the image doesn't overflow */
 height: auto; /* Maintains the aspect ratio */
 }
 .details,
 .test-info,
 .payment-info {
 width: 100%;
 margin-bottom: 20px;
 }
 .details td,
 .test-info td,
 .payment-info td {
 padding: 5px;
 border-bottom: 1px solid #ddd;
 }
 .details th,
 .test-info th,
 .payment-info th {
 text-align: left;
 }
 .details table,
 .test-info table,
 .payment-info table {
 width: 100%;
 border-collapse: collapse;
 }
 .signature {
 text-align: right; /* Align both elements center */
 font-size: 16px;
 }
 </style>
 </head>
 <body>
 <div class="container">
 <div class="header">
 <img src= ${headerImage} alt="Shanmuga Diagnostics" />
 <h1>BILL CUM RECEIPT</h1>
 <p>Contact No: 9876543210</p>
 </div>
 <div class="details">
 <table id="invoiceTable">
 <tr>
 <td><strong>Invoice Date:</strong> ${selectedPatient.date || 'NIL'}</td>
 <td><strong>Invoice No / Lab ID:</strong> ${selectedPatient.lab_id || 'NIL'}</td>
 </tr>
 <tr>
 <td><strong>Patient ID:</strong> ${selectedPatient.patient_id || 'NIL'}</td>
 <td><strong>Lab Name:</strong> ${selectedPatient.B2B || 'NIL'}</td>
 </tr>
 <tr>
 <td><strong>Name:</strong> ${selectedPatient.patientname || 'NIL'}</td>
 <td><strong>Gender/Age:</strong> ${selectedPatient.gender || 'NIL'}/${selectedPatient.age || 'NIL'} Yrs</td>
 </tr>
 <tr>
 <td><strong>Mobile:</strong> ${selectedPatient.phone || 'NIL'}</td>
 <td><strong>Ref By:</strong> ${selectedPatient.refby || 'SELF'}</td>
 </tr>
 </table>
 <script>
 // Get the table by its ID
 const table = document.getElementById('invoiceTable');
 // Loop through all the <td> elements
 Array.from(table.querySelectorAll('td')).forEach(td => {
 // If the text includes 'NIL', hide the <td>
 if (td.textContent.includes('NIL')) {
 td.style.display = 'none';
 }
 });
 </script>
 </div>
 <div class="test-info">
 <table>
 <thead>
 <tr>
 <th>S.No</th>
 <th>Test Name</th>
 <th>Amount</th>
 </tr>
 </thead>
 <tbody>
 ${tableRows}
 </tbody>
 </table>
 </div>
 <div class="payment-info">
 <table>
 <thead>
 <tr>
 <th>Total Amount</th>
 <th>Mode</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>${formData.totalAmount || 'NIL'}</td>
 <td>
 ${formData.payment_method === 'PartialPayment'
 ? formData.PartialPayment?.method || 'NIL'
 : formData.payment_method || 'NIL'}
 </td>
 </tr>
 </tbody>
 </table>
 <p>Amount Paid in Words: ${amountInWords}</p>
 </div>
 <div class="signature">
 <div class="signature-label">Signature of Employee</div>
 <div class="employee-name">${storedName}</div>
 </div>
 </html>
 `;
 const printWindow = window.open('', '', 'width=1000,height=800');
 printWindow.document.write(printableContent);
 setTimeout(() => {
 printWindow.document.close();
 printWindow.print();
 printWindow.close(); // Close the new window after printing
 }, 1000);
 };
 
 
  
 

 return (
 <Container ref={printRef}>
 <ToastContainer position="top-right" autoClose={3000} />

 <Header>
 <h2>Patient Billing</h2>
 <DatePicker>
 <label>
 <Calendar size={16} />
 Select Date:
 </label>
 <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
 </DatePicker>
 </Header>

 {!isBillingView ? (
 // Patient List Table View
 <Card>
 <h3>Patients for {new Date(selectedDate).toLocaleDateString()}</h3>
 {loading ? (
 <div style={{ textAlign: "center", padding: "2rem" }}>Loading patients...</div>
 ) : (
 <Table>
 <TableHead>
 <tr>
 <th>Patient ID</th>
 <th>Name</th>
 <th>Age/Gender</th>
 <th>Segment</th>
 <th>Action</th>
 </tr>
 </TableHead>
 <tbody>
 {patients.length > 0 ? (
 patients.map((patient) => (
 <TableRow key={patient.patient_id}>
 <TableCell>{patient.patient_id}</TableCell>
 <TableCell>
 {patient.patientname || "Unknown"}
 {patient.tests && patient.tests.length > 0 && (
 <TestsContainer>
 {patient.tests.slice(0, 3).map((test, idx) => (
 <TestBadge key={idx}>
 {typeof test === "string" ? test : test.testname || "Unknown"}
 </TestBadge>
 ))}
 {patient.tests.length > 3 && <TestBadge>+{patient.tests.length - 3} more</TestBadge>}
 </TestsContainer>
 )}
 </TableCell>
 <TableCell>{`${patient.age}/${patient.gender}`}</TableCell>
 <TableCell>
 <Badge type={patient.segment}>{patient.segment}</Badge>
 </TableCell>
 <TableCell>
 <Button primary onClick={() => handleBillingClick(patient)}>
 <CreditCard size={16} />
 Billing
 </Button>
 </TableCell>
 </TableRow>
 ))
 ) : (
 <tr>
 <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
 No patients found for the selected date.
 </td>
 </tr>
 )}
 </tbody>
 </Table>
 )}
 </Card>
 ) : (
 // Billing View
 <Card>
 <PatientInfo>
 <div>
 <h4>{selectedPatient.patientname}</h4>
 <p>
 ID: {selectedPatient.patient_id} • Age/Gender: {selectedPatient.age}/{selectedPatient.gender} •{" "}
 <Badge type={selectedPatient.segment}>{selectedPatient.segment}</Badge>
 </p>

 {selectedPatient.tests && selectedPatient.tests.length > 0 && (
 <div className="test-details">
 <h5>Existing Tests:</h5>
 <div className="test-tags">
 {selectedPatient.tests.map((test, index) => (
 <span key={index} className="test-tag">
 {typeof test === "string" ? test : test.testname || "Unknown Test"}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </PatientInfo>

 <BillingForm>
 <Fieldset>
 <h4>Billing Information</h4>

 {showTestMessage && (
 <Alert variant="danger">
 <AlertCircle size={18} />
 Please select at least one test to generate the bill.
 </Alert>
 )}

 {/* Test selection input */}
 <FormRow>
 <FormGroup>
 <label>Test Name</label>
 <TestSearchContainer>
 <SearchInput>
 <input
 type="text"
 value={formData2.testname}
 onChange={handleTestNameChange}
 placeholder="Type Test Name or Shortcut"
 />
 </SearchInput>

 {formData2.testname.length > 0 && filteredOptions.length > 0 && (
 <Dropdown>
 {filteredOptions.map((option, index) => (
 <DropdownItem key={index} onClick={() => handleOptionClick(option)}>
 {option.test_name}
 </DropdownItem>
 ))}
 </Dropdown>
 )}

 {filteredOptions.length === 0 && formData2.testname && (
 <div style={{ color: "#ef4444", marginTop: "0.5rem", fontSize: "0.9rem" }}>No test found.</div>
 )}
 </TestSearchContainer>
 </FormGroup>
 </FormRow>

 {/* Selected Tests Table */}
 {selectedTests.length > 0 && (
 <>
 <ExistingTestsHeader>
 <h5>Existing Tests</h5>
 <span>{selectedTests.length} Tests</span>
 </ExistingTestsHeader>
 <TestTable>
 <thead>
 <tr>
 <th>Test Name</th>
 <th>Container</th>
 <th style={{ textAlign: "right" }}>Amount</th>
 <th style={{ textAlign: "center" }}>Actions</th>
 </tr>
 </thead>
 <tbody>
 {selectedTests.map((test, index) => (
 <tr key={index}>
 <td>{test.testname}</td>
 <td>{test.collection_container || "N/A"}</td>
 <td style={{ textAlign: "right" }}>${test.amount.toFixed(2)}</td>
 <td style={{ textAlign: "center" }}>
 <DeleteButton onClick={() => handleDelete(index)}>
 <Trash2 size={16} />
 </DeleteButton>
 </td>
 </tr>
 ))}
 </tbody>
 </TestTable>
 </>
 )}

 {/* Payment Section */}
 {selectedTests.length > 0 && (
 <>
 <FormRow>
 <FormGroup>
 <label>Payment Method</label>
 <select name="payment_method" value={formData.payment_method} onChange={handleChange}>
 <option value="">Select Payment Method</option>
 <option value="Cash">Cash</option>
 <option value="UPI">UPI</option>
 <option value="Credit">Credit</option>
 <option value="Neft">Neft</option>
 <option value="Cheque">Cheque</option>
 <option value="PartialPayment">Partial Payment</option>
 </select>

 {showPaymentMessage && (
 <Alert variant="warning">
 <AlertCircle size={18} />
 Please select a payment method.
 </Alert>
 )}
 </FormGroup>

 {formData.payment_method && formData.payment_method !== "Cash" && (
 <FormGroup>
 <label>{formData.payment_method} Details</label>
 <input
 type="text"
 name="payment_detail"
 placeholder={`Enter ${formData.payment_method} details`}
 value={formData.payment_detail}
 onChange={handleChange}
 />
 </FormGroup>
 )}
 </FormRow>

 <FormRow>
 <FormGroup>
 <label>Discount (%, or Amount)</label>
 <input
 type="text"
 name="discount"
 value={formData.discount}
 onChange={handleDiscountChange}
 placeholder="Enter discount (e.g., 10% or 50)"
 disabled={selectedPatient.segment === "B2B"}
 />
 </FormGroup>

 <FormGroup>
 <label>Total Amount</label>
 <input
 type="text"
 name="totalAmount"
 value={`$${formData.totalAmount.toFixed(2)}`}
 readOnly
 disabled
 />
 </FormGroup>
 </FormRow>
 </>
 )}

 {/* Partial Payment Section */}
 {formData.payment_method === "PartialPayment" && (
 <>
 <FormRow>
 <FormGroup>
 <label>Partial Payment Options</label>
 <PaymentOptions>
 {["Cash", "UPI", "Neft", "Cheque"].map((method) => (
 <PaymentOption key={method}>
 <input
 type="radio"
 name="partialPaymentOption"
 id={method}
 value={method}
 onChange={(e) =>
 setFormData((prevData) => ({
 ...prevData,
 PartialPayment: {
 ...prevData.PartialPayment,
 method: e.target.value,
 },
 }))
 }
 checked={formData.PartialPayment?.method === method}
 />
 <label htmlFor={method}>
 {method === "Cash" ? <DollarSign size={16} /> : <CreditCard size={16} />}
 {method}
 </label>
 </PaymentOption>
 ))}
 </PaymentOptions>
 </FormGroup>
 </FormRow>

 {formData.PartialPayment?.method && (
 <FormRow>
 <FormGroup>
 <label>Amount to Pay Now</label>
 <input
 type="number"
 name="credit"
 value={formData.PartialPayment.credit || ""}
 onChange={(e) => {
 const creditValue = Number(e.target.value)
 const remaining = formData.totalAmount - creditValue
 setFormData((prevData) => ({
 ...prevData,
 PartialPayment: {
 ...prevData.PartialPayment,
 credit: creditValue,
 remainingAmount: remaining > 0 ? remaining.toFixed(2) : "0.00",
 },
 credit_amount: remaining > 0 ? remaining.toFixed(2) : "0.00",
 }))
 }}
 placeholder="Enter amount to pay now"
 />
 </FormGroup>

 <FormGroup>
 <label>Remaining Amount</label>
 <input
 type="text"
 name="remainingAmount"
 value={
 formData.PartialPayment.remainingAmount ? `$${formData.PartialPayment.remainingAmount}` : ""
 }
 readOnly
 disabled
 />
 </FormGroup>
 </FormRow>
 )}
 </>
 )}

 <ButtonGroup>
 <Button onClick={() => setIsBillingView(false)}>Back to Patients</Button>
 <Button primary onClick={handleSave} disabled={loading}>
 {loading ? "Processing..." : "Update Billing"}
 </Button>
 <Button primary onClick={handlePrint}>
 Print
 </Button>
 </ButtonGroup>
 </Fieldset>
 </BillingForm>
 </Card>
 )}
 </Container>
 )
}

export default PatientBilling