import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const UseCases = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Use cases</Text>
      
      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>For Schools</Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>X</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>For Api integration</Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>X</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>For Colleges</Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>X</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>For Schools</Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>X</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    marginVertical: 30,
  },
  cardsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  placeholder: {
    height: 120,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: '#999',
  },
});

export default UseCases;