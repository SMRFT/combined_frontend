"use client"

import { useState, useRef, useEffect, Fragment } from "react"
import styled, { createGlobalStyle } from "styled-components"
import axios from "axios"
import moment from "moment"
import { Combobox, Transition } from "@headlessui/react"

import {
  Save,
  User,
  Phone,
  Heart,
  Users,
  Building,
  Briefcase,
  CreditCard,
  Mail,
  Calendar,
  Camera,
  Plus,
  Trash2,
  Upload,
  Building2,
  Check,
  ChevronDown,
  X,
} from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`

const CardHeader = styled.div`
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  padding: 1rem 1.5rem;
`

const CardTitle = styled.h1`
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`

const CardSubtitle = styled.p`
  color: #bfdbfe;
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #e5e7eb;
`

const TabButton = styled.button`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: ${(props) => (props.active ? "#2563eb" : "#6b7280")};
  border-bottom: ${(props) => (props.active ? "2px solid #2563eb" : "none")};
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  &:hover {
    color: ${(props) => (props.active ? "#2563eb" : "#374151")};
  }
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`

const TabIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`

const FormContainer = styled.form`
  padding: 1.5rem;
`

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`

const SectionIcon = styled.span`
  margin-right: 0.5rem;
  color: #2563eb;
  display: flex;
  align-items: center;
`

const SectionDescription = styled.p`
  color: #6b7280;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
`

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`

const ProfileImageWrapper = styled.div`
  position: relative;
`

const ProfileImage = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid #dbeafe;
  cursor: pointer;
`

const ProfileImageButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #2563eb;
  border-radius: 9999px;
  padding: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`

const FormGroup = styled.div`
  margin-bottom: 0;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`

const InputGroup = styled.div`
  display: flex;
`

const InputAddon = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0 0.75rem;
  background-color: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-right: 0;
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
`

const InputWithAddon = styled(Input)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`

const DatePickerWithAddon = styled(StyledDatePicker)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
`

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
`

const RadioInput = styled.input`
  height: 1rem;
  width: 1rem;
  color: #2563eb;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`

const RadioText = styled.span`
  margin-left: 0.5rem;
  color: #374151;
`

const QualificationCard = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  margin-bottom: 1rem;
`

const QualificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const QualificationTitle = styled.h3`
  font-weight: 500;
  color: #374151;
  margin: 0;
`

const RemoveButton = styled.button`
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  &:hover {
    color: #b91c1c;
  }
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #eff6ff;
  color: #2563eb;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #dbeafe;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
`

const AddButtonIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #f9fafb;
  }
`

const UploadIcon = styled.span`
  margin-right: 0.5rem;
  color: #6b7280;
  display: flex;
  align-items: center;
`

const UploadText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

const FileName = styled.span`
  margin-left: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
`

const SubmitButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`

const SubmitButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #1d4ed8;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(255, 255, 255, 1);
  }
`

const SubmitButtonIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`

// Combobox styled components
const ComboboxContainer = styled.div`
  position: relative;
  width: 100%;
`

const ComboboxButton = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
  text-align: left;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    outline: none;
  }
`

const ComboboxButtonWithAddon = styled(ComboboxButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const ComboboxOptions = styled.ul`
  position: absolute;
  z-index: 10;
  margin-top: 0.25rem;
  max-height: 15rem;
  width: 100%;
  overflow-y: auto;
  border-radius: 0.375rem;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0.5rem 0;
  border: 1px solid #e5e7eb;
`

const ComboboxOption = styled.li`
  cursor: pointer;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &[data-selected="true"] {
    background-color: #eff6ff;
    font-weight: 500;
  }
`

const ComboboxInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 0;
  background-color: transparent;
`

const SelectedItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #eff6ff;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #2563eb;
`

const RemoveItemButton = styled.button`
  display: flex;
  align-items: center;
  margin-left: 0.25rem;
  color: #4b5563;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  
  &:hover {
    color: #ef4444;
  }
`

function Profile() {
  const fileInputRef = useRef(null)
  const [profileImage, setProfileImage] = useState(null)

  const [formData, setFormData] = useState({
    employeeId: "",
    profileImage: "",
    employeeName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    mobileNumber: "",
    bloodGroup: "",
    maritalStatus: "",
    guardianNumber: "",
    dateOfBirth: null,
    email: "",
    aadhaarNumber: "",
    panNumber: "",
    department: "",
    designation: "",
    primaryRole: "",
    additionalRoles: [],
    additionalRoleNames: [], // Add this missing array
    dataEntitlements: [],
    dataEntitlementNames: [], // Also add this for consistency
  })

  // State for roles
  const [primaryRoleQuery, setPrimaryRoleQuery] = useState("")
  const [primaryRoleOptions, setPrimaryRoleOptions] = useState([])
  const [additionalRolesQuery, setAdditionalRolesQuery] = useState("")
  const [additionalRoleOptions, setAdditionalRoleOptions] = useState([])

  // Fetch roles from the backend
  // Update the roles fetch to include full role objects
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/getprimaryandadditionalrole/")
        const roles = response.data.designations || []

        // Filter active roles and keep full objects
        const activeRoles = roles.filter((role) => role.is_active === true)
        setPrimaryRoleOptions(activeRoles)
        setAdditionalRoleOptions(activeRoles)
      } catch (error) {
        console.error("Error fetching roles:", error)
      }
    }

    fetchRoles()
  }, [])

  // Filter primary roles based on search query
  const filteredPrimaryRoles =
    primaryRoleQuery === ""
      ? primaryRoleOptions.map((role) => role.role_name)
      : primaryRoleOptions
          .filter((role) => role.role_name.toLowerCase().includes(primaryRoleQuery.toLowerCase()))
          .map((role) => role.role_name)

  // Filter additional roles based on search query
  const filteredAdditionalRoles =
    additionalRolesQuery === ""
      ? additionalRoleOptions.map((role) => role.role_name)
      : additionalRoleOptions
          .filter((role) => role.role_name.toLowerCase().includes(additionalRolesQuery.toLowerCase()))
          .map((role) => role.role_name)

  // Update the primary role handling
  const handlePrimaryRoleChange = (selectedRoleName) => {
    const roleObj = primaryRoleOptions.find((role) => role.role_name === selectedRoleName)
    if (roleObj) {
      setFormData((prev) => ({
        ...prev,
        primaryRole: roleObj.role_code,
        primaryRoleName: roleObj.role_name,
      }))
    }
  }

  // Update additional role handling
  const handleAddAdditionalRole = (roleName) => {
    const roleObj = additionalRoleOptions.find((role) => role.role_name === roleName)
    if (roleObj && !formData.additionalRoles.includes(roleObj.role_code)) {
      setFormData((prev) => ({
        ...prev,
        additionalRoles: [...prev.additionalRoles, roleObj.role_code],
        additionalRoleNames: Array.isArray(prev.additionalRoleNames)
          ? [...prev.additionalRoleNames, roleObj.role_name]
          : [roleObj.role_name],
      }))
    }
    setAdditionalRolesQuery("")
  }

  // Update remove additional role handling
  const handleRemoveAdditionalRole = (roleName) => {
    const roleObj = additionalRoleOptions.find((role) => role.role_name === roleName)
    if (roleObj) {
      setFormData((prev) => ({
        ...prev,
        additionalRoles: prev.additionalRoles.filter((code) => code !== roleObj.role_code),
        additionalRoleNames: prev.additionalRoleNames.filter((name) => name !== roleName),
      }))
    }
  }

  const [dataEntitlementsQuery, setDataEntitlementsQuery] = useState("")

  const [qualifications, setQualifications] = useState([
    { id: 1, degree: "", institution: "", passedOut: "", percentage: "" },
  ])

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: "",
      position: "",
      yearsOfExperience: "",
      fromDate: null,
      toDate: null,
      certificate: null,
      certificateName: "",
    },
  ])

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    branch: "",
  })

  const [activeTab, setActiveTab] = useState("personal")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleDateChange = (date, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date ? moment(date).format("YYYY-MM-DD") : null,
    }))
  }

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target
    setBankDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleQualificationChange = (id, field, value) => {
    setQualifications((prevQualifications) =>
      prevQualifications.map((qual) => (qual.id === id ? { ...qual, [field]: value } : qual)),
    )
  }

  const addQualification = () => {
    const newId = qualifications.length > 0 ? Math.max(...qualifications.map((q) => q.id)) + 1 : 1

    setQualifications([...qualifications, { id: newId, degree: "", institution: "", passedOut: "", percentage: "" }])
  }

  const removeQualification = (id) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((qual) => qual.id !== id))
    }
  }

  const handleExperienceChange = (id, field, value) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    )
  }

  const handleExperienceDateChange = (date, id, field) => {
    setExperiences((prevExperiences) => prevExperiences.map((exp) => (exp.id === id ? { ...exp, [field]: date } : exp)))
  }

  const addExperience = () => {
    const newId = experiences.length > 0 ? Math.max(...experiences.map((e) => e.id)) + 1 : 1

    setExperiences([
      ...experiences,
      {
        id: newId,
        company: "",
        position: "",
        yearsOfExperience: "",
        fromDate: null,
        toDate: null,
        certificate: null,
        certificateName: "",
      },
    ])
  }

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id))
    }
  }

  const handleCertificateUpload = (e, id) => {
    const file = e.target.files?.[0]
    if (file) {
      setExperiences((prevExperiences) =>
        prevExperiences.map((exp) =>
          exp.id === id
            ? {
                ...exp,
                certificate: file,
                certificateName: file.name,
              }
            : exp,
        ),
      )
    }
  }

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Update data entitlement handling
  const handleAddDataEntitlement = (entitlementName) => {
    const entitlementObj = dataEntitlementOptions.find((ent) => ent.DataEntitlements === entitlementName)
    if (entitlementObj && !formData.dataEntitlements.includes(entitlementObj.DataEntitlementsCode)) {
      setFormData((prev) => ({
        ...prev,
        dataEntitlements: [...prev.dataEntitlements, entitlementObj.DataEntitlementsCode],
        dataEntitlementNames: [...prev.dataEntitlementNames, entitlementObj.DataEntitlements],
      }))
    }
    setDataEntitlementsQuery("")
  }

  // Update remove data entitlement handling
  const handleRemoveDataEntitlement = (entitlementName) => {
    const entitlementObj = dataEntitlementOptions.find((ent) => ent.DataEntitlements === entitlementName)
    if (entitlementObj) {
      setFormData((prev) => ({
        ...prev,
        dataEntitlements: prev.dataEntitlements.filter((code) => code !== entitlementObj.DataEntitlementsCode),
        dataEntitlementNames: prev.dataEntitlementNames.filter((name) => name !== entitlementName),
      }))
    }
  }
  const [departmentsData, setDepartmentsData] = useState([])
  const [departmentNameKey, setDepartmentNameKey] = useState("")

  // Update the department handling
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get_data_departments/")
        const allDepartments = response.data.departments
        const activeDepartments = allDepartments.filter((item) => item.is_active)
        setDepartmentsData(activeDepartments)
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }
    fetchDepartments()
  }, [])

  // Update department change handler
  const handleDepartmentChange = (e) => {
    const selectedDept = departmentsData.find((dept) => dept.department_code === e.target.value)
    setFormData((prev) => ({
      ...prev,
      department: selectedDept.department_code,
      departmentName: selectedDept.department_name,
    }))
  }

  const [designationsData, setDesignationsData] = useState([])
  const [designationOptions, setDesignationOptions] = useState([])

  // Update designation handling
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get_data_designation/")
        const data = response.data.designations
        const activeDesignations = data.filter((item) => item.is_active)
        setDesignationsData(activeDesignations)
      } catch (error) {
        console.error("Error fetching designations:", error)
      }
    }
    fetchDesignations()
  }, [])

  // Update designation change handler
  const handleDesignationChange = (e) => {
    const selectedDesig = designationsData.find((desig) => desig.Designation_code === e.target.value)
    setFormData((prev) => ({
      ...prev,
      designation: selectedDesig.Designation_code,
      designationName: selectedDesig.designation,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", {
      personalInfo: formData,
      qualifications,
      experiences,
      bankDetails,
    })
    // Here you would typically send the data to a server
    alert("Profile data saved successfully!")
  }

  const submitProfile = async () => {
    const profileData = {
      ...formData,
      bankDetails,
      qualifications,
      experiences,
      // Ensure we're sending codes, not names
      department: formData.department,
      designation: formData.designation,
      primaryRole: formData.primaryRole,
      additionalRoles: formData.additionalRoles,
      dataEntitlements: formData.dataEntitlements,
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/create_employee/", profileData, {
        headers: { "Content-Type": "application/json", "authorization":"test", "data-code":"global" },
      })
      console.log("Profile Created:", response.data)
    } catch (error) {
      console.error("Error creating profile:", error.response?.data || error.message)
    }
  }
  const [dataEntitlementOptions, setDataEntitlementOptions] = useState([])
  const [allDataEntitlements, setAllDataEntitlements] = useState([])
  const [dataEntitlementNameKey, setDataEntitlementNameKey] = useState("")

  useEffect(() => {
    const fetchDataEntitlements = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/data-entitlements/")
        setDataEntitlementOptions(response.data.dataEntitlements) // Ensure this is correctly mapped
      } catch (error) {
        console.error("Error fetching data entitlements:", error)
      }
    }

    fetchDataEntitlements()
  }, [])

  const filteredDataEntitlements =
    dataEntitlementsQuery === ""
      ? dataEntitlementOptions.map((entitlement) => entitlement.DataEntitlements) // Map only the names
      : dataEntitlementOptions
          .filter((entitlement) =>
            entitlement.DataEntitlements.toLowerCase().includes(dataEntitlementsQuery.toLowerCase()),
          )
          .map((entitlement) => entitlement.DataEntitlements) // Map filtered names

  return (
    <>
      <GlobalStyle />
      <Container>
        <ContentWrapper>
          <Card>
            {/* Header */}
            <CardHeader>
              <CardTitle>Employee Profile</CardTitle>
              <CardSubtitle>Complete your profile information</CardSubtitle>
            </CardHeader>

            {/* Tabs */}
            <TabsContainer>
              <TabButton active={activeTab === "personal"} onClick={() => setActiveTab("personal")}>
                <TabIcon>
                  <User size={16} />
                </TabIcon>
                Personal Information
              </TabButton>
              <TabButton active={activeTab === "qualification"} onClick={() => setActiveTab("qualification")}>
                <TabIcon>
                  <Building size={16} />
                </TabIcon>
                Qualification
              </TabButton>
              <TabButton active={activeTab === "experience"} onClick={() => setActiveTab("experience")}>
                <TabIcon>
                  <Briefcase size={16} />
                </TabIcon>
                Experience
              </TabButton>
              <TabButton active={activeTab === "bank"} onClick={() => setActiveTab("bank")}>
                <TabIcon>
                  <CreditCard size={16} />
                </TabIcon>
                Bank Details
              </TabButton>
            </TabsContainer>

            {/* Form */}
            <FormContainer onSubmit={handleSubmit}>
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <>
                  <SectionTitle>
                    <SectionIcon>
                      <User size={20} />
                    </SectionIcon>
                    Personal Information
                  </SectionTitle>

                  {/* Profile Image Upload */}
                  <ProfileImageContainer>
                    <ProfileImageWrapper>
                      <ProfileImage onClick={triggerFileInput}>
                        {profileImage ? (
                          <img
                            src={profileImage || "/placeholder.svg"}
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <Camera size={40} color="#9ca3af" />
                        )}
                      </ProfileImage>
                      <ProfileImageButton onClick={triggerFileInput}>
                        <Camera size={16} color="white" />
                      </ProfileImageButton>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                      />
                    </ProfileImageWrapper>
                  </ProfileImageContainer>

                  <FormGrid>
                    <FormGroup>
                      <Label htmlFor="employeeId">Employee ID*</Label>
                      <Input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                        placeholder="Enter employee ID"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="employeeName">Employee Name*</Label>
                      <Input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="email">Email ID*</Label>
                      <InputGroup>
                        <InputAddon>
                          <Mail size={16} />
                        </InputAddon>
                        <InputWithAddon
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Enter email address"
                        />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                      <InputGroup>
                        <InputAddon>
                          <Calendar size={16} />
                        </InputAddon>
                        <DatePickerWithAddon
                          selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                          onChange={(date) => handleDateChange(date, "dateOfBirth")}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select date of birth"
                          showYearDropdown
                          dropdownMode="select"
                          required
                        />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="fatherName">Father's Name*</Label>
                      <Input
                        type="text"
                        id="fatherName"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        required
                        placeholder="Enter father's name"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="motherName">Mother's Name*</Label>
                      <Input
                        type="text"
                        id="motherName"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        required
                        placeholder="Enter mother's name"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Gender*</Label>
                      <RadioGroup>
                        <RadioLabel>
                          <RadioInput
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleChange}
                          />
                          <RadioText>Male</RadioText>
                        </RadioLabel>
                        <RadioLabel>
                          <RadioInput
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleChange}
                          />
                          <RadioText>Female</RadioText>
                        </RadioLabel>
                      </RadioGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="mobileNumber">Mobile Number*</Label>
                      <InputGroup>
                        <InputAddon>
                          <Phone size={16} />
                        </InputAddon>
                        <InputWithAddon
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          required
                          placeholder="Enter mobile number"
                        />
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="aadhaarNumber">Aadhaar Number*</Label>
                      <Input
                        type="text"
                        id="aadhaarNumber"
                        name="aadhaarNumber"
                        value={formData.aadhaarNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter 12-digit Aadhaar number"
                        maxLength={12}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        type="text"
                        id="panNumber"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        placeholder="Enter PAN number"
                        maxLength={10}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="department">Department*</Label>
                      <InputGroup>
                        <InputAddon>
                          <Building2 size={16} />
                        </InputAddon>
                        <Select
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleDepartmentChange}
                          required
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        >
                          <option value="">Select department</option>
                          {departmentsData.map((dept) => (
                            <option key={dept.department_code} value={dept.department_code}>
                              {dept.department_name}
                            </option>
                          ))}
                        </Select>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="designation">Designation*</Label>
                      <InputGroup>
                        <InputAddon>
                          <Briefcase size={16} />
                        </InputAddon>

                        <Select
                          id="designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleDesignationChange}
                          required
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        >
                          <option value="">Select designation</option>
                          {designationsData.map((desig) => (
                            <option key={desig.Designation_code} value={desig.Designation_code}>
                              {desig.designation}
                            </option>
                          ))}
                        </Select>
                      </InputGroup>
                    </FormGroup>

                    {/* Primary Role Combobox */}
                    <FormGroup>
                      <Label htmlFor="primaryRole">Primary Role*</Label>
                      <Combobox value={formData.primaryRoleName} onChange={handlePrimaryRoleChange}>
                        <InputGroup>
                          <InputAddon>
                            <User size={16} />
                          </InputAddon>
                          <ComboboxContainer>
                            <div className="relative w-full">
                              <Combobox.Button as={Fragment}>
                                <ComboboxButtonWithAddon>
                                  <Combobox.Input
                                    as={ComboboxInput}
                                    onChange={(e) => setPrimaryRoleQuery(e.target.value)}
                                    placeholder="Select primary role"
                                    displayValue={(role) => role}
                                  />
                                  <ChevronDown size={16} />
                                </ComboboxButtonWithAddon>
                              </Combobox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setPrimaryRoleQuery("")}
                              >
                                <Combobox.Options as={ComboboxOptions}>
                                  {filteredPrimaryRoles.length === 0 && primaryRoleQuery !== "" ? (
                                    <div className="px-4 py-2 text-sm text-gray-500">No roles found.</div>
                                  ) : (
                                    filteredPrimaryRoles.map((role) => (
                                      <Combobox.Option key={role} value={role} as={Fragment}>
                                        {({ active, selected }) => (
                                          <ComboboxOption
                                            data-selected={selected}
                                            style={{
                                              backgroundColor: active ? "#f3f4f6" : "white",
                                            }}
                                          >
                                            {role}
                                            {selected && <Check size={16} className="text-blue-600" />}
                                          </ComboboxOption>
                                        )}
                                      </Combobox.Option>
                                    ))
                                  )}
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </ComboboxContainer>
                        </InputGroup>
                      </Combobox>
                    </FormGroup>

                    {/* Additional Roles Multi-select Combobox */}
                    <FormGroup>
                      <Label htmlFor="additionalRoles">Additional Roles</Label>
                      <Combobox value={additionalRolesQuery} onChange={handleAddAdditionalRole}>
                        <InputGroup>
                          <InputAddon>
                            <Users size={16} />
                          </InputAddon>
                          <ComboboxContainer>
                            <div className="relative w-full">
                              <Combobox.Button as={Fragment}>
                                <ComboboxButtonWithAddon>
                                  <Combobox.Input
                                    as={ComboboxInput}
                                    onChange={(e) => setAdditionalRolesQuery(e.target.value)}
                                    placeholder="Select additional roles"
                                  />
                                  <ChevronDown size={16} />
                                </ComboboxButtonWithAddon>
                              </Combobox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Combobox.Options as={ComboboxOptions}>
                                  {filteredAdditionalRoles.map((role) => (
                                    <Combobox.Option key={role} value={role} as={Fragment}>
                                      {({ active }) => (
                                        <ComboboxOption
                                          style={{
                                            backgroundColor: active ? "#f3f4f6" : "white",
                                          }}
                                        >
                                          {role}
                                          {formData.additionalRoleNames.includes(role) && (
                                            <Check size={16} className="text-blue-600" />
                                          )}
                                        </ComboboxOption>
                                      )}
                                    </Combobox.Option>
                                  ))}
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </ComboboxContainer>
                        </InputGroup>
                      </Combobox>

                      {formData.additionalRoleNames.length > 0 && (
                        <SelectedItemsContainer>
                          {formData.additionalRoleNames.map((role) => (
                            <SelectedItem key={role}>
                              {role}
                              <RemoveItemButton onClick={() => handleRemoveAdditionalRole(role)}>
                                <X size={14} />
                              </RemoveItemButton>
                            </SelectedItem>
                          ))}
                        </SelectedItemsContainer>
                      )}
                    </FormGroup>

                    {/* Data Entitlements Multi-select Combobox */}
                    <FormGroup>
                      <Label htmlFor="dataEntitlements">Data Entitlements</Label>
                      <Combobox value={dataEntitlementsQuery} onChange={handleAddDataEntitlement}>
                        <InputGroup>
                          <InputAddon>
                            <Building size={16} />
                          </InputAddon>
                          <ComboboxContainer>
                            <div className="relative w-full">
                              <Combobox.Button as={Fragment}>
                                <ComboboxButtonWithAddon>
                                  <Combobox.Input
                                    as={ComboboxInput}
                                    onChange={(e) => setDataEntitlementsQuery(e.target.value)}
                                    placeholder="Select data entitlements"
                                    displayValue={() => dataEntitlementsQuery}
                                  />
                                  <ChevronDown size={16} />
                                </ComboboxButtonWithAddon>
                              </Combobox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Combobox.Options as={ComboboxOptions}>
                                  {filteredDataEntitlements.length === 0 && dataEntitlementsQuery !== "" ? (
                                    <div className="px-4 py-2 text-sm text-gray-500">No entitlements found.</div>
                                  ) : (
                                    filteredDataEntitlements.map((entitlement, index) => (
                                      <Combobox.Option key={index} value={entitlement} as={Fragment}>
                                        {({ active }) => (
                                          <ComboboxOption
                                            style={{
                                              backgroundColor: active ? "#f3f4f6" : "white",
                                            }}
                                          >
                                            {entitlement}
                                            {formData.dataEntitlements.includes(entitlement) && (
                                              <Check size={16} className="text-blue-600" />
                                            )}
                                          </ComboboxOption>
                                        )}
                                      </Combobox.Option>
                                    ))
                                  )}
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </ComboboxContainer>
                        </InputGroup>
                      </Combobox>

                      {formData.dataEntitlements.length > 0 && (
                        <SelectedItemsContainer>
                          {formData.dataEntitlements.map((entitlement) => (
                            <SelectedItem key={entitlement}>
                              {entitlement}
                              <RemoveItemButton onClick={() => handleRemoveDataEntitlement(entitlement)}>
                                <X size={14} />
                              </RemoveItemButton>
                            </SelectedItem>
                          ))}
                        </SelectedItemsContainer>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <InputGroup>
                        <InputAddon>
                          <Heart size={16} />
                        </InputAddon>
                        <Select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        >
                          <option value="">Select blood group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </Select>
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select marital status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="guardianNumber">Guardian Number</Label>
                      <InputGroup>
                        <InputAddon>
                          <Users size={16} />
                        </InputAddon>
                        <InputWithAddon
                          type="tel"
                          id="guardianNumber"
                          name="guardianNumber"
                          value={formData.guardianNumber}
                          onChange={handleChange}
                          placeholder="Enter guardian number"
                        />
                      </InputGroup>
                    </FormGroup>
                  </FormGrid>
                </>
              )}

              {/* Qualification Tab */}
              {activeTab === "qualification" && (
                <>
                  <SectionTitle>
                    <SectionIcon>
                      <Building size={20} />
                    </SectionIcon>
                    Qualification Details
                  </SectionTitle>
                  <SectionDescription>Add your educational qualifications here.</SectionDescription>

                  {qualifications.map((qualification, index) => (
                    <QualificationCard key={qualification.id}>
                      <QualificationHeader>
                        <QualificationTitle>Qualification #{index + 1}</QualificationTitle>
                        {qualifications.length > 1 && (
                          <RemoveButton type="button" onClick={() => removeQualification(qualification.id)}>
                            <Trash2 size={16} />
                          </RemoveButton>
                        )}
                      </QualificationHeader>

                      <FormGrid>
                        <FormGroup>
                          <Label>Degree/Certification*</Label>
                          <Input
                            type="text"
                            value={qualification.degree}
                            onChange={(e) => handleQualificationChange(qualification.id, "degree", e.target.value)}
                            required
                            placeholder="E.g., B.Tech, MBA, etc."
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Institution/University*</Label>
                          <Input
                            type="text"
                            value={qualification.institution}
                            onChange={(e) => handleQualificationChange(qualification.id, "institution", e.target.value)}
                            required
                            placeholder="Name of institution"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Passed Out Year*</Label>
                          <Input
                            type="text"
                            value={qualification.passedOut}
                            onChange={(e) => handleQualificationChange(qualification.id, "passedOut", e.target.value)}
                            required
                            placeholder="Year of completion"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Percentage/CGPA</Label>
                          <Input
                            type="text"
                            value={qualification.percentage}
                            onChange={(e) => handleQualificationChange(qualification.id, "percentage", e.target.value)}
                            placeholder="E.g., 85% or 8.5 CGPA"
                          />
                        </FormGroup>
                      </FormGrid>
                    </QualificationCard>
                  ))}

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <AddButton type="button" onClick={addQualification}>
                      <AddButtonIcon>
                        <Plus size={16} />
                      </AddButtonIcon>
                      Add Another Qualification
                    </AddButton>
                  </div>
                </>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <>
                  <SectionTitle>
                    <SectionIcon>
                      <Briefcase size={20} />
                    </SectionIcon>
                    Experience Details
                  </SectionTitle>
                  <SectionDescription>Add your work experience details here.</SectionDescription>

                  {experiences.map((experience, index) => (
                    <QualificationCard key={experience.id}>
                      <QualificationHeader>
                        <QualificationTitle>Experience #{index + 1}</QualificationTitle>
                        {experiences.length > 1 && (
                          <RemoveButton type="button" onClick={() => removeExperience(experience.id)}>
                            <Trash2 size={16} />
                          </RemoveButton>
                        )}
                      </QualificationHeader>

                      <FormGrid>
                        <FormGroup>
                          <Label>Company Name*</Label>
                          <Input
                            type="text"
                            value={experience.company}
                            onChange={(e) => handleExperienceChange(experience.id, "company", e.target.value)}
                            required
                            placeholder="Name of company"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Position*</Label>
                          <Input
                            type="text"
                            value={experience.position}
                            onChange={(e) => handleExperienceChange(experience.id, "position", e.target.value)}
                            required
                            placeholder="Your job title"
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Years of Experience*</Label>
                          <Input
                            type="text"
                            value={experience.yearsOfExperience}
                            onChange={(e) => handleExperienceChange(experience.id, "yearsOfExperience", e.target.value)}
                            required
                            placeholder="E.g., 2.5 years"
                          />
                        </FormGroup>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          <FormGroup>
                            <Label>From Date*</Label>
                            <StyledDatePicker
                              selected={experience.fromDate}
                              onChange={(date) => handleExperienceDateChange(date, experience.id, "fromDate")}
                              dateFormat="MM/yyyy"
                              showMonthYearPicker
                              placeholderText="Start date"
                              required
                            />
                          </FormGroup>

                          <FormGroup>
                            <Label>To Date</Label>
                            <StyledDatePicker
                              selected={experience.toDate}
                              onChange={(date) => handleExperienceDateChange(date, experience.id, "toDate")}
                              dateFormat="MM/yyyy"
                              showMonthYearPicker
                              placeholderText="End date or present"
                            />
                          </FormGroup>
                        </div>

                        <FormGroup style={{ gridColumn: "1 / -1" }}>
                          <Label>Experience Certificate</Label>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <UploadButton>
                              <UploadIcon>
                                <Upload size={16} />
                              </UploadIcon>
                              <UploadText>Upload Certificate</UploadText>
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleCertificateUpload(e, experience.id)}
                              />
                            </UploadButton>
                            {experience.certificateName && <FileName>{experience.certificateName}</FileName>}
                          </div>
                        </FormGroup>
                      </FormGrid>
                    </QualificationCard>
                  ))}

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <AddButton type="button" onClick={addExperience}>
                      <AddButtonIcon>
                        <Plus size={16} />
                      </AddButtonIcon>
                      Add Another Experience
                    </AddButton>
                  </div>
                </>
              )}

              {/* Bank Details Tab */}
              {activeTab === "bank" && (
                <>
                  <SectionTitle>
                    <SectionIcon>
                      <CreditCard size={20} />
                    </SectionIcon>
                    Bank Details
                  </SectionTitle>
                  <SectionDescription>Add your banking information here.</SectionDescription>

                  <FormGrid>
                    <FormGroup>
                      <Label htmlFor="bankName">Bank Name*</Label>
                      <Input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={bankDetails.bankName}
                        onChange={handleBankDetailsChange}
                        required
                        placeholder="Enter bank name"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="ifscCode">IFSC Code*</Label>
                      <Input
                        type="text"
                        id="ifscCode"
                        name="ifscCode"
                        value={bankDetails.ifscCode}
                        onChange={handleBankDetailsChange}
                        required
                        placeholder="Enter IFSC code"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="accountNumber">Account Number*</Label>
                      <Input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={bankDetails.accountNumber}
                        onChange={handleBankDetailsChange}
                        required
                        placeholder="Enter account number"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="branch">Branch*</Label>
                      <Input
                        type="text"
                        id="branch"
                        name="branch"
                        value={bankDetails.branch}
                        onChange={handleBankDetailsChange}
                        required
                        placeholder="Enter branch name"
                      />
                    </FormGroup>
                  </FormGrid>
                </>
              )}

              {/* Submit Button */}
              <SubmitButtonContainer>
                <SubmitButton type="submit" onClick={submitProfile}>
                  <SubmitButtonIcon>
                    <Save size={16} />
                  </SubmitButtonIcon>
                  Save Profile
                </SubmitButton>
              </SubmitButtonContainer>
            </FormContainer>
          </Card>
        </ContentWrapper>
      </Container>
    </>
  )
}

export default Profile
