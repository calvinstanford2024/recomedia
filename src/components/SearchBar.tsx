import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const SearchBar = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Where to?"
        placeholderTextColor="#ffffff80"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff15',
    borderRadius: 25,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});