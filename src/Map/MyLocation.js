/*
 * 위치를... x = 도착지   y = 이전 도착지 라고 가정했을 때 x와 같고 y보다 큰 경우 두어번 푸시알림 보내야할 듯
    지오펜싱? 사용하면 쉬울 듯함 찾아보기. 
 */


import React, { useEffect, useRef, useState  } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, PermissionsAndroid, Platform,View,Text ,TouchableOpacity} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { WebView } from 'react-native-webview';
import config from '../util/apiKey.js';
import { Picker } from '@react-native-picker/picker';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

const { width, height } = Dimensions.get('window');

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>카카오 맵</title>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.APIKEY_MAP}"></script>
</head>
<body>
    <div id="map" style="width:${width-20}px;height:${height/2.8}px; border-radius:30px;"></div>
    <script type="text/javascript">
        let map = '';
        let marker = '';

        function initMap(lat, lng) {
            console.log('initMap called with:', lat, lng);
            var container = document.getElementById('map');
            var options = { 
                center: new kakao.maps.LatLng(lat, lng),
                level: 3
            };
            
            map = new kakao.maps.Map(container, options);

            marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng)
            });
            marker.setMap(map);

            var linePath = [
              new kakao.maps.LatLng(35.19403, 129.0615167),
              new kakao.maps.LatLng(36,129),
              new kakao.maps.LatLng(36.01,129.1) 
            ];
            var polyline = new kakao.maps.Polyline({
              path: linePath, // 선을 구성하는 좌표배열 입니다
              strokeWeight: 5, // 선의 두께 입니다
              strokeColor: '#FFAE00', // 선의 색깔입니다
              strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
              strokeStyle: 'solid' // 선의 스타일입니다
            });
    
            polyline.setMap(map);  
        }

        function updatePosition(lat, lng) {
            console.log('updatePosition called with:', lat, lng);
            var moveLatLon = new kakao.maps.LatLng(lat, lng);
            map.setCenter(moveLatLon);
            marker.setPosition(moveLatLon);
            
        }



        window.onload = function() {
            
            // initMap(33.450701, 126.570667); // 초기 위치 설정
        }
    </script>
</body>
</html>
`;

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
    const start = "하단"
    const end   = "녹산"

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
                let query = 'SELECT * FROM realBusTime WHERE 1=1';
                const params = [];

                if (startLocation) {
                    query += ' AND START_LOCATION = ?';
                    params.push(startLocation);
                }

                if (endLocation) {
                    query += ' AND END_LOCATION = ?';
                    params.push(endLocation);
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
      const getLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
  
          Geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              if (webViewRef.current) {
                console.log(`Injecting updatePosition(${latitude}, ${longitude})`);
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
      <View style={styles.top}>
         <View style={[styles.topCard,styles.shadow_top]}></View>
      </View>

      <View style={styles.map}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: html }}
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
        <View style={[styles.leftItem, styles.shadow]}>
          <View style={styles.narrowBox}>
            <View style={{flex:0.7}}>
               <Text style={styles.largeFont}>나의 경로</Text>
            </View>
            <View style={{flex:1}}>
              <View style={styles.circle_blue}>
              
              </View>
            </View>
          
            <View style={{flex:1}}>
              <View style={styles.circle_oran}>
            
              </View>
            </View>
          </View>
          <View style={styles.widerBox}>
          <View style={{flex:0.7}}>

          </View>
            <View style={{flex:1}}>
              {/* <Text style={styles.largeFont}>{start}</Text> */}
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
        <View style={[styles.rightItem,styles.shadow]}>
          <View style={{flex:1}}>
            <Text style={styles.largeFont}>도착지 설정</Text>
          </View>
          <View style={{flex:2}}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Contact')}>
            <Text style={styles.buttonText}>알림 받기</Text>
          </TouchableOpacity>
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
    width:160
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
    marginTop: 23.5,
    marginLeft : 25,
    width: '25%', // 동그라미의 너비
    height: '10%', // 동그라미의 높이
    borderRadius: 50, // 동그라미의 반지름 (width / 2)
    backgroundColor: 'blue', // 동그라미의 배경색
  },
  circle_oran: {
    marginTop: 23.5,
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
    flex:0.5,
    backgroundColor: 'white',
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
    flex: 1,
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
    flex: 1.2,
    
  },
  button: {
    backgroundColor: '#47bf80', // 버튼 배경색상 추가
    // paddingVertical: 15,
    // paddingHorizontal: 30,
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



// export const MyLocation = () => {
//     const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1">
//         <title>카카오 맵</title>
//         </head>
//         <body>
//         <div id="map" style="width:500px;height:1000px;"></div>
//         <script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.APIKEY_MAP}">
        
//         </script>
//         <script type="text/javascript">
//         console.log("ass");
//         (function () {
//             const container = document.getElementById('map');
//             container.innerHTML = new kakao.maps.LatLng()
//             const options = { 
//                 center: new kakao.maps.LatLng(33.450701, 126.570667),
//                 level: 3
//             };
            
//             const map = new kakao.maps.Map(container, options);
//             // const geocoder = new kakao.maps.services.Geocoder()
//             var markerPosition  = new kakao.maps.LatLng(33.450701, 126.570667); 

//             var marker = new kakao.maps.Marker({
//                 position: markerPosition
//             });
//             marker.setMap(map);
//         })();
//         </script>       
//         </body>
//         </html>
//         `;
//         // Geolocation.watchPosition()(
//         //     (position) => {
//         //       console.log(position);
//         //     },
//         //     (error) => {
//         //       // See error code charts below.
//         //       console.log(error.code, error.message);
//         //     },
            
//         //   );
     
//     return (
        
//         <SafeAreaView style={{flex: 1}}>
//         <WebView
//             originWhitelist={['*']}
//             source={{ html: html }}
//             style={styles.map}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             onMessage={(event) => {
//                 console.log('WebView message:', event.nativeEvent.data);
//             }}
//             onError={(syntheticEvent) => {
//                 const { nativeEvent } = syntheticEvent;
//                 console.warn('WebView error: ', nativeEvent);
//             }}
//             onLoadEnd={(syntheticEvent) => {
//                 const { nativeEvent } = syntheticEvent;
//                 console.log('WebView loaded: ', nativeEvent);
//             }}
//         />
//     </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     map: {
//       flex: 1,
//       width: width,
//       height: height,
//     },
//   });
