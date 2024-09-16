/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {PermissionsAndroid} from 'react-native';
import React, {createContext, useState, useEffect} from 'react';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/components/Footer/BottomTab';
import SplashScreen from 'react-native-splash-screen';

export const pickContext = createContext();

function App() {
  const [pickLocation, setPickLocation] = useState({});
  const [stOption, setStOption] = useState([]);
  const [edOption, setEdOption] = useState([]);
  const [selectSt, setSelectSt] = useState('');
  const [selectEd, setSelectEd] = useState('');

  const CheckPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (result === 'granted') {
        console.log('success');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    CheckPermission();
  }, []);
  useEffect(() => {
    try {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000); //스플래시 활성화 시간 2초
    } catch (e) {
      console.log(e.message);
    }
  });
  useEffect(() => {
    console.log('Current pickLocation:', pickLocation);
  }, [pickLocation]);

  // useEffect(() => {
  //   const getLocation = async () => {
  //     const hasPermission = await requestLocationPermission();
  //     if (hasPermission) {
  //       Geolocation.getCurrentPosition(
  //         position => {
  //           const {latitude, longitude} = position.coords;
  //           if (webViewRef.current) {
  //             // webViewRef.current.injectJavaScript(
  //             //   `initMap(${latitude}, ${longitude}); true;`,
  //             // );
  //           }
  //         },
  //         error => {
  //           console.error(error);
  //         },
  //         {enableHighAccuracy: true},
  //       );

  //       Geolocation.watchPosition(
  //         position => {
  //           const {latitude, longitude} = position.coords;
  //           if (webViewRef.current) {
  //             webViewRef.current.injectJavaScript(
  //               `updatePosition(${latitude}, ${longitude}); true;`,
  //             );
  //           }
  //         },
  //         error => {
  //           console.error(error);
  //         },
  //         {
  //           enableHighAccuracy: true,
  //           distanceFilter: 1,
  //           interval: 5000,
  //           fastestInterval: 2000,
  //         },
  //       );
  //     }
  //   };
  //   getLocation();
  // }, []);

  return (
    <pickContext.Provider
      value={{
        pickLocation,
        setPickLocation,
        stOption,
        setStOption,
        edOption,
        setEdOption,
        selectSt,
        setSelectSt,
        selectEd,
        setSelectEd,
      }}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </pickContext.Provider>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
