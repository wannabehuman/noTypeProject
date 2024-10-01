/*
 * 위치를... x = 도착지   y = 이전 도착지 라고 가정했을 때 x와 같고 y보다 큰 경우 두어번 푸시알림 보내야할 듯
    지오펜싱? 사용하면 쉬울 듯함 찾아보기. 
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// import { WebView } from 'react-native-webview';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {SelectOption} from '../components/Util/SelectOption';
import {pickContext} from '../../App';
import PassLocation from '../components/Util/PassLocation';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

// const requestLocationPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: '위치 권한',
//           message: '지도에서 자신의 위치를 확인하기 위해서는 위치 권한이 필요합니다',
//           buttonNeutral: '나중에 묻기',
//           buttonNegative: '아니오',
//           buttonPositive: '예',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   }
//   return true;
// };
export const MyLocation = () => {
  const webViewRef = useRef(null);
  const {setPickLocation, setStOption, setEdOption, selectSt, selectEd} =
    React.useContext(pickContext);
  const [data, setData] = useState([]);
  const heightAnim = useRef(new Animated.Value(0.15)).current; // 초기 높이 값 (30%)
  const getAllData = async () => {
    let db;
    try {
      console.log('SQLite:', SQLite);
      db = await SQLite.openDatabase({
        name: 'realBusTable.db',
        createFromLocation: 1,
        location: 'Documents',
      });
      console.log('데이터베이스 연결 성공');

      db.transaction(tx => {
        // 출발지 및 도착지 목록 조회
        tx.executeSql(
          'SELECT DISTINCT BS.STOP_NM AS STOP_NM FROM realBusTime AS TI INNER JOIN baseCode as BS ON TI.START_LOCATION = BS.STOP_CD;',
          [],
          (tx, results) => {
            const rows = results.rows;
            let startLocations = [];
            for (let i = 0; i < rows.length; i++) {
              startLocations.push(rows.item(i).STOP_NM);
            }
            setStOption(startLocations);
          },
          error => {
            console.log('출발지 조회 에러:', error);
          },
        );

        tx.executeSql(
          'SELECT DISTINCT BS.STOP_NM AS STOP_NM FROM realBusTime AS TI INNER JOIN baseCode as BS ON TI.END_LOCATION = BS.STOP_CD;',
          [],
          (tx, results) => {
            const rows = results.rows;
            let endLocations = [];
            for (let i = 0; i < rows.length; i++) {
              endLocations.push(rows.item(i).STOP_NM);
            }
            setEdOption(endLocations);
          },
          error => {
            console.log('도착지 조회 에러:', error);
          },
        );
      });
    } catch (error) {
      console.log('DB 연결 중 에러 발생:', error);
    }
  };

  const fetchFilteredData = async (startLocation, endLocation) => {
    let db;
    try {
      db = await SQLite.openDatabase({
        name: 'realBusTable.db',
        createFromLocation: 1,
        location: 'Documents',
      });

      db.transaction(tx => {
        let query =
          'SELECT BS.STOP_NM,LONGTITUDE, LATITUDE, ST.STOP_BY ,ST.SEQ FROM lati_lonti AS WI LEFT JOIN realStopBy AS ST ON ST.STOP_BY = WI.STOP_BY_CD INNER JOIN baseCode AS BS ON BS.STOP_CD = ST.STOP_BY WHERE 1=1';
        const params = [];

        if (startLocation) {
          query +=
            ' AND START_LOCATION = (SELECT STOP_CD FROM baseCode WHERE STOP_NM = ?)';
          params.push(startLocation);
        }

        if (endLocation) {
          query +=
            ' AND END_LOCATION = (SELECT STOP_CD FROM baseCode WHERE STOP_NM = ?)';
          params.push(endLocation);

          tx.executeSql(
            query,
            params,
            (tx, results) => {
              const rows = results.rows;
              let items = [];
              for (let i = 0; i < rows.length; i++) {
                items.push(rows.item(i));
              }
              setData(items);
              console.log(data);
            },
            error => {
              console.log('필터링된 데이터 조회 에러:', error);
            },
          );
        }
      });
    } catch (error) {
      console.log('DB 연결 중 에러 발생:', error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    fetchFilteredData(
      selectSt !== '0' ? selectSt : '',
      selectEd !== '0' ? selectEd : '',
    );
  }, [selectSt, selectEd]);

  //   useEffect(() => {
  //     if (data.length > 0) {
  //         webViewRef.current.injectJavaScript(`setMarker(${JSON.stringify(data)}); true;`);
  //     }
  // }, [data]); // 데이터를 주입할 때 상태 업데이트 후에 주입

  // useEffect(() => {
  //   const getLocation = async () => {
  //     const hasPermission = await requestLocationPermission();
  //     if (hasPermission) {

  //       Geolocation.watchPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           if (webViewRef.current) {
  //             // console.log(`Injecting updatePosition(${latitude}, ${longitude})`);
  //             webViewRef.current.injectJavaScript(`updatePosition(${latitude}, ${longitude}); true;`);

  //           }
  //         },
  //         (error) => {
  //           console.error(error);
  //         },
  //         {
  //           enableHighAccuracy: true,
  //           distanceFilter: 1,
  //           interval: 5000,
  //           fastestInterval: 2000,
  //         }
  //       );
  //     }
  //   };
  //   getLocation();
  // }, []);

  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '앱에서 지도를 사용하려면 위치 권한이 필요합니다.',
            buttonPositive: '확인',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({
            ...location,
            latitude,
            longitude,
          });
        },
        error => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    };

    requestLocationPermission();

    return () => {
      Geolocation.clearWatch();
    };
  }, []);
  // const handleWebViewLoad = () => {
  //   console.log('WebView loaded');
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       if (webViewRef.current) {
  //         webViewRef.current.injectJavaScript(`initMap(${latitude}, ${longitude}); true;`);
  //       }
  //     },
  //     (error) => {
  //       console.error(error);
  //     },
  //     { enableHighAccuracy: true }
  //   );
  // };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10; // 작은 움직임은 무시하고, 일정 크기 이상일 때만 응답
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          // 아래로 스와이프 시 확장
          Animated.timing(heightAnim, {
            toValue: 0.9, // 확장된 높이 (90%)
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy > 0) {
          // 위로 스와이프 시 축소
          Animated.timing(heightAnim, {
            toValue: 0.15, // 축소된 높이 (30%)
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  let pData;

  if (data.length > 32) {
    pData = '';
  } else {
    pData = data.map(v => {
      return v.STOP_NM;
    });
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={[styles.top, styles.shadow]}>
        <SelectOption />
      </View>
      <View style={styles.map}>
        <MapView
          style={{flex: 1}}
          region={location}
          showsUserLocation={true}
          followsUserLocation={true}>
          {data.map(marker => (
            <Marker
              key={marker.SEQ}
              coordinate={{
                latitude: marker?.LATITUDE,
                longitude: marker?.LONGTITUDE,
              }}
              title={marker.title}
            />
          ))}
        </MapView>
      </View>
      <Animated.View
        style={[
          {
            height: heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '120%'], // 높이 애니메이션 범위
            }),
          },
        ]}
        {...panResponder.panHandlers}>
        <View style={styles.info}>
          <View style={[styles.bottomItem, styles.shadow]}>
            <View style={styles.bottomText}>
              <Text style={{marginTop: 10}}>경로 확인</Text>
            </View>
            <Animated.View
              style={{
                opacity: heightAnim.interpolate({
                  inputRange: [0.15, 0.9], // 애니메이션 범위 조정
                  outputRange: [0, 1], // 스와이프에 따라 opacity 변화
                  extrapolate: 'clamp', // 범위 외의 값은 고정
                }),
              }}>
              {/* 경로 보여주는 컴포넌트 */}
              <PassLocation data={pData} />
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomText: {
    marginTop: 15,
    alignItems: 'center',
  },
  largeFont: {
    marginTop: 15,
    marginLeft: 25,
    fontSize: 20,
    width: 160,
  },
  middleFont: {
    fontSize: 10,
    width: 500,
  },
  innerCircle: {
    marginTop: 6,
    marginLeft: 6.5,
    width: '40%', // 동그라미의 너비
    height: '40%', // 동그라미의 높이
    borderRadius: 50, // 동그라미의 반지름 (width / 2)
    backgroundColor: 'white', // 동그라미의 배경색
  },
  circle_blue: {
    marginTop: 23,
    marginLeft: 25,
    width: '25%', // 동그라미의 너비
    height: '10%', // 동그라미의 높이
    borderRadius: 50, // 동그라미의 반지름 (width / 2)
    backgroundColor: 'blue', // 동그라미의 배경색
  },
  circle_oran: {
    marginTop: 23,
    marginLeft: 25,
    width: '25%', // 동그라미의 너비
    height: '10%', // 동그라미의 높이
    borderRadius: 50, // 동그라미의 반지름 (width / 2)
    backgroundColor: 'orange', // 동그라미의 배경색
  },
  narrowBox: {
    flex: 0.5,
    // backgroundColor:"red"
  },
  widerBox: {
    flex: 4,
    // backgroundColor:"blue"
  },
  top: {
    // flex:1.9,
    backgroundColor: '#47bf80',
    flexDirection: 'row',
  },
  //상단 박스 스타일
  topCard: {
    borderRadius: 30,
    backgroundColor: '#47bf80',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flex: 2.0,
  },
  info: {
    flex: 1.0,
    // marginTop: 3,
    width: '100%',
    backgroundColor: '#47bf80',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftItem: {
    borderRadius: 30,
    marginTop: 40,
    marginRight: 5,
    marginLeft: 10,
    flex: 1,
    height: '70%',
    alignItems: 'left',
    flexDirection: 'row',
  },
  //그림자 기본
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.46,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 50,
    elevation: 3,
    backgroundColor: 'white',
  },
  // 상단 박스 그림자
  shadow_top: {
    shadowColor: 'black',
    shadowOpacity: 0.46,
    shadowOffset: {width: 2, height: 2},
    elevation: 6,
  },
  bottomItem: {
    borderRadius: 10,
    marginTop: 50,
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
    height: '60%',
    flexDirection: 'column',
    backgroundColor: '#47bf80',
  },
  map: {
    flex: 1,
    backgroundColor: '#47bf80',
  },
  button: {
    backgroundColor: '#47bf80', // 버튼 배경색상 추가
    borderRadius: 10,
    marginBottom: 20,
    width: '50%',
    height: '100%',
  },
  buttonText: {
    color: '#fff', // 버튼 글자색상 추가
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
