import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../screens/LoginScreen';

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock react-native-paper components
jest.mock('react-native-paper', () => ({
    TextInput: ({ label, onChangeText, value, secureTextEntry }) => (
      <input
        testID={`input-${label}`}
        placeholder={label}
        onChangeText={text => onChangeText(text)}
        value={value}
        secureTextEntry={secureTextEntry}
      />
    ),
    Button: ({ onPress, children }) => (
      <button testID="login-button" onPress={onPress}>
        {children}
      </button>
    ),
    Text: ({ children }) => (
      <text testID="welcome-text">{children}</text>
    ),
    Avatar: {
      Image: () => null,
    },
    useTheme: () => ({}),
  }));

  describe('LoginScreen', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders login form elements', () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} />
      );

      expect(getByTestId('welcome-text')).toBeTruthy();
      expect(getByTestId('input-Username')).toBeTruthy();
      expect(getByTestId('input-Password')).toBeTruthy();
      expect(getByTestId('login-button')).toBeTruthy();
    });

    it('handles successful login', async () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} />
      );

      const usernameInput = getByTestId('input-Username');
      const passwordInput = getByTestId('input-Password');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(usernameInput, 'admin');
      fireEvent.changeText(passwordInput, 'password');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ClientList');
      });
    });

    it('handles failed login', async () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} />
      );

      const usernameInput = getByTestId('input-Username');
      const passwordInput = getByTestId('input-Password');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(usernameInput, 'wrong');
      fireEvent.changeText(passwordInput, 'wrong');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Invalid credentials', 'Please try again');
      });
    });
  });
