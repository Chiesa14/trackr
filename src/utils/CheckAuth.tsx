import React from 'react';
import {useNavigation} from '@react-navigation/core';

import {useAuthUser} from '../contexts/UserContext';

interface Props {
  children: React.ReactNode;
}

export const CheckAuth: React.FC<Props> = ({children}) => {
  const {user} = useAuthUser();
  const navigation = useNavigation();

  if (user) {
    navigation.navigate('Home' as never);
  }
  return children;
};
