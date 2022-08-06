import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AuthRoutes } from './app.routes';
import { AppRoutes } from './auth.routes';

import { useAuth } from '../hooks/auth';

export function Routes() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user.id ? <AuthRoutes /> : <AppRoutes />}
    </NavigationContainer>
  )
}