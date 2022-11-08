import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeStackHeaderProps } from '@react-navigation/native-stack/lib/typescript/src/types'
import React from 'react'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'

import { toastConfig, toastsAutoHide, toastsBottomOffset, toastsVisibilityTime } from '../@config/toasts'
import {
  ConnectionRoutesEnum,
  HomeRoutesEnum,
  NavigationBarRoutesEnum,
  PlatformsEnum,
  QrRoutesEnum,
  RootRoutesEnum,
  StackParamList
} from '../@types'
import SSIHeaderBar from '../components/bars/SSIHeaderBar'
import SSINavigationBar from '../components/bars/SSINavigationBar'
import { translate } from '../localization/Localization'
import { SSIAlertModal } from '../modals/SSIAlertModal'
import { SSIPopupModal } from '../modals/SSIPopupModal'
import * as RootNavigation from '../navigation/rootNavigation'
import SSIConnectionDetailsScreen from '../screens/SSIConnectionDetailsScreen'
import SSIConnectionsOverviewScreen from '../screens/SSIConnectionsOverviewScreen'
import SSICredentialDetailsScreen from '../screens/SSICredentialDetailsScreen'
import SSICredentialRawJson from '../screens/SSICredentialRawJson'
import SSICredentialsOverviewScreen from '../screens/SSICredentialsOverviewScreen'
import SSIPEXVerificationScreen from '../screens/SSIPEXVerificationScreen'
import SSIQRReader from '../screens/SSIQRReader'
import SSIVerificationCodeScreen from '../screens/SSIVerificationCodeScreen'
import Veramo from '../screens/Veramo'
import SSISelectCredentialTypeScreen from '../screens/SSISelectCredentialTypeScreen'

const format = require('string-format')

const Stack = createNativeStackNavigator<StackParamList>()
const Tab = createBottomTabNavigator()

export const RootStackNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={RootRoutesEnum.MAIN}
      screenOptions={{
        animation: 'none',
        headerShown: false
      }}
    >
      <Stack.Screen name={RootRoutesEnum.MAIN} component={TabStackNavigator} />
      <Stack.Screen
        name={RootRoutesEnum.ALERT_MODAL}
        children={() => (
          <>
            <SSIAlertModal />
            <Toast
              bottomOffset={toastsBottomOffset}
              autoHide={toastsAutoHide}
              visibilityTime={toastsVisibilityTime}
              config={toastConfig}
            />
          </>
        )}
        options={{
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen
        name={RootRoutesEnum.POPUP_MODAL}
        children={() => (
          <>
            <SSIPopupModal />
            <Toast
              bottomOffset={toastsBottomOffset}
              autoHide={toastsAutoHide}
              visibilityTime={toastsVisibilityTime}
              config={toastConfig}
            />
          </>
        )}
        options={{
          presentation: 'transparentModal'
        }}
      />
      <Stack.Screen name="Veramo" component={Veramo} />
    </Stack.Navigator>
  )
}

export const TabStackNavigator = (): JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // unmountOnBlur resets the stack back to initial state
        unmountOnBlur: true
      }}
      tabBar={(props: BottomTabBarProps) => <SSINavigationBar {...props} />}
      initialRouteName={NavigationBarRoutesEnum.HOME}
      backBehavior="none"
    >
      <Tab.Screen
        name={NavigationBarRoutesEnum.QR}
        children={() => (
          <>
            <QRStack />
            <Toast
              bottomOffset={toastsBottomOffset}
              autoHide={toastsAutoHide}
              visibilityTime={toastsVisibilityTime}
              config={toastConfig}
            />
          </>
        )}
      />
      <Tab.Screen
        name={NavigationBarRoutesEnum.NOTIFICATIONS}
        children={() => (
          <>
            <NotificationsStack />
            <Toast
              bottomOffset={toastsBottomOffset}
              autoHide={toastsAutoHide}
              visibilityTime={toastsVisibilityTime}
              config={toastConfig}
            />
          </>
        )}
      />
      <Tab.Screen
        name={NavigationBarRoutesEnum.HOME}
        children={() => (
          <>
            <HomeStack />
            <Toast
              bottomOffset={toastsBottomOffset}
              autoHide={toastsAutoHide}
              visibilityTime={toastsVisibilityTime}
              config={toastConfig}
            />
          </>
        )}
      />
      <Tab.Screen
        name={NavigationBarRoutesEnum.CONNECTIONS}
        children={() => (
          <>
            <ConnectionsStack />
            <Toast
              bottomOffset={toastsBottomOffset}
              autoHide={toastsAutoHide}
              visibilityTime={toastsVisibilityTime}
              config={toastConfig}
            />
          </>
        )}
      />
    </Tab.Navigator>
  )
}

const HomeStack = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={HomeRoutesEnum.CREDENTIALS_OVERVIEW}
      screenOptions={{
        animation: 'none'
      }}
    >
      <Stack.Screen
        name={HomeRoutesEnum.CREDENTIALS_OVERVIEW}
        component={SSICredentialsOverviewScreen}
        options={{
          headerTitle: translate('credentials_overview_title'),
          header: (props: NativeStackHeaderProps) => <SSIHeaderBar {...props} showBorder={true} />
        }}
      />
      <Stack.Screen
        name={HomeRoutesEnum.CREDENTIAL_DETAILS}
        component={SSICredentialDetailsScreen}
        options={({ route }) => ({
          headerTitle: translate('credential_details_title'),
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar
              {...props}
              showBackButton={Platform.OS === PlatformsEnum.IOS}
              showMoreButton
              moreButtonAction={async () =>
                await RootNavigation.navigate(HomeRoutesEnum.CREDENTIAL_RAW_JSON, {
                  rawCredential: route.params.rawCredential
                })
              }
            />
          )
        })}
      />
      <Stack.Screen
        name={HomeRoutesEnum.CREDENTIAL_RAW_JSON}
        component={SSICredentialRawJson}
        options={{
          headerTitle: 'Raw Credential', // TODO translate
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar {...props} showBackButton={Platform.OS === PlatformsEnum.IOS} showMoreButton={false} />
          )
        }}
      />
    </Stack.Navigator>
  )
}

const ConnectionsStack = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={ConnectionRoutesEnum.CONNECTIONS_OVERVIEW}
      screenOptions={{
        animation: 'none'
      }}
    >
      <Stack.Screen
        name={ConnectionRoutesEnum.CONNECTIONS_OVERVIEW}
        component={SSIConnectionsOverviewScreen}
        options={{
          headerTitle: translate('connections_overview_title'),
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar
              {...props}
              showBackButton={Platform.OS === PlatformsEnum.IOS}
              showMoreButton
              showBorder={true}
            />
          )
        }}
      />
      <Stack.Screen
        name={ConnectionRoutesEnum.CONNECTION_DETAILS}
        component={SSIConnectionDetailsScreen}
        options={{
          headerTitle: translate('connection_details_title'),
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar {...props} showBackButton={Platform.OS === PlatformsEnum.IOS} showMoreButton />
          )
        }}
      />
    </Stack.Navigator>
  )
}

const QRStack = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={QrRoutesEnum.QR_READER}
      screenOptions={{
        animation: 'none'
      }}
    >
      <Stack.Screen
        name={QrRoutesEnum.QR_READER}
        component={SSIQRReader}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={QrRoutesEnum.VERIFICATION_CODE}
        component={SSIVerificationCodeScreen}
        options={({ route }) => ({
          headerTitle: translate('verification_code_title'),
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar
              {...props}
              showBackButton={Platform.OS === PlatformsEnum.IOS}
              headerSubTitle={format(translate('verification_code_subtitle'), route.params.credentialName)}
            />
          )
        })}
      />
      <Stack.Screen
        name={ConnectionRoutesEnum.CONNECTION_DETAILS}
        component={SSIConnectionDetailsScreen}
        options={{
          headerTitle: translate('connection_details_title'),
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar {...props} showBackButton={Platform.OS === PlatformsEnum.IOS} showMoreButton />
          )
        }}
      />
      <Stack.Screen
        name={QrRoutesEnum.PEX_VERIFICATION}
        component={SSIPEXVerificationScreen}
        options={{
          headerTitle: 'Verification', // TODO translation
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar {...props} showBackButton={Platform.OS === PlatformsEnum.IOS} />
          )
        }}
      />
      <Stack.Screen
        name={HomeRoutesEnum.CREDENTIAL_DETAILS}
        component={SSICredentialDetailsScreen}
        options={({ route }) => ({
          headerTitle: translate('credential_details_title'),
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar
              {...props}
              showBackButton={Platform.OS === PlatformsEnum.IOS}
              showMoreButton
              moreButtonAction={async () =>
                await RootNavigation.navigate(HomeRoutesEnum.CREDENTIAL_RAW_JSON, {
                  rawCredential: route.params.rawCredential
                })
              }
            />
          )
        })}
      />
      <Stack.Screen
        name={QrRoutesEnum.SELECT_CREDENTIAL_TYPE}
        component={SSISelectCredentialTypeScreen}
        options={({ route }) => ({
          headerTitle: 'Credential offers',
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar {...props} showBackButton={Platform.OS === PlatformsEnum.IOS} showMoreButton={false} />
          )
        })}
      />
      <Stack.Screen
        name={HomeRoutesEnum.CREDENTIAL_RAW_JSON}
        component={SSICredentialRawJson}
        options={{
          headerTitle: 'Raw Credential', // TODO translate
          header: (props: NativeStackHeaderProps) => (
            <SSIHeaderBar {...props} showBackButton={Platform.OS === PlatformsEnum.IOS} />
          )
        }}
      />
    </Stack.Navigator>
  )
}

// TODO need a temp screen here else navigating to this stack will give errors
const NotificationsStack = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName={HomeRoutesEnum.CREDENTIALS_OVERVIEW}
      screenOptions={{
        animation: 'none'
      }}
    >
      <Stack.Screen
        name={HomeRoutesEnum.CREDENTIALS_OVERVIEW}
        component={SSICredentialsOverviewScreen}
        options={{
          headerTitle: translate('credentials_overview_title'),
          header: (props: NativeStackHeaderProps) => <SSIHeaderBar {...props} showBorder={true} />
        }}
      />
    </Stack.Navigator>
  )
}
