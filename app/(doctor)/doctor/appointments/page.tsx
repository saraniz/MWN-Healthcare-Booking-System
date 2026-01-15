// app/doctor/appointments/page.tsx
'use client';

import { useState } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  FileText,
  Phone,
  Video,
  MapPin,
  AlertCircle,
  Download,
  Printer,
  Bell,
  MessageSquare
} from 'lucide-react';

// Types
type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';
type Priority = 'low' | 'medium' | 'high' | 'emergency';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  date: string;
  time: string;
  token: string;
  status: AppointmentStatus;
  reason: string;
  priority: Priority;
  duration: string;
  type: 'new' | 'follow-up' | 'review';
  notes?: string;
  symptoms?: string[];
  labReports?: string[];
  previousVisits: number;
  insurance: string;
  appointmentDate: string;
  bookedAt: string;
}

export default function DoctorAppointments() {
  // State
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APT-001',
      patientId: 'P-001',
      patientName: 'John Doe',
      patientAge: 45,
      patientGender: 'Male',
      patientPhone: '+1 (555) 123-4567',
      date: '2024-12-15',
      time: '10:30 AM',
      token: 'TK-001',
      status: 'confirmed',
      reason: 'Routine checkup & blood pressure review',
      priority: 'medium',
      duration: '15 mins',
      type: 'follow-up',
      symptoms: ['High BP', 'Headache'],
      previousVisits: 3,
      insurance: 'Aetna',
      appointmentDate: '2024-12-15',
      bookedAt: '2024-12-10'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    date: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Apply filters and search
  const filteredAppointments = appointments
    .filter(appointment => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          appointment.patientName.toLowerCase().includes(searchLower) ||
          appointment.token.toLowerCase().includes(searchLower) ||
          appointment.reason.toLowerCase().includes(searchLower) ||
          appointment.patientPhone.includes(searchQuery);
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (filters.status && appointment.status !== filters.status) return false;
      
      // Priority filter
      if (filters.priority && appointment.priority !== filters.priority) return false;
      
      // Type filter
      if (filters.type && appointment.type !== filters.type) return false;
      
      // Date filter
      if (filters.date && appointment.date !== filters.date) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const { key, direction } = sortConfig;
      let aValue: any = a[key as keyof Appointment];
      let bValue: any = b[key as keyof Appointment];
      
      // Handle date sorting
      if (key === 'date' || key === 'appointmentDate' || key === 'bookedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle time sorting (convert to minutes)
      if (key === 'time') {
        aValue = convertTimeToMinutes(aValue);
        bValue = convertTimeToMinutes(bValue);
      }
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Helper function to convert time to minutes for sorting
  const convertTimeToMinutes = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  // Handle sort
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status Badge component
  const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
    const config = {
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      'no-show': { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    };

    const { color, icon: Icon } = config[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  // Priority Badge component
  const PriorityBadge = ({ priority }: { priority: Priority }) => {
    const config = {
      low: { color: 'bg-green-100 text-green-800', label: 'Low' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
      emergency: { color: 'bg-red-100 text-red-800', label: 'Emergency' }
    };
    
    const { color, label } = config[priority];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  // Type Badge component
  const TypeBadge = ({ type }: { type: string }) => {
    const config = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      'follow-up': { color: 'bg-purple-100 text-purple-800', label: 'Follow-up' },
      review: { color: 'bg-amber-100 text-amber-800', label: 'Review' }
    };
    
    const { color, label } = config[type as keyof typeof config];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  // Get appointment statistics
  const totalAppointments = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  // Handle view details
  const handleViewDetails = (appointment: Appointment) => {
    alert(`Viewing details for appointment: ${appointment.id}\nPatient: ${appointment.patientName}`);
  };

  // Handle start consultation
  const handleStartConsultation = (appointment: Appointment) => {
    alert(`Starting consultation for: ${appointment.patientName}\nToken: ${appointment.token}`);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-600 mt-1">View and manage all your appointments</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <p className="text-lg font-bold text-gray-900">{totalAppointments}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Confirmed</p>
                    <p className="text-lg font-bold text-gray-900">{confirmedCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-lg font-bold text-gray-900">{pendingCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-lg font-bold text-gray-900">{completedCount}</p>
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
                        placeholder="Search by patient name, token, phone, or reason..."
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
                      setFilters({ status: '', priority: '', type: '', date: '' });
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <select
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={filters.status}
                        onChange={(e) => {
                          setFilters({...filters, status: e.target.value});
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No Show</option>
                      </select>

                      <select
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={filters.priority}
                        onChange={(e) => {
                          setFilters({...filters, priority: e.target.value});
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="emergency">Emergency</option>
                      </select>

                      <select
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={filters.type}
                        onChange={(e) => {
                          setFilters({...filters, type: e.target.value});
                          setCurrentPage(1);
                        }}
                      >
                        <option value="">All Types</option>
                        <option value="new">New</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="review">Review</option>
                      </select>

                      <input
                        type="date"
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A8F7A] focus:border-transparent"
                        value={filters.date}
                        onChange={(e) => {
                          setFilters({...filters, date: e.target.value});
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('patientName')}
                      >
                        <div className="flex items-center">
                          Patient Info
                          {sortConfig?.key === 'patientName' && (
                            sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 ml-1" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center">
                          Date & Time
                          {sortConfig?.key === 'date' && (
                            sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4 ml-1" /> : 
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason & Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority & Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                          <p className="text-gray-600">
                            {searchQuery || Object.values(filters).some(f => f) 
                              ? 'Try adjusting your search or filters' 
                              : 'No appointments scheduled'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          {/* Patient Info Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{appointment.patientName}</div>
                                <div className="text-sm text-gray-600">
                                  {appointment.patientAge}y • {appointment.patientGender}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {appointment.patientPhone}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Token: {appointment.token} • Visits: {appointment.previousVisits}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Date & Time Column */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{formatDate(appointment.date)}</div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {appointment.time}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Duration: {appointment.duration}
                              </div>
                              <div className="text-xs text-gray-500">
                                Booked: {formatDate(appointment.bookedAt)}
                              </div>
                            </div>
                          </td>
                          
                          {/* Reason & Type Column */}
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{appointment.reason}</div>
                            <div className="mt-2">
                              <TypeBadge type={appointment.type} />
                            </div>
                            {appointment.symptoms && appointment.symptoms.length > 0 && (
                              <div className="text-xs text-gray-500 mt-2">
                                Symptoms: {appointment.symptoms.join(', ')}
                              </div>
                            )}
                            {appointment.labReports && appointment.labReports.length > 0 && (
                              <div className="text-xs text-blue-600 mt-1">
                                Reports: {appointment.labReports.join(', ')}
                              </div>
                            )}
                          </td>
                          
                          {/* Priority & Status Column */}
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              <PriorityBadge priority={appointment.priority} />
                              <StatusBadge status={appointment.status} />
                              <div className="text-xs text-gray-500">
                                Insurance: {appointment.insurance}
                              </div>
                            </div>
                          </td>
                          
                          {/* Actions Column */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              {appointment.status === 'confirmed' && (
                                <button
                                  onClick={() => handleStartConsultation(appointment)}
                                  className="px-3 py-1.5 bg-[#0A8F7A] text-white text-sm rounded hover:bg-[#098d78]"
                                >
                                  Start Consultation
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleViewDetails(appointment)}
                                className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 flex items-center justify-center"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </button>
                              
                              <div className="flex space-x-2">
                                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50">
                                  <FileText className="w-3 h-3 text-gray-600" />
                                </button>
                                <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50">
                                  <Phone className="w-3 h-3 text-gray-600" />
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

              {/* Table Footer - Pagination */}
              {filteredAppointments.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredAppointments.length)}</span> of{' '}
                    <span className="font-medium">{filteredAppointments.length}</span> appointments
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

            {/* Additional Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium text-gray-900 mb-2">Appointment Types</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">New Patients</span>
                    <span className="font-medium">{appointments.filter(a => a.type === 'new').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Follow-ups</span>
                    <span className="font-medium">{appointments.filter(a => a.type === 'follow-up').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reviews</span>
                    <span className="font-medium">{appointments.filter(a => a.type === 'review').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium text-gray-900 mb-2">Priority Distribution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">High Priority</span>
                    <span className="font-medium">{appointments.filter(a => a.priority === 'high' || a.priority === 'emergency').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Medium Priority</span>
                    <span className="font-medium">{appointments.filter(a => a.priority === 'medium').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Low Priority</span>
                    <span className="font-medium">{appointments.filter(a => a.priority === 'low').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm">
                    Schedule New
                  </button>
                  <button className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded text-sm">
                    View Calendar
                  </button>
                  <button className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-sm">
                    Telemedicine
                  </button>
                  <button className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-sm">
                    Follow-ups
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}