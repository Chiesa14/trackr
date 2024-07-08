import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components/';
import {confirmResetPassword} from 'aws-amplify/auth';

const isAndroid = Platform.OS === 'android';

interface ILogin {
  code: string;
  password: string;
}
interface ILoginValidation {
  code: boolean;
  password: boolean;
}

const NewPassword = ({route}: {route: {params: {email: string}}}) => {
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<ILoginValidation>({
    code: false,
    password: false,
  });
  const [login, setLogin] = useState<ILogin>({
    code: '',
    password: '',
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value: ILogin) => {
      setLogin((state) => ({...state, ...value}));
    },
    [setLogin],
  );

  const handleNewPass = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      try {
        setIsLoading(true);
        await confirmResetPassword({
          confirmationCode: login.code,
          newPassword: login.password,
          username: route.params.email,
        });

        navigation.navigate('Login' as never);
      } catch (error: any) {
        setIsLoading(true);
        if (error.message.match(/pasword/i)) {
          setError(error.message);
        } else {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [isValid, login]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      code: regex.code.test(login.code),
      password: regex.password.test(login.password),
    }));
  }, [login, setIsValid]);

  useEffect(() => {
    const tio = setTimeout(() => {
      setError('');
    }, 4000);

    () => {
      clearTimeout(tio);
    };
  }, [error]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {t('common.goBack')}
              </Text>
            </Button>

            <Text h4 center white marginBottom={sizes.md}>
              Set new password
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {t('login.subtitle')}
              </Text>

              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={'Code'}
                  placeholder={'Enter the code we sent'}
                  success={Boolean(login.code && isValid.code)}
                  danger={Boolean(login.code && !isValid.code)}
                  onChangeText={(value) =>
                    handleChange({
                      code: value,
                      password: login.password,
                    })
                  }
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.newPasswordPlaceholder')}
                  onChangeText={(value) =>
                    handleChange({
                      password: value,
                      code: login.code,
                    })
                  }
                  success={Boolean(login.password && isValid.password)}
                  danger={Boolean(login.password && !isValid.password)}
                />
              </Block>
              {error && (
                <Block marginVertical={sizes.s} marginHorizontal={sizes.sm}>
                  <Text color={colors.primary} semibold>
                    {error}
                  </Text>
                </Block>
              )}
              <Button
                onPress={handleNewPass}
                shadow={!isAndroid}
                loading={isLoading}
                marginVertical={sizes.s}
                gradient={gradients.primary}
                marginHorizontal={sizes.sm}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  Save
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default NewPassword;
