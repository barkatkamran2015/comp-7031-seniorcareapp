import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, TouchableOpacity, Text} from 'react-native';
import LoginScreen from './screens/LoginScreen';
import ClientListScreen from './screens/ClientListScreen';
import ClientDetailScreen from './screens/ClientDetailScreen';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="ClientList"
          component={ClientListScreen}
          options={{title: 'Client List'}}
        />
        <Stack.Screen
          name="ClientDetail"
          component={ClientDetailScreen}
          options={({navigation}) => ({
            title: 'Client Details',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                testID="backButton">
                <Text style={{color: 'blue', marginLeft: 10}}>Back</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
