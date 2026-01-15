// app/doctor/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import DoctorSidebar from '../../../components/DoctorSidebar';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Bell,
  Search,
  User,
  FileText,
  Pill,
  Activity,
  TrendingUp,
  MessageSquare,
  Star
} from 'lucide-react';

// Types
type AppointmentStatus = 'confirmed' | 'pending' | 'completed';
type Priority = 'low' | 'medium' | 'high';

interface Appointment {
  id: string;
  patientName: string;
  patientAge: number;
  time: string;
  token: string;
  status: AppointmentStatus;
  reason: string;
  waitingTime: string;
  isNewPatient: boolean;
}

interface QuickStat {
  id: string;
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APT-001',
      patientName: 'John Doe',
      patientAge: 45,
      time: '10:30 AM',
      token: 'TK-001',
      status: 'confirmed',
      reason: 'Routine checkup',
      waitingTime: '5 mins',
      isNewPatient: false
    },
    {
      id: 'APT-002',
      patientName: 'Sarah Smith',
      patientAge: 32,
      time: '11:15 AM',
      token: 'TK-002',
      status: 'pending',
      reason: 'Annual physical',
      waitingTime: '25 mins',
      isNewPatient: true
    },
    {
      id: 'APT-003',
      patientName: 'Robert Johnson',
      patientAge: 58,
      time: '12:00 PM',
      token: 'TK-003',
      status: 'confirmed',
      reason: 'Chest pain evaluation',
      waitingTime: '40 mins',
      isNewPatient: false
    },
    {
      id: 'APT-004',
      patientName: 'Maria Garcia',
      patientAge: 28,
      time: '1:30 PM',
      token: 'TK-004',
      status: 'confirmed',
      reason: 'Follow-up',
      waitingTime: '55 mins',
      isNewPatient: false
    }
  ]);

  const [quickStats] = useState<QuickStat[]>([
    {
      id: 'stat-1',
      title: 'Patients Today',
      value: 12,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'stat-2',
      title: 'Today\'s Appointments',
      value: 8,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'stat-3',
      title: 'Follow-ups',
      value: 5,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      id: 'stat-4',
      title: 'Satisfaction',
      value: '94%',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]);

  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get current date
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: AppointmentStatus) => {
    const config = {
      confirmed: { color: 'bg-green-100 text-green-800' },
      pending: { color: 'bg-yellow-100 text-yellow-800' },
      completed: { color: 'bg-blue-100 text-blue-800' }
    };
    const { color } = config[status];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {status}
      </span>
    );
  };

  // Handle start consultation
  const handleStartConsultation = (appointmentId: string) => {
    setAppointments(appts => 
      appts.map(appt => 
        appt.id === appointmentId
          ? { ...appt, status: 'completed' }
          : appt
      )
    );
  };

  // Calculate queue stats
  const waitingPatients = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const completedPatients = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorSidebar doctorName="Dr. Sarah Johnson" doctorSpecialization="Cardiologist" />
      
      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-600">{getCurrentDate()}</p>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {currentTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Appointments Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Today's Appointments</h2>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="pl-9 pr-3 py-2 border rounded text-sm"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Queue Summary */}
                    <div className="flex space-x-4 mb-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Waiting: {waitingPatients}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Completed: {completedPatients}</span>
                      </div>
                    </div>

                    {/* Appointments List */}
                    <div className="space-y-3">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-gray-100 rounded">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-gray-900">
                                    {appointment.patientName}
                                  </h3>
                                  {appointment.isNewPatient && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-sm text-gray-600">
                                    {appointment.patientAge}y • {appointment.token}
                                  </span>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{appointment.reason}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {appointment.time}
                              </div>
                              <div className="text-sm text-gray-600">
                                Wait: {appointment.waitingTime}
                              </div>
                              {appointment.status !== 'completed' && (
                                <button
                                  onClick={() => handleStartConsultation(appointment.id)}
                                  className="mt-2 px-3 py-1.5 bg-[#0A8F7A] text-white text-sm rounded hover:bg-[#098d78]"
                                >
                                  Start
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Patient Queue */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 border-b">
                    <h2 className="font-bold text-gray-900">Patient Queue</h2>
                    <p className="text-sm text-gray-600 mt-1">{waitingPatients} patients waiting</p>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {appointments
                        .filter(a => a.status !== 'completed')
                        .map((patient, index) => (
                          <div key={patient.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded">
                                <span className="font-medium text-gray-900">{index + 1}</span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{patient.patientName}</h3>
                                <p className="text-sm text-gray-600">{patient.token}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{patient.time}</div>
                              <div className="text-sm text-gray-600">{patient.waitingTime}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 border-b">
                    <h2 className="font-bold text-gray-900">Quick Actions</h2>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100">
                        <div className="flex flex-col items-center">
                          <FileText className="w-5 h-5 text-blue-600 mb-1" />
                          <span className="text-sm font-medium text-gray-900">Notes</span>
                        </div>
                      </button>
                      
                      <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-100">
                        <div className="flex flex-col items-center">
                          <Pill className="w-5 h-5 text-green-600 mb-1" />
                          <span className="text-sm font-medium text-gray-900">Prescribe</span>
                        </div>
                      </button>
                      
                      <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-100">
                        <div className="flex flex-col items-center">
                          <Activity className="w-5 h-5 text-purple-600 mb-1" />
                          <span className="text-sm font-medium text-gray-900">Tests</span>
                        </div>
                      </button>
                      
                      <button className="p-3 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-100">
                        <div className="flex flex-col items-center">
                          <TrendingUp className="w-5 h-5 text-amber-600 mb-1" />
                          <span className="text-sm font-medium text-gray-900">Reports</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upcoming Follow-ups */}
                {/* <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 border-b">
                    <h2 className="font-bold text-gray-900">Upcoming Follow-ups</h2>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {[
                        { name: 'Michael Chen', time: 'Tomorrow, 10:00 AM' },
                        { name: 'Lisa Wong', time: 'Dec 18, 2:30 PM' },
                        { name: 'James Miller', time: 'Dec 19, 11:15 AM' }
                      ].map((followup, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="p-1.5 bg-gray-100 rounded">
                              <Calendar className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{followup.name}</h3>
                              <p className="text-sm text-gray-600">{followup.time}</p>
                            </div>
                          </div>
                          <span className="text-gray-400">→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}