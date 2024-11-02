import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const mockClients = [
  {
    id: '1',
    firstName: 'Odell',
    lastName: 'Hawk',
    unitNumber: '101',
    buildingName: 'Sunset Apartments',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Active',
  },
  {
    id: '2',
    firstName: 'Amara',
    lastName: 'Cline',
    unitNumber: '102',
    buildingName: 'Ocean View',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Inactive',
  },
  {
    id: '3',
    firstName: 'Beatrix',
    lastName: 'Goddard',
    unitNumber: '201',
    buildingName: 'Mountain Ridge',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Active',
  },
  {
    id: '4',
    firstName: 'Corbin',
    lastName: 'Trent',
    unitNumber: '301',
    buildingName: 'Green Hills',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Completed',
  },
  {
    id: '5',
    firstName: 'Dalia',
    lastName: 'Morales',
    unitNumber: '302',
    buildingName: 'Lakeside Towers',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Partial',
  },
  {
    id: '6',
    firstName: 'Ezra',
    lastName: 'Klein',
    unitNumber: '401',
    buildingName: 'Sunrise Estate',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Refused',
  },
  {
    id: '7',
    firstName: 'Fleur',
    lastName: 'Thorne',
    unitNumber: '402',
    buildingName: 'Maple Gardens',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Active',
  },
  {
    id: '8',
    firstName: 'Gideon',
    lastName: 'Brooks',
    unitNumber: '501',
    buildingName: 'Riverside Complex',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Inactive',
  },
  {
    id: '9',
    firstName: 'Harlow',
    lastName: 'Winslow',
    unitNumber: '601',
    buildingName: 'Blue Horizon',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Completed',
  },
  {
    id: '10',
    firstName: 'Isolde',
    lastName: 'Crawford',
    unitNumber: '701',
    buildingName: 'Hilltop Heights',
    photoUrl: 'https://via.placeholder.com/100',
    status: 'Partial',
  },
];


const ClientDetailScreen = ({ route, navigation }) => {
  const { client } = route.params;
  const clientIndex = mockClients.findIndex((c) => c.id === client.id);

  const [status, setStatus] = useState(client.status);
  const [photoUrl, setPhotoUrl] = useState(client.photoUrl);

  // Load the saved status and photo from AsyncStorage when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedStatus = await AsyncStorage.getItem(`status-${client.id}`);
        const savedPhotoUrl = await AsyncStorage.getItem(`photoUrl-${client.id}`);
        if (savedStatus !== null) {
          setStatus(savedStatus);
        }
        if (savedPhotoUrl !== null) {
          setPhotoUrl(savedPhotoUrl);
        }
      } catch (e) {
        console.error("Failed to load data from AsyncStorage", e);
      }
    };
    loadData();
  }, [client.id]);

  // Save the status to AsyncStorage when it changes
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    try {
      await AsyncStorage.setItem(`status-${client.id}`, newStatus);
    } catch (e) {
      console.error("Failed to save status to AsyncStorage", e);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 150,
      maxHeight: 150,
    });

    if (result.assets && result.assets.length > 0) {
      const newPhotoUrl = result.assets[0].uri;
      setPhotoUrl(newPhotoUrl);
      try {
        await AsyncStorage.setItem(`photoUrl-${client.id}`, newPhotoUrl);
      } catch (e) {
        console.error("Failed to save photoUrl to AsyncStorage", e);
      }
    }
  };

  // Swipe handlers for navigating between clients
  const handleSwipeLeft = () => {
    if (clientIndex < mockClients.length - 1) {
      navigation.navigate('ClientDetail', { client: mockClients[clientIndex + 1] });
    }
  };

  const handleSwipeRight = () => {
    if (clientIndex > 0) {
      navigation.navigate('ClientDetail', { client: mockClients[clientIndex - 1] });
    }
  };

  return (
    <GestureRecognizer onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Image source={{ uri: photoUrl }} style={styles.clientPhotoLarge} />
        </TouchableOpacity>
        <Text style={styles.clientName}>{client.firstName} {client.lastName}</Text>
        <Text style={styles.clientAddress}>{client.unitNumber}, {client.buildingName}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Client Details</Text>
          <Text style={styles.detailItem}>Unit Number: {client.unitNumber}</Text>
          <Text style={styles.detailItem}>Building Name: {client.buildingName}</Text>
          <Text style={styles.detailItem}>Status: {status}</Text>
        </View>

        <View style={styles.statusButtonContainer}>
          <Button
            mode="contained"
            onPress={() => handleStatusChange('Completed')}
            style={status === 'Completed' ? styles.selectedButton : styles.statusButton}
          >
            Completed
          </Button>
          <Button
            mode="contained"
            onPress={() => handleStatusChange('Refused')}
            style={status === 'Refused' ? styles.selectedButton : styles.statusButton}
          >
            Refused
          </Button>
          <Button
            mode="contained"
            onPress={() => handleStatusChange('Partial')}
            style={status === 'Partial' ? styles.selectedButton : styles.statusButton}
          >
            Partial
          </Button>
        </View>
      </ScrollView>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  clientPhotoLarge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  clientAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  detailSection: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  selectedButton: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#6200ee',
  },
});

export default ClientDetailScreen;
