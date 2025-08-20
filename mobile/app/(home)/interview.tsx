import Header from '@/app/components/Header';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function InterviewAnalyzer() {
  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Interview Analyzer</Text>
        
        <View style={styles.chartsSection}>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              <View style={styles.circleChart}>
                <Text style={styles.chartValue}>75%</Text>
              </View>
            </View>
            <Text style={styles.chartLabel}>Topics Covered</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              <View style={styles.barChart}>
                <Text style={styles.chartValue}>8/10</Text>
              </View>
            </View>
            <Text style={styles.chartLabel}>Topic-wise Analysis</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              <View style={styles.lineChart}>
                <Text style={styles.chartValue}>+15%</Text>
              </View>
            </View>
            <Text style={styles.chartLabel}>Progress</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brief Summary</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.boxContent}>
              Overall your interview performance was good. You demonstrated strong technical knowledge and problem-solving skills.
              Some improvement needed in communication clarity and specific domain knowledge.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pros & Cons</Text>
          <View style={styles.prosConsBox}>
            <View style={styles.prosSection}>
              <Text style={styles.prosTitle}>Pros:</Text>
              <Text style={styles.prosCons}>• Strong technical knowledge</Text>
              <Text style={styles.prosCons}>• Good problem-solving approach</Text>
              <Text style={styles.prosCons}>• Well-prepared examples</Text>
            </View>
            <View style={styles.consSection}>
              <Text style={styles.consTitle}>Cons:</Text>
              <Text style={styles.prosCons}>• Could improve speaking clarity</Text>
              <Text style={styles.prosCons}>• Took too long on simple questions</Text>
              <Text style={styles.prosCons}>• Missing specific domain knowledge</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestion}>1. Practice speaking more concisely</Text>
            <Text style={styles.suggestion}>2. Review fundamentals in [specific topic]</Text>
            <Text style={styles.suggestion}>3. Prepare more STAR method examples</Text>
            <Text style={styles.suggestion}>4. Work on time management during responses</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
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
    borderColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
  },
  barChart: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#0F9D58',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f5ed',
  },
  lineChart: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#DB4437',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faeae8',
  },
  chartValue: {
    fontSize: 16,
    fontWeight: 'bold',
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
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  boxContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  prosConsBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
  },
  prosSection: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingRight: 10,
  },
  consSection: {
    flex: 1,
    paddingLeft: 10,
  },
  prosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F9D58',
    marginBottom: 8,
  },
  consTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DB4437',
    marginBottom: 8,
  },
  prosCons: {
    fontSize: 14,
    marginBottom: 5,
  },
  suggestionsBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
  },
  suggestion: {
    fontSize: 14,
    marginBottom: 8,
  },
});
