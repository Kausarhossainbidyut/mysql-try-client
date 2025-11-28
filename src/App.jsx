import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Fetch students from backend
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/students');
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !department) {
      setError('All fields are required');
      return;
    }
    
    try {
      if (editingId) {
        // Update existing student
        await axios.put(`http://localhost:5000/students/${editingId}`, {
          name,
          email,
          department
        });
        setEditingId(null);
      } else {
        // Add new student
        await axios.post('http://localhost:5000/students', {
          name,
          email,
          department
        });
      }
      
      // Reset form
      setName('');
      setEmail('');
      setDepartment('');
      setError('');
      
      // Refresh student list
      fetchStudents();
    } catch (err) {
      setError('Failed to save student');
      console.error(err);
    }
  };
  
  // Edit student
  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setDepartment(student.department);
    setEditingId(student.id);
  };
  
  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
    }
  };
  
  // Initialize data
  useEffect(() => {
    fetchStudents();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Management System</h1>
          <p className="text-gray-600">Manage your student records efficiently</p>
        </div>
        
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Student' : 'Add New Student'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter student name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter student email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setEmail('');
                    setDepartment('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {editingId ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Students List Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Student Records</h2>
            <span className="text-sm text-gray-500">{students.length} students</span>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found. Add a new student to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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
          <p>Student Management System &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default App;