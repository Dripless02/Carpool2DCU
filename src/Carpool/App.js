import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import HomePage from './components/HomePage';

export default function App() {
  return (
    <PaperProvider>
          <StatusBar style="auto" />
          <HomePage />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
