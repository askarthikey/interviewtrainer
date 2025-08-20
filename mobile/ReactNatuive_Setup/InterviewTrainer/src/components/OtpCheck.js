// src/screens/OtpCheck.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const OtpCheck = ({ onLogin }) => {
  const [otp, setOtp] = useState("");

  const handleLogin = () => {
    if (otp.length === 6) {
      // You can call API here for OTP verification
      alert("OTP Verified Successfully ✅");
      if (onLogin) onLogin();
    } else {
      alert("Please enter a valid 6-digit OTP ❌");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpBox}>
        <Text style={styles.otpLabel}>
          Enter the 6 digit code sent to your email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="OTP"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.resendText}>
          Didn’t receive the OTP?{" "}
          <Text style={styles.resendLink}>Resend code</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  otpBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
  },
  otpLabel: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 6, // space between digits
  },
  loginButton: {
    backgroundColor: "#6A0DAD",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendText: {
    textAlign: "center",
    fontSize: 14,
  },
  resendLink: {
    color: "#007bff",
    fontWeight: "500",
  },
});

export default OtpCheck;
