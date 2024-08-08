import { SafeAreaView, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { Picker } from '@react-native-picker/picker';
SQLite.enablePromise(true);

export const TimeTable = () => {

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

    return (
        <SafeAreaView style={styles.container}>
            <Picker
                selectedValue={selectedStartLocation}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedStartLocation(itemValue)}
            >
                <Picker.Item label="Select Start Location" value="0" />
                {uniqueStartLocations.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                ))}
            </Picker>
            <Picker
                selectedValue={selectedEndLocation}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedEndLocation(itemValue)}
            >
                <Picker.Item label="Select End Location" value="0" />
                {uniqueEndLocations.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item} />
                ))}
            </Picker>
            <ScrollView>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <Text key={index} style={styles.itemText}>
                            GUBUN: {item.GUBUN}, TIMES: {item.TIMES}, INDEX: {item.INDEX},
                            MY_LOCATION: {item.MY_LOCATION}, END_LOCATION: {item.END_LOCATION},
                            START_LOCATION: {item.START_LOCATION}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.loadingText}>로딩 중...</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10
    },
    picker: {
        height: '10%',
        width: '100%',
    },
    itemText: {
        // padding: 10,
        // borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    loadingText: {
        // padding: 10,
        textAlign: 'center'
    }
});