import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ClientDetailScreen from '../screens/ClientDetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('axios');
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));
jest.mock('react-native-swipe-gestures', () => {
  return ({ children }) => children;
});

describe('ClientDetailScreen', () => {
  const mockClient = {
    id: '1',
    firstName: 'Odell',
    lastName: 'Hawk',
    unitNumber: '101',
    buildingName: 'Sunset Apartments',
    photoUrl: '/photos/photo1.jpeg',
    status: 'Active',
  };

  const navigationMock = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <NavigationContainer>
        <ClientDetailScreen
          route={{ params: { client: mockClient } }}
          navigation={navigationMock}
        />
      </NavigationContainer>
    );

  test('renders client details correctly', async () => {
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === `status-${mockClient.id}`) return Promise.resolve('Completed');
      if (key === `photoUrl-${mockClient.id}`) return Promise.resolve('saved-photo-uri');
      return Promise.resolve(null);
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Odell Hawk')).toBeTruthy();
      expect(getByText('101, Sunset Apartments')).toBeTruthy();
      expect(getByText('Unit Number: 101')).toBeTruthy();
      expect(getByText('Building Name: Sunset Apartments')).toBeTruthy();
      expect(getByText('Status: Completed')).toBeTruthy();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(`status-${mockClient.id}`);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(`photoUrl-${mockClient.id}`);
  });

  test('handles status change and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByTestId, getByText } = renderComponent();

    fireEvent.press(getByTestId('status-button-completed'));

    await waitFor(() => {
      expect(getByText('Status: Completed')).toBeTruthy();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(`status-${mockClient.id}`, 'Completed');
  });

  test('handles image upload and saves photoUrl to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    launchImageLibrary.mockResolvedValue({
      assets: [{ uri: 'new-photo-uri' }],
    });

    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('upload-image-button'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(`photoUrl-${mockClient.id}`, 'new-photo-uri');
    });
  });
});
