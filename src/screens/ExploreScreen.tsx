import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LocationCard } from '../components/LocationCard';
import { BottomNav } from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';

export const ExploreScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Explore</Text>
        
        <Text style={styles.sectionTitle}>Near me</Text>
        <LocationCard
          image={require('../../assets/bay-area.jpg')}
          title="Bay Area"
          onPress={() => navigation.navigate('LocationDetails')}
        />
        
        <Text style={styles.sectionTitle}>Seasonal Picks</Text>
        <LocationCard
          image={require('../../assets/autumnal.jpg')}
          title="Autumnal"
          onPress={() => {}}
        />
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B2E',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 15,
  },
});