import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const mockClients = [
  { id: '1', name: 'John Doe', status: 'Active' },
  { id: '2', name: 'Jane Smith', status: 'Inactive' },
  // Add more mock clients as needed
];

const ClientListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client List</Text>
      <FlatList
        data={mockClients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ClientDetail', { client: item })}
            style={styles.clientItem}
          >
            <Text>{item.name}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  clientItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ClientListScreen;
