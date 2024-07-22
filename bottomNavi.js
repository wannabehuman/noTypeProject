import React, {useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import { WebView } from 'react-native-webview';
import config from './apiKey.js'
import { SafeAreaView, Platform,Text,View,StyleSheet,Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
SQLite.enablePromise(true);
// console.log(SQLite)
// import { Text } from 'react-native-reanimated/lib/typescript/Animated';




export const TimeTable = () => {
    const [data, setData] = useState([]);
    const dbTest = async () => {
        let db;
        try {
            console.log('SQLite:', SQLite);
            db = await SQLite.openDatabase(
                {
                    name: 'noksanBus.db',
                    createFromLocation: 1, // `1`을 사용하여 assets 폴더에서 데이터베이스를 복사
                    location: 'default'
                }
            );
            console.log('DB 열기 성공');

            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM timeTable;',
                    [],
                    (tx, results) => {
                        const rows = results.rows;
                        let items = [];
                        for (let i = 0; i < rows.length; i++) {
                            items.push(rows.item(i));
                        }
                        console.log(items[0]);
                        setData(JSON.stringify(items));
                    },
                    error => {
                        console.log('쿼리 실행 에러:', error);
                    }
                );
            });
        } catch (error) {
            console.log('DB 연결 중 에러 발생:', error);
        }
    };

    useEffect(() => {
        dbTest();
    }, []);

    return (
        <SafeAreaView>
            <Text>{data}</Text>
        </SafeAreaView>
    );
};

export const MyLocation = () => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>카카오 맵</title>
        </head>
        <body>
        <div id="map" style="width:500px;height:1000px;"></div>
        <script type="text/javascript" src="http://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.APIKEY_MAP}">
        
        </script>
        <script type="text/javascript">
        console.log("ass");
        (function () {
            const container = document.getElementById('map');
            container.innerHTML = new kakao.maps.LatLng()
            const options = { 
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };
            
            const map = new kakao.maps.Map(container, options);
            const geocoder = new kakao.maps.services.Geocoder()
        })();
        </script>       
        </body>
        </html>
        `;

    return (
        
        <SafeAreaView style={{flex: 1}}>
        <WebView
            originWhitelist={['*']}
            source={{ html: html }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => {
                console.log('WebView message:', event.nativeEvent.data);
            }}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
            }}
            onLoadEnd={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.log('WebView loaded: ', nativeEvent);
            }}
        />
    </SafeAreaView>
    );
};

export const Settings = () => {
    return (
        <SafeAreaView >
            {/* 다른 UI 요소들 */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
      flex: 1,
      width: width,
      height: height,
    },
  });
