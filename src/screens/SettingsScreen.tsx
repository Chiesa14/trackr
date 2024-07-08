import React from 'react';
import {signOut} from 'aws-amplify/auth';

import {Block, Button, Text} from '../components';
import {useTheme} from '../hooks';
import {useAuthUser} from '../contexts/UserContext';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen: React.FC = () => {
  const {user} = useAuthUser();
  const {colors, sizes} = useTheme();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('Login' as never);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Block safe marginTop={sizes.md}>
      <Text color={colors.primary}>{user?.username}</Text>
      <Button>
        <Text color={colors.primary} onPress={handleLogout}>
          Logout
        </Text>
      </Button>
    </Block>
  );
};

export default SettingsScreen;
