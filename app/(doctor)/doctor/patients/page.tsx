// app/doctor/patients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar';
import {
  Search,
  Filter,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertCircle,
  FileText,
  Pill,
  Activity,
  Download,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  MessageSquare,
  Video,
  Printer,
  Bell
} from 'lucide-react';

// Types
type Gender = 'Male' | 'Female' | 'Other';
type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
type PatientStatus = 'active' | 'inactive' | 'regular';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bloodGroup?: BloodGroup;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory: string[];
  allergies: string[];
  chronicConditions: string[];
  lastVisit: string;
  nextAppointment?: string;
  status: PatientStatus;
  insuranceId?: string;
  avatar: string;
  labReports: string[];
  consultationNotes: ConsultationNote[];
  prescriptions: Prescription[];
}

interface ConsultationNote {
  id: string;
  date: string;
  doctor: string;
  notes: string;
  symptoms: string[];
  diagnosis: string;
  followUpDate?: string;
}

interface Prescription {
  id: string;
  date: string;
  medications: Medication[];
  instructions: string;
  validUntil: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function DoctorPatients() {
  // State
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'P-001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: '+1 (555) 987-6543',
      medicalHistory: ['Hypertension (2019)', 'Asthma (2020)', 'Appendectomy (2018)'],
      allergies: ['Penicillin', 'Peanuts', 'Dust'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      lastVisit: '2024-11-20',
      nextAppointment: '2024-12-15',
      status: 'active',
      insuranceId: 'INS-789456',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      labReports: ['Blood Work - Nov 2024', 'ECG Report - Nov 2024', 'X-Ray Chest - Oct 2024'],
      consultationNotes: [
        {
          id: 'CN-001',
          date: '2024-11-20',
          doctor: 'Dr. Sarah Johnson',
          notes: 'Patient presented with elevated blood pressure. Recommended lifestyle changes.',
          symptoms: ['High BP', 'Headache', 'Fatigue'],
          diagnosis: 'Hypertension Stage 1',
          followUpDate: '2024-12-15'
        }
      ],
      prescriptions: [
        {
          id: 'RX-001',
          date: '2024-11-20',
          medications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
          ],
          instructions: 'Take with food. Monitor blood pressure twice daily.',
          validUntil: '2024-12-20'
        }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    gender: '',
    ageRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [newNote, setNewNote] = useState({
    symptoms: '',
    diagnosis: '',
    notes: '',
    followUpDate: ''
  });
  const [newPrescription, setNewPrescription] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
    validUntil: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Apply filters and search
  const filteredPatients = patients
    .filter(patient => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          patient.name.toLowerCase().includes(searchLower) ||
          patient.phone.includes(searchQuery) ||
          patient.email?.toLowerCase().includes(searchLower) ||
          patient.id.toLowerCase().includes(searchLower) ||
          patient.medicalHistory.some(h => h.toLowerCase().includes(searchLower)) ||
          patient.allergies.some(a => a.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (filters.status && patient.status !== filters.status) return false;
      
      // Gender filter
      if (filters.gender && patient.gender !== filters.gender) return false;
      
      // Age range filter
      if (filters.ageRange) {
        if (filters.ageRange === 'child' && patient.age > 12) return false;
        if (filters.ageRange === 'adult' && (patient.age <= 12 || patient.age > 60)) return false;
        if (filters.ageRange === 'senior' && patient.age <= 60) return false;
      }
      
      return true;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge
  const StatusBadge = ({ status }: { status: PatientStatus }) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
      regular: { color: 'bg-blue-100 text-blue-800', icon: Clock }
    };

    const { color, icon: Icon } = config[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // View patient details
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  // Add consultation note
  const handleAddNote = () => {
    if (!selectedPatient) return;

    const newConsultationNote: ConsultationNote = {
      id: `CN-${selectedPatient.consultationNotes.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      notes: newNote.notes,
      symptoms: newNote.symptoms.split(',').map(s => s.trim()).filter(s => s),
      diagnosis: newNote.diagnosis,
      followUpDate: newNote.followUpDate || undefined
    };

    setPatients(patients.map(p => 
      p.id === selectedPatient.id
        ? { ...p, consultationNotes: [...p.consultationNotes, newConsultationNote] }
        : p
    ));

    setShowAddNoteModal(false);
    setNewNote({ symptoms: '', diagnosis: '', notes: '', followUpDate: '' });
  };

  // Add prescription
  const handleAddPrescription = () => {
    if (!selectedPatient) return;

    const newPrescriptionObj: Prescription = {
      id: `RX-${selectedPatient.prescriptions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      medications: newPrescription.medications.filter(m => m.name.trim() !== ''),
      instructions: newPrescription.instructions,
      validUntil: newPrescription.validUntil
    };

    setPatients(patients.map(p => 
      p.id === selectedPatient.id
        ? { ...p, prescriptions: [...p.prescriptions, newPrescriptionObj] }
        : p
    ));

    setShowPrescriptionModal(false);
    setNewPrescription({
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      instructions: '',
      validUntil: ''
    });
  };

  // Add medication row
  const addMedicationRow = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [...newPrescription.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  // Remove medication row
  const removeMedicationRow = (index: number) => {
    const updatedMedications = newPrescription.medications.filter((_, i) => i !== index);
    setNewPrescription({ ...newPrescription, medications: updatedMedications });
  };

  // Update medication
  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...newPrescription.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setNewPrescription({ ...newPrescription, medications: updatedMedications });
  };

  // Get patient statistics
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'active').length;
  const regularPatients = patients.filter(p => p.status === 'regular').length;
  const newPatientsThisMonth = 3; // Example

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorSidebar doctorName="Dr. Sarah Johnson" doctorSpecialization="Cardiologist" />
      
      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-6 text-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                <p className="text-gray-600 mt-1">Search and manage patient records</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button className="px-4 py-2 bg-[#0A8F7A] text-white rounded-lg hover:bg-[#098d78] flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Patient
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-lg font-bold text-gray-900">{totalPatients}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Active Patients</p>
                    <p className="text-lg font-bold text-gray-900">{activePatients}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Regular Patients</p>
                    <p className="text-lg font-bold text-gray-900">{regularPatients}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-lg font-bold text-gray-900">{newPatientsThisMonth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by name, phone, email, or medical condition..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                    {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </button>

                  {/* Reset Filters */}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ status: '', gender: '', ageRange: '' });
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={filters.status}
                        onChange={(e) => {
                          setFilters({...filters, status: e.target.value});
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="regular">Regular</option>
                      </select>

                      <select
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={filters.gender}
                        onChange={(e) => {
                          setFilters({...filters, gender: e.target.value});
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>

                      <select
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={filters.ageRange}
                        onChange={(e) => {
                          setFilters({...filters, ageRange: e.target.value});
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Ages</option>
                        <option value="child">Child (0-12)</option>
                        <option value="adult">Adult (13-60)</option>
                        <option value="senior">Senior (60+)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient Information
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medical Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Visit & Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentPatients.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                          <p className="text-gray-600">
                            {searchQuery || Object.values(filters).some(f => f) 
                              ? 'Try adjusting your search or filters' 
                              : 'No patient records available'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          {/* Patient Information */}
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={patient.avatar}
                                alt={patient.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{patient.name}</div>
                                <div className="text-sm text-gray-600">
                                  {patient.age} yrs • {patient.gender}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {patient.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Contact Details */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{patient.phone}</div>
                            {patient.email && (
                              <div className="text-sm text-gray-600 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {patient.email}
                              </div>
                            )}
                            {patient.address && (
                              <div className="text-xs text-gray-500 truncate max-w-xs flex items-start">
                                <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                {patient.address}
                              </div>
                            )}
                          </td>
                          
                          {/* Medical Info */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {patient.bloodGroup && (
                                <div className="flex items-center">
                                  <Heart className="w-3 h-3 mr-1 text-red-400" />
                                  <span className="text-sm text-gray-900">{patient.bloodGroup}</span>
                                </div>
                              )}
                              {patient.chronicConditions.length > 0 && (
                                <div className="text-xs text-gray-600">
                                  Conditions: {patient.chronicConditions.join(', ')}
                                </div>
                              )}
                              {patient.allergies.length > 0 && (
                                <div className="text-xs text-red-600">
                                  Allergies: {patient.allergies.join(', ')}
                                </div>
                              )}
                            </div>
                          </td>
                          
                          {/* Last Visit & Status */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <div className="text-sm text-gray-900">
                                {formatDate(patient.lastVisit)}
                              </div>
                              {patient.nextAppointment && (
                                <div className="text-sm text-blue-600">
                                  Next: {formatDate(patient.nextAppointment)}
                                </div>
                              )}
                              <StatusBadge status={patient.status} />
                            </div>
                          </td>
                          
                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleViewPatient(patient)}
                                className="px-3 py-1.5 bg-[#0A8F7A] text-white text-sm rounded hover:bg-[#098d78]"
                              >
                                View Profile
                              </button>
                              <div className="flex space-x-2">
                                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50">
                                  <MessageSquare className="w-3 h-3 text-gray-600" />
                                </button>
                                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50">
                                  <Video className="w-3 h-3 text-gray-600" />
                                </button>
                                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50">
                                  <MoreVertical className="w-3 h-3 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredPatients.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredPatients.length)}</span> of{' '}
                    <span className="font-medium">{filteredPatients.length}</span> patients
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded ${
                            currentPage === pageNum
                              ? 'bg-[#0A8F7A] text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-gray-600">Complete patient profile and medical history</p>
                </div>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <img
                          src={selectedPatient.avatar}
                          alt={selectedPatient.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{selectedPatient.name}</div>
                          <div className="text-sm text-gray-600">
                            {selectedPatient.age} years • {selectedPatient.gender}
                          </div>
                          <div className="text-xs text-gray-500">ID: {selectedPatient.id}</div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500">Blood Group</label>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 text-red-500 mr-2" />
                          <p className="text-gray-900">{selectedPatient.bloodGroup || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500">Status</label>
                        <StatusBadge status={selectedPatient.status} />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-green-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Phone Number</label>
                        <p className="text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedPatient.phone}
                        </p>
                      </div>
                      {selectedPatient.email && (
                        <div>
                          <label className="text-sm text-gray-500">Email Address</label>
                          <p className="text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {selectedPatient.email}
                          </p>
                        </div>
                      )}
                      {selectedPatient.address && (
                        <div>
                          <label className="text-sm text-gray-500">Address</label>
                          <p className="text-gray-900 flex items-start">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                            {selectedPatient.address}
                          </p>
                        </div>
                      )}
                      {selectedPatient.emergencyContact && (
                        <div>
                          <label className="text-sm text-gray-500">Emergency Contact</label>
                          <p className="text-gray-900">{selectedPatient.emergencyContact}</p>
                        </div>
                      )}
                      {selectedPatient.insuranceId && (
                        <div>
                          <label className="text-sm text-gray-500">Insurance ID</label>
                          <p className="text-gray-900">{selectedPatient.insuranceId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle Column - Medical Information */}
                <div className="space-y-6">
                  {/* Medical History */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-red-600" />
                      Medical History
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-500">Medical History</label>
                        {selectedPatient.medicalHistory.length > 0 ? (
                          <ul className="mt-1 space-y-1">
                            {selectedPatient.medicalHistory.map((item, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">No medical history recorded</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500">Chronic Conditions</label>
                        {selectedPatient.chronicConditions.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPatient.chronicConditions.map((condition, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                {condition}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No chronic conditions</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500">Allergies</label>
                        {selectedPatient.allergies.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPatient.allergies.map((allergy, index) => (
                              <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No known allergies</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lab Reports */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Lab Reports & Files
                    </h3>
                    <div className="space-y-2">
                      {selectedPatient.labReports.length > 0 ? (
                        selectedPatient.labReports.map((report, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700">{report}</span>
                            </div>
                            <button className="text-blue-600 text-sm hover:text-blue-800">
                              View
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No lab reports available</p>
                      )}
                    </div>
                    <button className="w-full mt-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      + Upload New File
                    </button>
                  </div>
                </div>

                {/* Right Column - Consultation & Prescriptions */}
                <div className="space-y-6">
                  {/* Consultation Notes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        Consultation Notes
                      </h3>
                      <button
                        onClick={() => setShowAddNoteModal(true)}
                        className="px-3 py-1 bg-[#0A8F7A] text-white text-sm rounded hover:bg-[#098d78]"
                      >
                        + Add Note
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedPatient.consultationNotes.map((note) => (
                        <div key={note.id} className="p-3 bg-white rounded border">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{formatDate(note.date)}</span>
                            <span className="text-xs text-gray-500">{note.doctor}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-2">{note.notes}</div>
                          {note.symptoms.length > 0 && (
                            <div className="text-xs text-gray-600">
                              Symptoms: {note.symptoms.join(', ')}
                            </div>
                          )}
                          <div className="text-xs text-gray-600">Diagnosis: {note.diagnosis}</div>
                          {note.followUpDate && (
                            <div className="text-xs text-blue-600 mt-1">
                              Follow-up: {formatDate(note.followUpDate)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prescriptions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <Pill className="w-5 h-5 mr-2 text-purple-600" />
                        Prescriptions
                      </h3>
                      <button
                        onClick={() => setShowPrescriptionModal(true)}
                        className="px-3 py-1 bg-[#0A8F7A] text-white text-sm rounded hover:bg-[#098d78]"
                      >
                        + Prescribe
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedPatient.prescriptions.map((prescription) => (
                        <div key={prescription.id} className="p-3 bg-white rounded border">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(prescription.date)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Valid until: {formatDate(prescription.validUntil)}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {prescription.medications.map((med, index) => (
                              <div key={index} className="text-sm text-gray-700">
                                • {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-gray-600 mt-2">{prescription.instructions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Consultation Note Modal */}
      {showAddNoteModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Consultation Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms (comma separated)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={newNote.symptoms}
                    onChange={(e) => setNewNote({...newNote, symptoms: e.target.value})}
                    placeholder="e.g., fever, headache, cough"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={newNote.diagnosis}
                    onChange={(e) => setNewNote({...newNote, diagnosis: e.target.value})}
                    placeholder="e.g., Upper respiratory infection"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded"
                    rows={3}
                    value={newNote.notes}
                    onChange={(e) => setNewNote({...newNote, notes: e.target.value})}
                    placeholder="Detailed consultation notes..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded"
                    value={newNote.followUpDate}
                    onChange={(e) => setNewNote({...newNote, followUpDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-[#0A8F7A] text-white rounded hover:bg-[#098d78]"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {showPrescriptionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Prescription</h3>
              
              {/* Medications */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Medications</h4>
                {newPrescription.medications.map((med, index) => (
                  <div key={index} className="p-4 border rounded space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Medication {index + 1}</span>
                      {index > 0 && (
                        <button
                          onClick={() => removeMedicationRow(index)}
                          className="text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Medication Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded"
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          placeholder="e.g., Amoxicillin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Dosage</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Frequency</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Duration</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          placeholder="e.g., 7 days"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addMedicationRow}
                  className="w-full py-2 border border-dashed border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                >
                  + Add Another Medication
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                  placeholder="e.g., Take after meals. Complete full course."
                />
              </div>

              {/* Validity */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={newPrescription.validUntil}
                  onChange={(e) => setNewPrescription({...newPrescription, validUntil: e.target.value})}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPrescription}
                  className="px-4 py-2 bg-[#0A8F7A] text-white rounded hover:bg-[#098d78]"
                >
                  Save Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}