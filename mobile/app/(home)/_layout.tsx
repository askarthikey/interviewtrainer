import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Protect all home routes - require authentication
  if (isLoaded && !isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  )
}