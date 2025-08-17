import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ResumeAnalyzer from './src/components/ResumeAnalyzer';
import UseCases from './src/components/UseCases';
import InterviewAnalyzer from './src/components/InterviewAnalyzer';
import Header from './src/components/Header';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const renderScreen = () => {
    switch(currentScreen) {
      case 'resume':
        return <ResumeAnalyzer />;
      case 'usecases':
        return <UseCases />;
      case 'interview':
        return <InterviewAnalyzer />;
      default:
        return (
          <View style={styles.homeContainer}>
            <Text style={styles.homeTitle}>Welcome to InterviewTrainer</Text>
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={() => setCurrentScreen('resume')}
            >
              <Text style={styles.buttonText}>Resume Analyzer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={() => setCurrentScreen('usecases')}
            >
              <Text style={styles.buttonText}>Use Cases</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={() => setCurrentScreen('interview')}
            >
              <Text style={styles.buttonText}>Interview Analyzer</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header onNavigate={setCurrentScreen} />
      {renderScreen()}
      {currentScreen !== 'home' && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setCurrentScreen('home')}
        >
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  navButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#4a90e2',
  },
});



