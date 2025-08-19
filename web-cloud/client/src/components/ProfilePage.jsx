import React, { useState } from 'react';

function ProfilePage() {
  const [activeSection, setActiveSection] = useState('Personal Information');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: 'user@example.com', // Dummy initial email
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

  const dummyFriends = [
    { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { id: 3, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    { id: 4, name: 'Robert Brown', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    console.log(`Updating ${activeSection}:`, formData);
    alert(`${activeSection} updated successfully!`);
  };

  const renderSocial = () => {
    return (
      <div className="profile-form">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">My Friends</h3>
        <ul className="space-y-4">
          {dummyFriends.map(friend => (
            <li key={friend.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <img src={friend.avatar} alt={`${friend.name}'s avatar`} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{friend.name}</p>
                <p className="text-sm text-gray-500">Friend since 2023</p>
              </div>
              <button className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                View Profile
              </button>
            </li>
          ))}
        </ul>
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
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
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
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-2">
            Profile pic
          </div>
          <div className="font-semibold text-lg text-gray-900">Profile name</div>
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

          <div className="flex items-center space-x-6 mb-8">
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0">
              Pic
            </div>
            <button className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Edit
            </button>
          </div>
          
          {renderContent()}

          <div className="mt-8 text-right">
            <button
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;