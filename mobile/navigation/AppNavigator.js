import React, { useContext } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import JournalScreen from '../screens/JournalScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stackOptions = {
  headerStyle: { backgroundColor: '#111' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'FILMDEX', headerTitleStyle: { color: '#f5c518', fontWeight: 'bold', fontSize: 20 } }} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

function WatchlistStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Watchlist" component={WatchlistScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

function JournalStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Journal" component={JournalScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#111', borderTopColor: '#222', paddingBottom: 4 },
        tabBarActiveTintColor: '#f5c518',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 13, marginBottom: 4, fontWeight: 'bold' },
        tabBarShowIcon: false,
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none', height: 0 },
        tabBarItemStyle: { justifyContent: 'center' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStack}
        options={{ tabBarLabel: 'Watchlist' }}
      />
      <Tab.Screen
        name="JournalTab"
        component={JournalStack}
        options={{ tabBarLabel: 'Journal' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <Text style={{ color: '#f5c518', fontSize: 32, fontWeight: 'bold', letterSpacing: 4 }}>FILMDEX</Text>
        <ActivityIndicator color="#f5c518" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
