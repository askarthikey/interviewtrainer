import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InterviewAnalyzer = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Interview Analyzer</Text>
      
      <View style={styles.chartsSection}>
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            <View style={styles.circleChart}></View>
          </View>
          <Text style={styles.chartLabel}>Topics Covered</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            <View style={styles.barChart}></View>
          </View>
          <Text style={styles.chartLabel}>Topi-wise Analysis</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <View style={styles.chart}>
            <View style={styles.lineChart}></View>
          </View>
          <Text style={styles.chartLabel}>Progress</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brief Summary</Text>
        <View style={styles.summaryBox}></View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pros & Cons</Text>
        <View style={styles.prosConsBox}></View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggestions</Text>
        <View style={styles.suggestionsBox}></View>
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
    marginBottom: 30,
  },
  chartsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chartContainer: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleChart: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#000',
  },
  barChart: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#000',
  },
  lineChart: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#000',
  },
  chartLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryBox: {
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  prosConsBox: {
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  suggestionsBox: {
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default InterviewAnalyzer;