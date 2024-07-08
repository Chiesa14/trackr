import {useRouter} from 'expo-router';
import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {MMKV} from 'react-native-mmkv';

import {useAuthUser} from './UserContext';
import {Authenthicator} from '../utils/authenticator';
import {useNavigation} from '@react-navigation/native';

const storage = new MMKV({id: 'user-inactivity'});

export const UserInactivityProvider = ({children}: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const {user, loading} = useAuthUser();
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [user]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    console.log('🚀 ~ handleAppStateChange ~ nextAppState', nextAppState);

    if (nextAppState === 'background') {
      recordStartTime();
    } else if (
      nextAppState === 'active' &&
      appState.current.match(/background/)
    ) {
      const elapsed = Date.now() - (storage.getNumber('startTime') || 0);
      console.log('🚀 ~ handleAppStateChange ~ elapsed:', elapsed);

      if (elapsed > 3000) {
        const correct = await Authenthicator.unlock();

        if (correct) {
          navigation.navigate('Home' as never);
        }
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set('startTime', Date.now());
  };

  return children;
};
