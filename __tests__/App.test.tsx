/**
 * @format
 */
jest.mock('react-native-gesture-handler', () => {});

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// Mock the navigation modules
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));

// Mock the screens
jest.mock('../screens/LoginScreen', () => 'LoginScreen');
jest.mock('../screens/ClientListScreen', () => 'ClientListScreen');
jest.mock('../screens/ClientDetailScreen', () => 'ClientDetailScreen');

it('renders correctly', () => {
  renderer.create(<App />);
});
