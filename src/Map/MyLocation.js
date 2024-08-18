/*
 * 위치를... x = 도착지   y = 이전 도착지 라고 가정했을 때 x와 같고 y보다 큰 경우 두어번 푸시알림 보내야할 듯
    지오펜싱? 사용하면 쉬울 듯함 찾아보기. 
 */


import React, { useEffect, useRef, useState  } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, PermissionsAndroid, Platform,View,Text ,TouchableOpacity} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { WebView } from 'react-native-webview';
import {html} from '../util/apiKey.js';
import { Picker } from '@react-native-picker/picker';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);


const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location to show your position on the map',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};
export const MyLocation = () => {
    const webViewRef = useRef(null);

    const [data, setData] = useState([]);
    const [uniqueStartLocations, setUniqueStartLocations] = useState([]);
    const [uniqueEndLocations, setUniqueEndLocations] = useState([]);
    const [selectedEndLocation, setSelectedEndLocation] = useState('');
    const [selectedStartLocation, setSelectedStartLocation] = useState('');

    const getAllData = async () => {
        let db;
        try {
            console.log('SQLite:', SQLite);
            db = await SQLite.openDatabase(
                {
                    name: 'realBusTable.db',
                    createFromLocation: 1,
                    location: 'Documents'
                }
            );
            console.log("데이터베이스 연결 성공");

            db.transaction(tx => {
                // 출발지 및 도착지 목록 조회
                tx.executeSql(
                    'SELECT DISTINCT START_LOCATION FROM realBusTime;',
                    [],
                    (tx, results) => {
                        const rows = results.rows;
                        let startLocations = [];
                        for (let i = 0; i < rows.length; i++) {
                            startLocations.push(rows.item(i).START_LOCATION);
                        }
                        setUniqueStartLocations(startLocations);
                    },
                    error => {
                        console.log('출발지 조회 에러:', error);
                    }
                );

                tx.executeSql(
                    'SELECT DISTINCT END_LOCATION FROM realBusTime;',
                    [],
                    (tx, results) => {
                        const rows = results.rows;
                        let endLocations = [];
                        for (let i = 0; i < rows.length; i++) {
                            endLocations.push(rows.item(i).END_LOCATION);
                        }
                        setUniqueEndLocations(endLocations);
                    },
                    error => {
                        console.log('도착지 조회 에러:', error);
                    }
                );
            });

        } catch (error) {
            console.log('DB 연결 중 에러 발생:', error);
        }
    };

    const fetchFilteredData = async (startLocation, endLocation) => {
        let db;
        try {
            db = await SQLite.openDatabase(
                {
                    name: 'realBusTable.db',
                    createFromLocation: 1,
                    location: 'Documents'
                }
            );

            db.transaction(tx => {
                let query = 'SELECT LONGTITUDE, LATITUDE, ST.STOP_BY ,ST.SEQ FROM lati_lonti AS WI INNER JOIN realStopBy AS ST ON ST.STOP_BY = WI.STOP_BY_CD WHERE 1=1';
                const params = [];

                if (startLocation) {
                    query += ' AND START_LOCATION = ?';
                    params.push(startLocation);
                }

                if (endLocation) {
                    query += ' AND END_LOCATION = ?';
                    params.push(endLocation);
                }
                

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
                    },
                    error => {
                        console.log('필터링된 데이터 조회 에러:', error);
                    }
                );
            });

        } catch (error) {
            console.log('DB 연결 중 에러 발생:', error);
        }
      
    };

    useEffect(() => {
        getAllData();
        
    }, []);

    useEffect(() => {
        fetchFilteredData(selectedStartLocation !== "0" ? selectedStartLocation : "", selectedEndLocation !== "0" ? selectedEndLocation : "");
        
    }, [selectedStartLocation, selectedEndLocation]);

      useEffect(() => {
        if (data.length > 0) {
            webViewRef.current.injectJavaScript(`setMarker(${JSON.stringify(data)}); true;`);
        }
    }, [data]); // 데이터를 주입할 때 상태 업데이트 후에 주입



    useEffect(() => {
      const getLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
  
          Geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              if (webViewRef.current) {
                // console.log(`Injecting updatePosition(${latitude}, ${longitude})`);
                webViewRef.current.injectJavaScript(`updatePosition(${latitude}, ${longitude}); true;`);
              
              }
            },
            (error) => {
              console.error(error);
            },
            {
              enableHighAccuracy: true,
              distanceFilter: 1,
              interval: 5000,
              fastestInterval: 2000,
            }
          );
        }
      };
      getLocation();
    }, []);


  const handleWebViewLoad = () => {
    console.log('WebView loaded');
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`initMap(${latitude}, ${longitude}); true;`);
        }
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.top, styles.shadow]}>
          <View style={styles.narrowBox}>
            <View style={{flex:1}}>
              <View style={styles.circle_blue}></View>
            </View>
            <View style={{flex:1}}>
              <View style={styles.circle_oran}></View>
            </View>
          </View>
          <View style={styles.widerBox}>          
            
            <View style={{flex:1}}>
              <Picker
                selectedValue={selectedStartLocation}
                style={styles.middleFont}
                onValueChange={(itemValue) => setSelectedStartLocation(itemValue)}
              >
                <Picker.Item label="Select Start Location" value="0" />
                {uniqueStartLocations.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                ))}
            </Picker>
            </View>
            
            <View style={{flex:1}}>
             
              <Picker
                selectedValue={selectedEndLocation}
                style={styles.middleFont}
                onValueChange={(itemValue) => setSelectedEndLocation(itemValue)}
            >
                <Picker.Item label="Select End Location" value="0" />
                {uniqueEndLocations.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                ))}
            </Picker>
            </View>
          </View>
        </View>

      <View style={styles.map}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html:html }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onLoadEnd={handleWebViewLoad}
      />
      </View>
      <View style={styles.info}>
        <View style={[styles.rightItem,styles.shadow]}>
          <View style={{flex:1}}>
            <Text style={styles.largeFont}>도착지 설정</Text>
          </View>
          <View style={{flex:2}}>
          
          </View>
          <View style={{flex:1}}>
            <Text>도착지 설정</Text>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.buttonText}>알림 받기</Text>
          </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  largeFont:{
    marginTop:15,
    marginLeft:25,
    fontSize:20,
    width:160
  },
  middleFont:{
    fontSize:10,
    width:500
  },
  innerCircle:{
    marginTop: 6,
    marginLeft : 6.5,
    width: '40%', // 동그라미의 너비
    height: '40%', // 동그라미의 높이
    borderRadius: 50, // 동그라미의 반지름 (width / 2)
    backgroundColor: 'white', // 동그라미의 배경색    
  },
  circle_blue: {
    marginTop: 23,
    marginLeft : 25,
    width: '25%', // 동그라미의 너비
    height: '10%', // 동그라미의 높이
    borderRadius: 50, // 동그라미의 반지름 (width / 2)
    backgroundColor: 'blue', // 동그라미의 배경색
  },
  circle_oran: {
    marginTop: 23,
    marginLeft : 25,
    width: '25%', // 동그라미의 너비
    height: '10%', // 동그라미의 높이
    borderRadius: 50, // 동그라미의 반지름 (width / 2)
    backgroundColor: 'orange', // 동그라미의 배경색
  },
  narrowBox:{
    flex: 0.5,
    // backgroundColor:"red"
  },
  widerBox:{
    flex:4,
    // backgroundColor:"blue"
  },
  top:{
    flex:1,
    backgroundColor: 'white',
    flexDirection : 'row',

  },
  //상단 박스 스타일
  topCard:{
    borderRadius: 30,
    backgroundColor: '#47bf80',
    marginTop: 10,
    marginBottom: 10,
    marginLeft:10,
    marginRight:10,
    flex:1.5
  },
  info:{
    flex: 1.3,
    width: '100%',
    backgroundColor: 'white',
    flexDirection : 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftItem:{
    borderRadius: 30,
    marginTop: 40,
    marginRight:5,
    marginLeft:10,
    flex: 1,
    height: '70%', 
    alignItems : 'left',
    flexDirection : 'row'
  },
  //그림자 기본
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.46,
    shadowOffset: { width: 2, height: 2},
    shadowRadius: 50,
    elevation: 3,
    backgroundColor: 'white'
  },
  // 상단 박스 그림자
  shadow_top: {
    shadowColor: 'black',
    shadowOpacity: 0.46,
    shadowOffset: { width: 2, height: 2},
    elevation: 6,
  },
  rightItem:{
    borderRadius: 30,
    marginTop: 40,
    marginRight:10,
    marginLeft:5,
    flex: 1,
    height: '70%', 
    flexDirection : 'column'
  },
  
  map: {
    flex: 5.1,
    
  },
  button: {
    backgroundColor: '#47bf80', // 버튼 배경색상 추가
    borderRadius: 10,
    marginBottom: 20,
    width:'50%',
    height:'100%'
  },
  buttonText: {
    color: '#fff', // 버튼 글자색상 추가
    fontSize: 18,
    fontWeight: 'bold',
  },
});
