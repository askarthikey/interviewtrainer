import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const About = () => {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        <Text style={styles.title}>About Us</Text>

        <Text style={styles.paragraph}>
          Welcome to <Text style={styles.highlight}>Interview Trainer</Text> – your AI-powered career coach.
        </Text>

        <Text style={styles.heading}>🎯 Our Mission</Text>
        <Text style={styles.paragraph}>
          We help job seekers build confidence, sharpen communication, and succeed in interviews through personalized practice and feedback.
        </Text>

        <Text style={styles.heading}>📌 What We Offer</Text>
        <Text style={styles.list}>• AI-driven mock interviews</Text>
        <Text style={styles.list}>• Real-time performance feedback</Text>
        <Text style={styles.list}>• HR & technical question bank</Text>
        <Text style={styles.list}>• Progress tracking dashboard</Text>
        <Text style={styles.list}>• Career tips and resume guidance</Text>

        <Text style={styles.heading}>🚀 Our Vision</Text>
        <Text style={styles.paragraph}>
          We aim to make interview preparation accessible, interactive, and effective for everyone.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/contact')}
          accessibilityRole="button"
          accessibilityLabel="Go to contact page"
        >
          <Text style={styles.buttonText}>📩 Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3c72',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#fff',
  },
  paragraph: {
    fontSize: 16,
    color: '#cfd9df',
    marginBottom: 12,
    lineHeight: 22,
  },
  list: {
    fontSize: 16,
    color: '#cfd9df',
    marginLeft: 10,
    marginBottom: 6,
  },
  highlight: {
    fontWeight: '600',
    color: '#ff512f',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#ff512f',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#dd2476',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
