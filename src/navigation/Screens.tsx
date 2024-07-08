import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  Articles,
  Components,
  Home,
  Profile,
  Register,
  Login,
  Settings,
} from '../screens';
import {useScreenOptions, useTheme, useTranslation} from '../hooks';
import Verify from '../screens/Verify';
import NewPassword from '../screens/NewPassword';
import ForgotPassword from '../screens/ForgotPassword';
import {useAuthUser} from '../contexts/UserContext';
import {ActivityIndicator, View} from 'react-native';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();
  const {colors} = useTheme();
  const {user, loading} = useAuthUser();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',

          backgroundColor: colors.background,
        }}>
        <ActivityIndicator color={colors.primary} size={'large'} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={screenOptions.stack}
      initialRouteName={user ? 'Home' : 'Login'}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />
      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Verify"
        component={Verify as any}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="NewPassword"
        component={NewPassword as any}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword as any}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
