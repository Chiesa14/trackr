import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components/';
import {resetPassword} from 'aws-amplify/auth';

const isAndroid = Platform.OS === 'android';

interface ILogin {
  email: string;
}
interface ILoginValidation {
  email: boolean;
}

const ForgotPassword = () => {
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<ILoginValidation>({
    email: false,
  });
  const [login, setLogin] = useState<ILogin>({
    email: '',
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value: ILogin) => {
      setLogin((state) => ({...state, ...value}));
    },
    [setLogin],
  );

  const handleForgot = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      try {
        setIsLoading(true);
        const {nextStep} = await resetPassword({
          username: login.email,
        });

        if (nextStep.resetPasswordStep == 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
          //@ts-ignore
          navigation.navigate('NewPassword', {email: login.email});
        } else if (nextStep.resetPasswordStep == 'DONE') {
          //@ts-ignore
          navigation.navigate('NewPassword', {email: login.email});
        }
      } catch (error: any) {
        setIsLoading(true);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isValid, login]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      email: regex.email.test(login.email),
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
              Forgot password
            </Text>
          </Image>
        </Block>
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
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.md}>
              <Text p semibold center paddingHorizontal={sizes.md}>
                Don't worry it happens. Please enter an email associated with
                your account.
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
                    })
                  }
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
                onPress={handleForgot}
                loading={isLoading}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
                  Send
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default ForgotPassword;
