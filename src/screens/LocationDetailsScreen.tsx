import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MediaCard } from '../components/MediaCard';
import { FilterTabs } from '../components/FilterTabs';

export const LocationDetailsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../../assets/bay-area.jpg')}
        style={styles.headerImage}
      />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>NEAR ME</Text>
          <View style={styles.locationTag}>
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.locationText}>BAY AREA</Text>
          </View>
        </View>

        <FilterTabs
          tabs={['All', 'Movies', 'TV', 'Books', 'Songs']}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        <Text style={styles.sectionTitle}>Our top 3:</Text>

        <MediaCard
          title="The Last Black Man in San Francisco"
          creator="Joe Talbot"
          year="2019"
          rating={90}
          image={require('../../assets/last-black-man.jpg')}
          description="In a rapidly-changing San Francisco, Jimmie dreams of reclaiming his childhood home..."
          platforms={['netflix', 'hulu', 'prime', 'apple']}
        />

        <MediaCard
          title="Tales of the City"
          creator="Armistead Maupin"
          year="1978"
          rating={90}
          image={require('../../assets/tales-city.jpg')}
          description="A series of novels written by American author Armistead Maupin..."
          platforms={['audible', 'kindle', 'scribd']}
        />

        <MediaCard
          title="I Left My Heart in San Francisco"
          creator="Tony Bennett"
          year="1962"
          rating={85}
          image={require('../../assets/tony-bennett.jpg')}
          platforms={['spotify', 'apple-music', 'youtube', 'tidal', 'soundcloud']}
        />

        <Text style={styles.sectionTitle}>More Movies:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <Image source={require('../../assets/zodiac.jpg')} style={styles.moviePoster} />
          <Image source={require('../../assets/fruitvale.jpg')} style={styles.moviePoster} />
          <Image source={require('../../assets/mrs-doubtfire.jpg')} style={styles.moviePoster} />
        </ScrollView>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 15,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 15,
  },
});