import {
  SafeAreaView,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  Animated,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {pickContext} from '../../App';
import {SelectOption} from '../components/Util/SelectOption';
SQLite.enablePromise(true);

export const TimeTable = () => {
  const {setPickLocation, setStOption, setEdOption, selectSt, selectEd} =
    React.useContext(pickContext);

  const [data, setData] = useState([]);
  const [isHappy, setIsHappy] = useState(true);
  const heightAnim = useRef(new Animated.Value(0.3)).current; // 초기 높이 값 (30%)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10; // 작은 움직임은 무시하고, 일정 크기 이상일 때만 응답
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          // 아래로 스와이프 시 확장
          Animated.timing(heightAnim, {
            toValue: 0.9, // 확장된 높이 (90%)
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy < 0) {
          // 위로 스와이프 시 축소
          Animated.timing(heightAnim, {
            toValue: 0.3, // 축소된 높이 (30%)
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

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
        tx.executeSql(
          'SELECT DISTINCT START_LOCATION FROM realBusTime;',
          [],
          (tx, results) => {
            const rows = results.rows;
            let startLocations = [];
            for (let i = 0; i < rows.length; i++) {
              startLocations.push(rows.item(i).START_LOCATION);
            }
            setStOption(startLocations);
          },
          error => {
            console.log('출발지 조회 에러:', error);
          },
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

  const fetchFilteredData = async (startLocation, endLocation, gubun) => {
    let db;
    try {
      db = await SQLite.openDatabase({
        name: 'realBusTable.db',
        createFromLocation: 1,
        location: 'Documents',
      });

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
        if (gubun) {
          query += ' AND GUBUN = ?';
          params.push(gubun);
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
          },
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
    fetchFilteredData(
      selectSt !== '0' ? selectSt : '',
      selectEd !== '0' ? selectEd : '',
      isHappy ? 'HAPPY' : 'SAD',
    );
  }, [selectSt, selectEd, isHappy]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 검색 창 */}
      <Animated.View
        style={[
          styles.optionContainer,
          {
            height: heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['30%', '90%'], // 30%에서 90%로 높이 애니메이션
            }),
          },
        ]}
        {...panResponder.panHandlers}>
        <SelectOption />
      </Animated.View>
      {/* 결과 값 */}
      <View style={styles.scrollViewContainer}>
        <ScrollView style={styles.ScrollView}>
          <View style={styles.switchContainer}>
            <Text>{isHappy ? '퇴근' : '출근'}</Text>
            <Switch
              value={isHappy}
              onValueChange={() => setIsHappy(previousState => !previousState)}
            />
          </View>
          {data.length > 0 ? (
            <View>
              {data.map((item, index) => (
                <Text
                  key={index}
                  style={styles.itemText}
                  onPress={() =>
                    setPickLocation({
                      st: item.START_LOCATION,
                      ed: item.END_LOCATION,
                    })
                  }>
                  GUBUN: {item.GUBUN}, TIMES: {item.TIMES}, INDEX: {item.INDEX},
                  MY_LOCATION: {item.MY_LOCATION}, END_LOCATION:{' '}
                  {item.END_LOCATION}, START_LOCATION: {item.START_LOCATION}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.loadingText}>로딩 중...</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  optionContainer: {
    justifyContent: 'center',
  },
  toggleButton: {
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
    minHeight: '70%',
    padding: 30,
    paddingBottom: 100,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  itemText: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loadingText: {
    padding: 10,
    textAlign: 'center',
  },
});
