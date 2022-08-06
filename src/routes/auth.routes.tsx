import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();

import { SigIn } from '../screens/SignIn';
import { SignUp } from '../screens/SignUp';

export function AppRoutes() {
  return (
    <Navigator screenOptions={{
      headerShown: false
    }}>
      <Screen
        component={SigIn}
        name='SigIn'
      />
      <Screen
        component={SignUp}
        name='SignUp'
      />
    </Navigator>
  );
}