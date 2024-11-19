import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export const Logo = () => {
  return (
    <View style={styles.container}>
      <Svg width={120} height={120} viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="#8A2BE2"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M30 60 Q 50 20 70 60"
          stroke="#8A2BE2"
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    alignItems: 'center',
  },
});