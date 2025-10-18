import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ProfilePage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('Personal Information');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [friends, setFriends] = useState([]);
  const [stats, setStats] = useState({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPosition: '',
    experience: '',
    skills: '',
    company: '',
    country: '',
    about: '',
    school: '',
    degree: '',
    graduationDate: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    newEmail: ''
  });

  const menuItems = [
    'Personal Information',
    'Education',
    'Reset Password',
    'Social',
    'Email Settings'
  ];

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
    loadFriendsData();
  }, []);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPosition: user.currentPosition || '',
        experience: user.experience || '',
        skills: user.skills || '',
        company: user.company || '',
        country: user.country || '',
        about: user.about || '',
        school: user.education?.school || '',
        degree: user.education?.degree || '',
        graduationDate: user.education?.graduationDate || ''
      }));
      
      if (user.profileImage?.url || user.imageUrl) {
        setProfileImage(user.profileImage?.url || user.imageUrl);
      }
    }
  }, [user]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data.stats || {});
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const loadFriendsData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/profile/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.data.friends || []);
      }
    } catch (error) {
      console.error('Error loading friends data:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setProfileImage(data.data.profileImage.url);
        showMessage('success', 'Profile image updated successfully!');
      } else {
        showMessage('error', data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (loading) return;

    setLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      switch (activeSection) {
        case 'Personal Information':
          endpoint = '/api/profile/personal';
          payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            currentPosition: formData.currentPosition,
            experience: formData.experience,
            skills: formData.skills,
            company: formData.company,
            country: formData.country,
            about: formData.about
          };
          break;

        case 'Education':
          endpoint = '/api/profile/education';
          payload = {
            school: formData.school,
            degree: formData.degree,
            graduationDate: formData.graduationDate
          };
          break;

        case 'Reset Password':
          if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
            showMessage('error', 'All password fields are required');
            setLoading(false);
            return;
          }
          if (formData.newPassword !== formData.confirmNewPassword) {
            showMessage('error', 'New passwords do not match');
            setLoading(false);
            return;
          }
          endpoint = '/api/profile/password';
          payload = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmNewPassword: formData.confirmNewPassword
          };
          break;

        case 'Email Settings':
          if (!formData.newEmail) {
            showMessage('error', 'New email is required');
            setLoading(false);
            return;
          }
          endpoint = '/api/profile/email';
          payload = {
            newEmail: formData.newEmail
          };
          break;

        default:
          showMessage('error', 'Invalid section selected');
          setLoading(false);
          return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        showMessage('success', data.message || `${activeSection} updated successfully!`);
        
        // Clear password fields after successful update
        if (activeSection === 'Reset Password') {
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          }));
        }
        
        // Clear new email field after successful update
        if (activeSection === 'Email Settings') {
          setFormData(prev => ({
            ...prev,
            newEmail: '',
            email: formData.newEmail // Update current email display
          }));
        }
      } else {
        showMessage('error', data.message || `Failed to update ${activeSection.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSocial = () => {
    return (
      <div className="profile-form">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">My Connections</h3>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalInterviews || 0}</div>
            <div className="text-sm text-gray-600">Total Interviews</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.averageConfidence ? (stats.averageConfidence * 100).toFixed(0) + '%' : '0%'}
            </div>
            <div className="text-sm text-gray-600">Avg Confidence</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalTimeSpent / 60) || 0}m</div>
            <div className="text-sm text-gray-600">Practice Time</div>
          </div>
        </div>

        {friends.length > 0 ? (
          <ul className="space-y-4">
            {friends.map((friend, index) => (
              <li key={friend._id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                <img 
                  src={friend.profileImage?.url || friend.imageUrl || `https://i.pravatar.cc/150?u=${friend.email}`} 
                  alt={`${friend.name}'s avatar`} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{friend.name || `${friend.firstName} ${friend.lastName}`}</p>
                  <p className="text-sm text-gray-500">
                    {friend.currentPosition ? `${friend.currentPosition}${friend.company ? ` at ${friend.company}` : ''}` : 'Connection'}
                  </p>
                </div>
                <button className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                  View Profile
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No connections yet</p>
            <p className="text-sm text-gray-400 mt-2">Connect with other users to build your network</p>
          </div>
        )}
      </div>
    );
  };

  const renderEmailSettings = () => {
    return (
      <div className="space-y-8 max-w-2xl">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <p className="text-sm text-gray-700">Manage your email address and communication preferences</p>
        </div>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
            <label className="block text-sm font-bold text-gray-900 mb-3">Current Email (Verified)</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm bg-gray-100 cursor-not-allowed text-gray-700 font-medium"
            />
            <p className="text-xs text-green-700 mt-3 font-semibold">This is your verified email address</p>
          </div>
          <div className="border-t-2 border-gray-200 pt-8">
            <label className="block text-sm font-bold text-gray-900 mb-3">New Email Address</label>
            <input
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleInputChange}
              placeholder="Enter your new email address"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
            />
            <p className="text-xs text-gray-600 mt-3">A verification link will be sent to your new email address</p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Personal Information':
        return (
          <div className="space-y-10">
            {/* Profile Photo Upload Section */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Profile Photo</h4>
                  <p className="text-sm text-gray-600 mt-1">Upload a professional photo to complete your profile</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover border-4 border-blue-300 shadow-lg ring-4 ring-blue-100"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-300 shadow-lg ring-4 ring-blue-100">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-4 font-medium">📸 Supported formats: JPG, PNG (Max 5MB)</p>
                  <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-105 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{loading ? 'Uploading...' : 'Choose Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information form fields */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="abc@gmail.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Current Position</label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, Python"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Company Inc."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                >
                  <option value="">Select Country</option>
                  <option value="IN">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
            <div className="mt-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200">
              <label className="block text-sm font-bold text-gray-900 mb-3">About You</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your background, and your professional goals..."
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 resize-none bg-white"
              />
            </div>
          </div>
        );
      case 'Education':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <p className="text-sm text-gray-700">Add your educational qualifications to enhance your profile credibility</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education form fields */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">School/University</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="e.g., Stanford University"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor of Science"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Graduation Date</label>
                <input
                  type="date"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
            </div>
          </div>
        );
      case 'Reset Password':
        return (
          <div className="space-y-8 max-w-2xl">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-md">
              <div className="flex items-start space-x-3">
                <div>
                  <p className="text-sm font-semibold text-red-900">Security Tip</p>
                  <p className="text-sm text-red-800 mt-1">Use a strong password with uppercase, lowercase, numbers, and special characters (!@#$%^&*)</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Reset Password form fields */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
            </div>
          </div>
        );
      case 'Social':
        return renderSocial();
      case 'Email Settings':
        return renderEmailSettings();
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h2a2 2 0 012 2v2m0 6a2 2 0 012-2h2a2 2 0 012 2v2m-6 2a2 2 0 002 2h2a2 2 0 002-2v-2m0-6a2 2 0 002-2h2a2 2 0 002 2v2" />
            </svg>
            <p className="mt-4 text-lg">
              Content for "{activeSection}" is coming soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white border-r border-gray-200 p-8 flex-shrink-0 shadow-lg">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 pb-8 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200">
          <div className="relative mb-6">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-xl ring-4 ring-blue-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-blue-100">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
          </div>
          <div className="text-center w-full">
            <h3 className="font-bold text-xl text-gray-900 truncate">
              {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
            </h3>
            <p className="text-sm text-gray-500 mt-2 truncate hover:text-gray-700 transition-colors">{user?.email}</p>
            {user?.currentPosition && (
              <div className="mt-3 inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                {user?.currentPosition}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              className={`py-3 px-4 rounded-xl text-left font-medium transition-all duration-300 flex items-center space-x-3 ${
                activeSection === item
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600 pl-3 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveSection(item)}
            >
              <span className="text-lg">
                {item === 'Personal Information' && '👤'}
                {item === 'Education' && '🎓'}
                {item === 'Reset Password' && '🔐'}
                {item === 'Social' && '👥'}
                {item === 'Email Settings' && '✉️'}
              </span>
              <span>{item}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6 lg:p-12">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl mx-auto overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white">
                {activeSection === 'Profile name' ? 'Profile Settings' : activeSection}
              </h2>
              <p className="mt-3 text-blue-100 text-lg font-medium">
                {activeSection === 'Personal Information' ? '👤 Update your professional information and profile photo' :
                 activeSection === 'Education' ? '🎓 Manage your educational background and qualifications' :
                 activeSection === 'Reset Password' ? '🔐 Change your password securely' :
                 activeSection === 'Social' ? '👥 Connect with other users and view your network' :
                 activeSection === 'Email Settings' ? '✉️ Manage your email preferences and address' :
                 'Manage your profile'}
              </p>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mx-8 mt-6 p-4 rounded-xl border-l-4 shadow-md animate-in fade-in slide-in-from-top-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-500'
                : 'bg-red-50 text-red-800 border-red-500'
            }`}>
              <div className="flex items-center">
                <span className="mr-3 text-xl">
                  {message.type === 'success' ? '✓' : '✕'}
                </span>
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          {/* Profile Image Section */}
          {activeSection === 'Profile name' && (
          <div className="flex items-center space-x-8 px-8 py-10 border-b border-gray-200">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 border-4 border-blue-100 shadow-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              )}
              <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <label
                htmlFor="profileImageUpload"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer inline-block transition-colors shadow-md"
              >
                {loading ? 'Uploading...' : '📷 Change Photo'}
              </label>
              <p className="text-sm text-gray-500 mt-3">JPG, PNG, GIF up to 5MB</p>
            </div>
          </div>
          )}

          {/* Form Content */}
          <div className="px-8 py-12 bg-gradient-to-b from-white to-gray-50">
            {renderContent()}
          </div>

          {/* Action Buttons */}
          {activeSection !== 'Social' && (
            <div className="px-8 py-8 border-t-2 border-gray-100 flex justify-end space-x-4 bg-gradient-to-r from-gray-50 to-blue-50">
              <button
                className="px-6 py-3 font-semibold rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 hover:shadow-md"
                onClick={() => setActiveSection('Personal Information')}
              >
                Cancel
              </button>
              <button
                className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-75'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105'
                }`}
                onClick={handleUpdate}
                disabled={loading}
              >
                <span>{loading ? '⏳ Saving...' : '✓ Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;