import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Building, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Users, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Search,
  RefreshCw
} from 'lucide-react';

const App = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fetch students from backend
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://mysql-try-backent.vercel.app/students');
      setStudents(response.data);
      toast.success('Students loaded successfully');
    } catch (err) {
      toast.error('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !department) {
      toast.error('All fields are required');
      return;
    }
    
    const toastId = toast.loading(editingId ? 'Updating student...' : 'Adding student...');
    
    try {
      if (editingId) {
        // Update existing student
        await axios.put(`https://mysql-try-backent.vercel.app/students/${editingId}`, {
          name,
          email,
          department
        });
        toast.success('Student updated successfully');
        setEditingId(null);
      } else {
        // Add new student
        await axios.post('https://mysql-try-backent.vercel.app/students', {
          name,
          email,
          department
        });
        toast.success('Student added successfully');
      }
      
      // Reset form
      setName('');
      setEmail('');
      setDepartment('');
      
      // Refresh student list
      fetchStudents();
    } catch (err) {
      toast.error(editingId ? 'Failed to update student' : 'Failed to add student');
      console.error(err);
    } finally {
      toast.dismiss(toastId);
    }
  };
  
  // Edit student
  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setDepartment(student.department);
    setEditingId(student.id);
    toast.success('Editing mode activated');
  };
  
  // Delete student
  const handleDelete = async (id) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }
    
    const toastId = toast.loading('Deleting student...');
    
    try {
      await axios.delete(`https://mysql-try-backent.vercel.app/students/${id}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
      console.error(err);
    } finally {
      toast.dismiss(toastId);
    }
  };
  
  // Initialize data
  useEffect(() => {
    fetchStudents();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Student Management System</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Efficiently manage your student records with our intuitive platform</p>
        </div>
        
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              {editingId ? (
                <>
                  <Edit3 className="h-5 w-5 mr-2 text-indigo-600" />
                  Edit Student
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2 text-indigo-600" />
                  Add New Student
                </>
              )}
            </h2>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setEmail('');
                  setDepartment('');
                  toast.success('Cancelled editing');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User className="h-4 w-4 mr-1 text-indigo-500" />
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter student name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-indigo-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter student email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Building className="h-4 w-4 mr-1 text-indigo-500" />
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter department"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
              >
                {editingId ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Student
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Students List Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Student Records
            </h2>
            
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search students..."
                />
              </div>
              <button
                onClick={fetchStudents}
                className="ml-2 p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
            
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {filteredStudents.length} students
            </span>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
              </div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchTerm ? 'No matching students found' : 'No students found'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding a new student.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {student.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors inline-flex items-center"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900 transition-colors inline-flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            Student Management System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;