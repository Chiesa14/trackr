import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation, Route} from '@react-navigation/core';
import {confirmSignUp} from 'aws-amplify/auth';

import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components/';

const isAndroid = Platform.OS === 'android';

interface ILogin {
  code: string;
}
interface ILoginValidation {
  code: boolean;
}

interface Props {
  route: {params: {email: string}};
}

const Verify = ({route}: Props) => {
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<ILoginValidation>({
    code: false,
  });
  const [verify, setVerify] = useState<ILogin>({
    code: '',
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value: ILogin) => {
      setVerify((state) => ({...state, ...value}));
    },
    [setVerify],
  );

  const handleVerify = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      try {
        setIsLoading(true);
        const {nextStep} = await confirmSignUp({
          confirmationCode: verify.code as any,
          username: route.params.email,
        });

        if (nextStep.signUpStep == 'COMPLETE_AUTO_SIGN_IN') {
          navigation.navigate('Home' as never);
        } else if (nextStep.signUpStep == 'DONE') {
          navigation.navigate('Home' as never);
        }
      } catch (error: any) {
        setIsLoading(true);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isValid, verify]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      code: regex.code.test(verify.code),
    }));
  }, [verify, setIsValid]);

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
              Verify Email
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
                Enter the code we sent
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
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={'Code'}
                  placeholder={'Six digits code'}
                  onChangeText={(value) =>
                    handleChange({
                      code: value,
                    })
                  }
                  success={Boolean(verify.code && isValid.code)}
                  danger={Boolean(verify.code && !isValid.code)}
                />
              </Block>
              <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                {error ? (
                  <Text paddingRight={sizes.s} primary>
                    {error}
                  </Text>
                ) : null}
              </Block>
              <Button
                marginVertical={sizes.s}
                loading={isLoading}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                onPress={handleVerify}>
                <Text bold white transform="uppercase">
                  Verify
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Verify;
