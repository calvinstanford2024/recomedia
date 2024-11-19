import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SearchBar } from '../components/SearchBar';
import { Logo } from '../components/Logo';
import { BottomNav } from '../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.profileButton}>
        <Ionicons name="person-circle-outline" size={30} color="#ffffff80" />
      </TouchableOpacity>
      <View style={styles.content}>
        <SearchBar />
        <Logo />
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B2E',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  profileButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
});