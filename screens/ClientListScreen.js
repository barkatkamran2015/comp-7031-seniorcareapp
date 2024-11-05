import React, {useState, useCallback, useLayoutEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {Button, Menu, Provider} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

const ClientListScreen = ({navigation}) => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchClients = async () => {
        try {
          const response = await axios.get('http://192.168.20.31:3000/clients');
          const clientsFromAPI = response.data;
          console.log(clientsFromAPI);
          const updatedClients = await Promise.all(
            clientsFromAPI.map(async client => {
              const savedStatus = await AsyncStorage.getItem(
                `status-${client.id}`,
              );
              const savedPhoto = await AsyncStorage.getItem(
                `photoUrl-${client.id}`,
              );
              return {
                ...client,
                status: savedStatus || client.status,
                photoUrl: savedPhoto || client.photoUrl,
              };
            }),
          );
          setClients(updatedClients);
        } catch (error) {
          console.error('Error fetching clients:', error);
        }
      };
      fetchClients();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: () => navigation.navigate('Login')},
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => (
        <Button onPress={handleLogout} mode="text" style={styles.logoutButton}>
          Logout
        </Button>
      ),
    });
  }, [navigation]);

  const handleSearch = text => {
    setSearchText(text);
    const filteredClients = mockClients.filter(
      client =>
        client.firstName.toLowerCase().includes(text.toLowerCase()) ||
        client.lastName.toLowerCase().includes(text.toLowerCase()) ||
        client.buildingName.toLowerCase().includes(text.toLowerCase()) ||
        client.unitNumber.includes(text),
    );
    setClients(filteredClients);
  };

  const sortClients = criteria => {
    const sortedClients = [...clients].sort((a, b) =>
      a[criteria].localeCompare(b[criteria]),
    );
    setClients(sortedClients);
  };

  const handleImageUpload = async clientId => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 100,
      maxHeight: 100,
    });

    if (result.assets && result.assets.length > 0) {
      const photoUrl = result.assets[0].uri;
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId ? {...client, photoUrl} : client,
        ),
      );
      await AsyncStorage.setItem(`photoUrl-${clientId}`, photoUrl);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <TextInput
          placeholder="Search by name or address..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
        <Button onPress={() => setIsMenuVisible(true)}>Sort By</Button>
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <Button onPress={() => setIsMenuVisible(true)}>Choose Sort</Button>
          }>
          <Menu.Item
            onPress={() => sortClients('firstName')}
            title="First Name"
          />
          <Menu.Item
            onPress={() => sortClients('lastName')}
            title="Last Name"
          />
          <Menu.Item
            onPress={() => sortClients('unitNumber')}
            title="Unit Number"
          />
        </Menu>

        <FlatList
          data={clients}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ClientDetail', {client: item})
              }
              style={styles.clientItem}>
              <TouchableOpacity onPress={() => handleImageUpload(item.id)}>
                <Image
                  source={{uri: item.photoUrl}}
                  style={styles.clientPhoto}
                />
              </TouchableOpacity>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text>
                  {item.unitNumber}, {item.buildingName}
                </Text>
                <Button
                  mode="contained"
                  compact
                  style={[
                    styles.statusButton,
                    styles[`statusButton${item.status}`],
                  ]}
                  labelStyle={styles.statusButtonText}>
                  {item.status}
                </Button>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  searchInput: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  clientPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButton: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8, // Adjusts button width to be more compact
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12, // Reduces font size for a more compact look
  },
  logoutButton: {
    marginRight: 16,
  },
  statusButtonActive: {backgroundColor: '#4caf50'},
  statusButtonInactive: {backgroundColor: '#9e9e9e'},
  statusButtonCompleted: {backgroundColor: '#2196f3'},
  statusButtonPartial: {backgroundColor: '#ff9800'},
  statusButtonRefused: {backgroundColor: '#f44336'},
});

export default ClientListScreen;
