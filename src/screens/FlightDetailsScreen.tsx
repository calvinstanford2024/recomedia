import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FilterTabs } from '../components/FilterTabs';
import { MediaCard } from '../components/MediaCard';

export const FlightDetailsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../../assets/la-mountains.jpg')}
        style={styles.headerImage}
      />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>FLIGHT TO LOS ANGELES</Text>

        <FilterTabs
          tabs={['All', 'Movies', 'TV', 'Books', 'Songs']}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        <MediaCard
          title="La La Land"
          creator="Damien Chazelle"
          year="2016"
          rating={90}
          image={require('../../assets/la-la-land.jpg')}
          description="While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future."
          platforms={['netflix', 'prime', 'hulu', 'apple']}
        />

        <MediaCard
          title="Once Upon a Time in Hollywood"
          creator="Quentin Tarantino"
          year="2019"
          rating={85}
          image={require('../../assets/once-upon.jpg')}
          description="A faded television actor and his stunt double strive to achieve fame in the final years of Hollywood's Golden Age."
          platforms={['prime', 'hulu', 'apple']}
        />

        <MediaCard
          title="Pulp Fiction"
          creator="Quentin Tarantino"
          year="1994"
          rating={70}
          image={require('../../assets/pulp-fiction.jpg')}
          platforms={['netflix', 'hulu', 'apple']}
        />

        <MediaCard
          title="Nightcrawler"
          creator="Dan Gilroy"
          year="2014"
          rating={65}
          image={require('../../assets/nightcrawler.jpg')}
          platforms={['netflix', 'prime', 'apple']}
        />

        <MediaCard
          title="Battle: Los Angeles"
          creator="Jonathan Liebesman"
          year="2011"
          rating={60}
          image={require('../../assets/battle-la.jpg')}
          platforms={['netflix', 'prime', 'hulu']}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B2E',
  },
  headerImage: {
    width: '100%',
    height: 200,
    position: 'absolute',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginTop: 150,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#1E1B2E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});