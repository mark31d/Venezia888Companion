import React from 'react';
import {StatusBar, View, Image, StyleSheet} from 'react-native';
import Assets from './Components/AssetRegistry';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

const AppTheme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, background: 'transparent'},
};
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-gesture-handler';

import SplashScreen from './Components/SplashScreen';
import OnboardingScreen from './Components/OnboardingScreen';
import MainTabs from './Components/MainTabs';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}

// Wrapper to pass callbacks through navigator via prop replacement
function SplashWrapper({navigation}) {
  return <SplashScreen onFinish={() => navigation.replace('Onboarding')} />;
}

function OnboardingWrapper({navigation}) {
  return <OnboardingScreen onFinish={() => navigation.replace('Main')} />;
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="Splash" component={SplashWrapper} />
      <Stack.Screen name="Onboarding" component={OnboardingWrapper} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={{flex: 1, backgroundColor: 'transparent'}}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.appRoot}>
        <Image source={Assets.BG} style={[StyleSheet.absoluteFillObject, styles.bgImage]} resizeMode="cover" />
        <View style={styles.contentLayer}>
          <NavigationContainer theme={AppTheme}>
            <RootNavigator />
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: {flex: 1},
  bgImage: {zIndex: -1, elevation: -1},
  contentLayer: {flex: 1, zIndex: 1, position: 'relative'},
});
