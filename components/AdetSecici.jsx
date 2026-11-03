import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function AdetSecici({ adet, onArtir, onAzalt, max }) {
  const eksiDisabled = adet <= 1;
  const artiDisabled = max !== undefined && adet >= max;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onAzalt}
        disabled={eksiDisabled}
        accessibilityLabel="Adedi azalt"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.button,
          eksiDisabled && styles.buttonDisabled,
          pressed && !eksiDisabled && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, eksiDisabled && styles.buttonTextDisabled]}>
          −
        </Text>
      </Pressable>

      <View style={styles.valueBox}>
        <Text style={styles.valueText}>{adet}</Text>
      </View>

      <Pressable
        onPress={onArtir}
        disabled={artiDisabled}
        accessibilityLabel="Adedi artır"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.button,
          artiDisabled && styles.buttonDisabled,
          pressed && !artiDisabled && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, artiDisabled && styles.buttonTextDisabled]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.5,
  },
  buttonPressed: {
    backgroundColor: '#E2E8F0',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  buttonTextDisabled: {
    color: '#94A3B8',
  },
  valueBox: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
});
