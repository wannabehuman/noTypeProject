import { SafeAreaView, Text,Dimensions } from 'react-native';
import React, {useEffect, useState}      from 'react';
import SQLite                            from 'react-native-sqlite-storage';

SQLite.enablePromise(true);






export const TimeTable = () => {
    
    const [data, setData] = useState([]);
    const dbTest = async () => {
        let db;
        try {
            console.log('SQLite:', SQLite);
            db = await SQLite.openDatabase(
                {
                    name: 'realBusTable.db',
                    createFromLocation: 1, // `1`을 사용하여 assets 폴더에서 데이터베이스를 복사
                    location: 'Documents'
                }
            );
            console.log("데이터베이스 연결 성공");

            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM realBusTime;',
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