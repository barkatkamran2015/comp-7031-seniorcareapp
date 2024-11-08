import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ClientListScreen from '../screens/ClientListScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

describe('ClientListScreen', () => {
  const mockClients = [
    {
      id: '1',
      firstName: 'Odell',
      lastName: 'Hawk',
      unitNumber: '101',
      buildingName: 'Sunset Apartments',
      photoUrl: '/photos/photo1.jpeg',
      status: 'Active',
    },
    {
        id: '2',
        firstName: 'Amara',
        lastName: 'Cline',
        unitNumber: '102',
        buildingName: 'Ocean View',
        photoUrl: '/photos/photo2.jpeg',
        status: 'Inactive',
    },
  ];

  const navigationMock = {
    navigate: jest.fn(),
    setOptions: jest.fn(),
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockClients });
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <NavigationContainer>
        <ClientListScreen navigation={navigationMock} />
      </NavigationContainer>
    );

  test('fetches and displays clients on mount', async () => {
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/clients');
      expect(getByText('Odell Hawk')).toBeTruthy();
      expect(getByText('101, Sunset Apartments')).toBeTruthy();
    });
  });

  test('sorts clients by first name', async () => {
  const { getByText, getAllByTestId } = renderComponent();

  await waitFor(() => {
    expect(getByText('Choose Sort')).toBeTruthy();
  });

  fireEvent.press(getByText('Choose Sort'));
  fireEvent.press(getByText('First Name'));

  await waitFor(() => {
    // Retrieve all client name elements
    const nameElements = getAllByTestId('client-name');

    // Extract the text content from the elements
    const clientNames = nameElements.map(element => element.props.children);

    // Expected sorted names based on mock data
    const expectedNames = [
      ['Amara', ' ' , 'Cline'],
      ['Odell', ' ' , 'Hawk'],
    ];

    // Assert that the client names are in the expected order
    expect(clientNames).toEqual(expectedNames);
  });
});

  test('navigates to ClientDetail on client press', async () => {
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Odell Hawk')).toBeTruthy();
    });

    fireEvent.press(getByText('Odell Hawk'));

    expect(navigationMock.navigate).toHaveBeenCalledWith('ClientDetail', {
      client: mockClients[0],
    });
  });
});
