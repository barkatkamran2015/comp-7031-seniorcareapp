import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, Avatar } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      navigation.navigate('ClientList');
    } else {
      Alert.alert('Invalid credentials', 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={80} icon="account" style={styles.avatar} />
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon name="account" />}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon name="lock" />}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#f6f6f6' 
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: '#6200ee',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default LoginScreen;
