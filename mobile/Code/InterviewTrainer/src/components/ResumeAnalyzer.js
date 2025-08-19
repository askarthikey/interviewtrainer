import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const roles = ['option1', 'option2', 'option3'];
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resume Analyzer</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload your Resume</Text>
        <TouchableOpacity style={styles.fileButton}>
          <Text style={styles.buttonText}>Select File</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select your Desired Role</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text>{selectedRole || 'Select'}</Text>
          <Ionicons name="chevron-down" size={20} color="black" />
        </TouchableOpacity>
        
        {isDropdownOpen && (
          <View style={styles.dropdownOptions}>
            {roles.map((role, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedRole(role);
                  setIsDropdownOpen(false);
                }}
              >
                <Text>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Job Description</Text>
        <TextInput
          style={styles.textArea}
          multiline={true}
          numberOfLines={5}
          placeholder="Text area"
          value={jobDescription}
          onChangeText={setJobDescription}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analysis</Text>
        <View style={styles.analysisBox}></View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggestions</Text>
        <View style={styles.suggestionBox}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  fileButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownOptions: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  textArea: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    height: 150,
    textAlignVertical: 'top',
  },
  analysisBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height: 150,
  },
  suggestionBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height: 150,
  },
});

export default ResumeAnalyzer;