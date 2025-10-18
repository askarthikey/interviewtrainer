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
    'Profile name',
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
      <div className="profile-form">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Manage Your Email Address</h3>
        <div className="space-y-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Email</label>
            <input
              type="email"
              name="newEmail"
              value={formData.newEmail}
              onChange={handleInputChange}
              placeholder="Enter your new email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Personal Information':
        return (
          <div className="profile-form">
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Personal Information form fields */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="abc@gmail.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="US">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">United States</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
            <div className="form-group full-width mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">About you</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Text area"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );
      case 'Education':
        return (
          <div className="profile-form">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Education Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Education form fields */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">School/University</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                <input
                  type="text"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleInputChange}
                  placeholder="e.g., May 2022"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 'Reset Password':
        return (
          <div className="profile-form">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Change Your Password</h3>
            <div className="grid grid-cols-1 gap-y-6">
              {/* Reset Password form fields */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
    <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white p-6 shadow-md lg:shadow-none flex-shrink-0">
        <div className="flex flex-col items-center mb-6">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-2 text-lg font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          )}
          <div className="font-semibold text-lg text-gray-900">
            {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
          </div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>
        
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              className={`py-3 px-4 rounded-lg text-left font-medium transition-colors duration-200 ${
                activeSection === item
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6 lg:p-10">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <div className="mb-8 border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {activeSection === 'Profile name' ? 'Profile' : activeSection}
            </h2>
            <p className="mt-1 text-gray-500">
              {activeSection === 'Personal Information' ? 'Add about yourself' : `Manage your ${activeSection.toLowerCase()}`}
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0">
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
                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer inline-block"
              >
                {loading ? 'Uploading...' : 'Change Photo'}
              </label>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF up to 5MB</p>
            </div>
          </div>
          
          {renderContent()}

          {activeSection !== 'Social' && (
            <div className="mt-8 text-right">
              <button
                className={`px-6 py-3 font-semibold rounded-md shadow-lg transition-colors duration-200 ${
                  loading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;