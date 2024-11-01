import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ClientDetailScreen = ({ route }) => {
  const { client } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Details</Text>
      <Text>Name: {client.name}</Text>
      <Text>Status: {client.status}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
});

export default ClientDetailScreen;
