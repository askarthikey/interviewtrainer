// GoogleLogin.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

export default function GoogleLogin({ navigation }) {
  const [email, setEmail] = useState("");

  return (
    <ScrollView style={styles.container}>
      {/* Top Right Profile Icon */}
      <View style={styles.topRight}>
        <Ionicons name="person-circle-outline" size={36} color="#333" />
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Login to resume your journey with Interview Trainer
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Continue with Email */}
      <TouchableOpacity style={styles.emailBtn}>
        <Text style={styles.emailBtnText}>Continue with email</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <AntDesign name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <AntDesign name="facebook-square" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <AntDesign name="apple1" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={styles.bottomRow}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.section}>
        <Text style={styles.heading1}>Heading 1</Text>
        <Text style={styles.desc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          facilisis, lorem sed dapibus aliquet, justo sapien ultrices orci.
        </Text>

        {/* Heading 3 Items */}
        {["Heading 3", "Heading 3", "Heading 3", "Heading 3"].map(
          (title, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.heading3}>{title}</Text>
              <View style={styles.readMoreRow}>
                <Text style={styles.readMore}>READ MORE</Text>
                <Text style={styles.readMore}>READ MORE</Text>
                <Text style={styles.readMore}>READ MORE</Text>
              </View>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  topRight: { alignItems: "flex-end" },
  title: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  emailBtn: {
    backgroundColor: "#6C63FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  emailBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#ccc" },
  orText: { marginHorizontal: 8, color: "#666", fontWeight: "600" },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  socialBtn: {
    padding: 12,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  linkText: { color: "#007AFF", fontWeight: "600" },
  section: { marginTop: 20 },
  heading1: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  desc: { fontSize: 14, color: "#444", marginBottom: 15 },
  itemRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  heading3: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  readMoreRow: { flexDirection: "row", justifyContent: "space-around" },
  readMore: { color: "#007AFF", fontWeight: "500" },
});
