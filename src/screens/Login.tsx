import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {signIn} from 'aws-amplify/auth';

import {useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components/';

const isAndroid = Platform.OS === 'android';

interface ILogin {
  email: string;
  password: string;
}
interface ILoginValidation {
  email: boolean;
  password: boolean;
}

const Login = () => {
  const {t} = useTranslation();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<ILoginValidation>({
    email: false,
    password: false,
  });
  const [login, setLogin] = useState<ILogin>({
    email: '',
    password: '',
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value: ILogin) => {
      setLogin((state) => ({...state, ...value}));
    },
    [setLogin],
  );

  const handleLogin = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      try {
        setIsLoading(true);
        const {nextStep} = await signIn({
          username: login.email,
          password: login.password,
        });

        if (nextStep.signInStep == 'DONE') {
          navigation.navigate('Home' as never);
        } else if (nextStep.signInStep == 'CONFIRM_SIGN_UP') {
          // @ts-ignore
          navigation.navigate('Verify', {
            email: login.email,
          });
        }
      } catch (error: any) {
        setIsLoading(true);
        console.log(error);
        if (error.message.match(/incorrect/i)) {
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
      email: regex.email.test(login.email),
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
            <Button row flex={0} justify="flex-start"></Button>
            <Text h4 center white marginBottom={sizes.md}>
              {t('login.title')}
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
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(login.email && isValid.email)}
                  danger={Boolean(login.email && !isValid.email)}
                  onChangeText={(value) =>
                    handleChange({
                      email: value,
                      password: login.password,
                    })
                  }
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) =>
                    handleChange({
                      password: value,
                      email: login.email,
                    })
                  }
                  success={Boolean(login.password && isValid.password)}
                  danger={Boolean(login.password && !isValid.password)}
                />
              </Block>
              {/* checkbox terms */}
              <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                {error ? (
                  <Text paddingRight={sizes.s} primary>
                    {error}
                  </Text>
                ) : null}
              </Block>
              <Button
                primary
                outlined
                loading={isLoading}
                onPress={handleLogin}
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold primary transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button>
              <Button
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                onPress={() => navigation.navigate('Register' as never)}>
                <Text bold white transform="uppercase">
                  {t('common.signup')}
                </Text>
              </Button>
              <Block marginVertical={sizes.s} marginHorizontal={sizes.sm}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('ForgotPassword' as never)
                  }>
                  <Text color={colors.secondary} semibold>
                    Forgot password?
                  </Text>
                </Pressable>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Login;
