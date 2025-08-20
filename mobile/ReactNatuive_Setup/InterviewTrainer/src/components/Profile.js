// src/screens/Profile.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const Profile = () => {
  const [linkedIn, setLinkedIn] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const handleResumeUpload = () => {
    // In real app, use DocumentPicker or ImagePicker
    alert("Resume upload feature coming soon 📂");
  };

  const handleSubmit = () => {
    alert(`✅ Submitted\nLinkedIn: ${linkedIn}\nJob Desc: ${jobDesc}`);
  };

  return (
    <View style={styles.container}>
      {/* Welcome Title */}
      <Text style={styles.welcome}>Welcome User_Name</Text>
      <Text style={styles.subTitle}>Set Your Profile</Text>

      {/* Resume Upload */}
      <Text style={styles.label}>Drop your Resume</Text>
      <TouchableOpacity style={styles.dropZone} onPress={handleResumeUpload}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2838/2838912.png",
          }}
          style={styles.icon}
        />
        <Text style={styles.dropText}>Drop Zone</Text>
      </TouchableOpacity>

      {/* LinkedIn Input */}
      <Text style={styles.label}>Enter your LinkedIn URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://linkedin.com/in/username"
        value={linkedIn}
        onChangeText={setLinkedIn}
      />

      {/* Job Description Input */}
      <Text style={styles.label}>Enter Job Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Paste job description here..."
        value={jobDesc}
        onChangeText={setJobDesc}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
  },
  dropZone: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#999",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 6,
  },
  dropText: {
    color: "#333",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Profile;
