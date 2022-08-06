import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { NewRoom } from '../screens/NewRoom';
import { Room } from '../screens/Room';

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{
      headerShown: false
    }}>
      <Screen
        name="Home"
        component={Home}
      />
      <Screen
        name="NewRoom"
        component={NewRoom}
      />
      <Screen
        name="Room"
        component={Room}
      />
    </Navigator>
  );
}