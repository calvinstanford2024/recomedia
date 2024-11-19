import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const BottomNav = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => navigation.navigate('Explore')}
      >
        <Ionicons name="compass" size={24} color="#ffffff80" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} color="#ffffff80" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Ionicons name="calendar" size={24} color="#ffffff80" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    padding: 10,
  },
});