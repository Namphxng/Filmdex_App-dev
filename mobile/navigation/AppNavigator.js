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
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'FILMDEX', headerTitleStyle: { color: '#E50914', fontWeight: 'bold', fontSize: 20 } }} />
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

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#111', borderTopColor: '#222', paddingBottom: 4 },
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ tabBarLabel: 'Search', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🔍</Text> }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStack}
        options={{ tabBarLabel: 'Watchlist', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📋</Text> }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{ tabBarLabel: 'Journal', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📔</Text>, headerShown: false }}
      />
<Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text>, headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <Text style={{ color: '#E50914', fontSize: 32, fontWeight: 'bold', letterSpacing: 4 }}>FILMDEX</Text>
        <ActivityIndicator color="#E50914" style={{ marginTop: 20 }} />
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
