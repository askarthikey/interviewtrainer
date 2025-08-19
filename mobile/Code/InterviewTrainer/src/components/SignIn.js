// Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>
        Login to resume your journey with Interview Trainer
      </Text>

      {/* Google Login */}
      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={20} color="#fff" />
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.bottomRow}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.section}>
        <Text style={styles.heading1}>Heading 1</Text>

        {["Heading 3", "Heading 3", "Heading 3", "Heading 3"].map(
          (title, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.heading3}>{title}</Text>
              <TouchableOpacity>
                <Text style={styles.readMore}>READ MORE</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  topRight: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "600",
    color: "#333",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  forgotText: {
    textAlign: "right",
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 10,
  },
  loginBtn: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  linkText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  heading3: {
    fontSize: 16,
    fontWeight: "600",
  },
  readMore: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
