import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, PermissionsAndroid, Platform,View,Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { WebView } from 'react-native-webview';
import config from '../util/apiKey.js';

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
         <View style={[styles.topCard,styles.shadow_top]}>
        
        </View>  
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
          <Text>sdsd</Text>
        </View>
        <View style={[styles.rightItem,styles.shadow]}>
          
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  top:{
    flex:0.5,
    backgroundColor: 'white',
  
  },
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
    margin: 50,
    marginRight:5,
    marginLeft:10,
    flex: 1,
    height: '70%', 
    // backgroundColor:'yellow',
    // borderWidth: 2,
    // borderColor: 'gray',
    alignItems : 'left',
    
  },
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.46,
    shadowOffset: { width: 2, height: 2},
    shadowRadius: 50,
    elevation: 3,
    backgroundColor: 'white'
  },
  shadow_top: {
    shadowColor: 'black',
    shadowOpacity: 0.46,
    shadowOffset: { width: 2, height: 2},
    elevation: 3,
  },
  rightItem:{
    borderRadius: 30,
    marginTop: 50,
    marginRight:10,
    marginLeft:5,
    flex: 1,
    height: '70%', 
    // borderWidth: 2,
    // borderColor: 'gray',
    // alignItems : 'right',
  },
  
  map: {
    flex: 1.2,
    
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
