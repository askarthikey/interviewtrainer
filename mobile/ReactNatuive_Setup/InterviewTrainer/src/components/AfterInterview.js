// src/screens/AfterInterview.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const AfterInterview = () => {
  const handlePress = (action) => {
    alert(`${action} clicked`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.welcome}>
        Welcome back, User 👋
      </Text>
      <Text style={styles.subText}>
        Ready to ace your next interview?
      </Text>

      {/* Last Interview Result */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚠️ Last Interview Result</Text>
        <Text style={styles.cardText}>Short summary of the interview</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handlePress("Start Interview")}
        >
          <Text style={styles.buttonText}>Start Interview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handlePress("Previous Insights")}
        >
          <Text style={styles.buttonText}>Previous Insights</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handlePress("Check Recording")}
        >
          <Text style={styles.buttonText}>Check Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handlePress("Analyze Resume")}
        >
          <Text style={styles.buttonText}>Analyze Resume</Text>
        </TouchableOpacity>
      </View>

      {/* Performance Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Performance Summary</Text>
        <Text style={styles.cardText}>Accuracy Rate: 75%</Text>
        <Text style={styles.cardText}>Weakest Areas: Topic Name</Text>
        <Text style={styles.cardText}>Average Score: 7.8</Text>
      </View>

      {/* Badges Earned */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏅 Badges Earned</Text>
        <Text style={styles.badges}>⭐ ✅ 📘</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 3,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#6a0dad",
    padding: 14,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  badges: {
    fontSize: 22,
    marginTop: 8,
  },
});

export default AfterInterview;
