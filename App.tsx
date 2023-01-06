import { NavigationContainer } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { LogBox, StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'

import 'react-native-gesture-handler'
import IntentHandler from './src/handlers/IntentHandler'
import _loadFontsAsync from './src/hooks/useFonts'
import Localization from './src/localization/Localization'
import { RootStackNavigator } from './src/navigation/navigation'
import { navigationRef } from './src/navigation/rootNavigation'
import store from './src/store';
import { backgrounds } from './src/styles/colors'

LogBox.ignoreLogs([
  // Ignore require cycles for the app in dev mode. They do show up in Metro!
  'Require cycle:',
  /*
    TODO WAL-342
    Non-serializable values were found in the navigation state. Check:
    This can break usage such as persisting and restoring state. This might happen if you passed non-serializable values such as function, class instances etc. in params. If you need to use components with callbacks in your options, you
    can use 'navigation.setOptions' instead. See https://reactnavigation.org/docs/troubleshooting#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state for more details.
   */
  'Non-serializable values were found in the navigation state',
  /*
    TODO WAL-346
    We should implement a keep awake mechanism. https://docs.expo.dev/versions/latest/sdk/keep-awake/
   */
  'Unable to activate keep awake',
  /*
    TODO WAL-369
    https://stackoverflow.com/questions/69538962/new-nativeeventemitter-was-called-with-a-non-null-argument-without-the-requir/69649068#69649068
    The above seems very likely as the last update on react-native-share-menu was on May 12 2022
  */
  'new NativeEventEmitter'
])

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    const intentHandler: IntentHandler = new IntentHandler()
    async function prepare(): Promise<void> {
      try {
        // TODO create better implementation for this
        StatusBar.setBarStyle('light-content', true)
        StatusBar.setBackgroundColor(backgrounds.primaryDark)
        StatusBar.setTranslucent(false)
        Localization.setI18nConfig()

        // Keep the splash screen visible while we fetch resources
        // TODO: Enable splashscreen
        // await SplashScreen.preventAutoHideAsync()

        // Preload fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
        await _loadFontsAsync()

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        //await new Promise((resolve) => setTimeout(resolve, 2000))

        await intentHandler.enable()
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }
    void prepare()
    return () => {
      void intentHandler.disable()
    };
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      // await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <NavigationContainer ref={navigationRef}>
          <RootStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}
