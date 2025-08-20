// src/components/Home.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const Home = ({ onNavigate }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Title Section */}
      <Text style={styles.title}>Ready to Ace Your Next Interview ???</Text>
      <Text style={styles.subtitle}>
        AI mock interviews with personalized feedback, practice real-world scenarios, 
        and improve your interview performance.
      </Text>

      {/* Watch Demo */}
      <TouchableOpacity style={styles.demoButton}>
        <Text style={styles.demoButtonText}>▶ Watch Demo</Text>
      </TouchableOpacity>

      {/* SignUp & Contact */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={() => onNavigate('signup')}>
          <Text style={styles.smallButtonText}>Get Ready (Sign Up)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      {/* Key Benefits */}
      <Text style={styles.sectionTitle}>Key Benefits with Interview Trainer</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Ultimate Mock Interview Practice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Time-Specific Interview Scenarios</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Receive Tailored Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Domain-Specific Questions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Job Description Based Questions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Smooth PDF for Employers</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* How It Works */}
      <Text style={styles.sectionTitle}>How It Works?</Text>
      <View style={styles.stepsContainer}>
        <Text style={styles.step}>1️⃣ Upload your resume or JD</Text>
        <Text style={styles.step}>2️⃣ Choose your interview mode</Text>
        <Text style={styles.step}>3️⃣ Practice & get feedback instantly</Text>
        <Text style={styles.step}>4️⃣ Sharpen skills with personalized tips</Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
  },
  demoButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepsContainer: {
    marginVertical: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
  },
  step: {
    fontSize: 14,
    marginVertical: 6,
  },
});

export default Home;
