import React, { useEffect, useRef, useState  } from 'react';

import { WebView } from 'react-native-webview';

import { View, Text, StyleSheet } from 'react-native';


const data = [
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' },
    { id: 4, content: 'Item 4' },
    { id: 5, content: 'Item 5' }
  ];

const PassLocation = ({ data }) => {
    if(!data){
        data = []
    }
  return (
    <View style={styles.container}>
    

      {/* 첫 번째 열 아래쪽으로 내려가는 부분 */}
      <View style={styles.row}>
        {data.slice(0,7).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
      {/* 첫 번째 열 아래쪽으로 내려가는 부분 */}
      <View style={styles.row}>
        {data.slice(7,14).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
      {/* 첫 번째 열 아래쪽으로 내려가는 부분 */}
      <View style={styles.row}>
        {data.slice(15,21).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontSize: 4,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  item: {
    width: 56, // 각 아이템의 너비를 지정
    height: 45, // 각 아이템의 높이를 지정
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 7,
    marginleft: 10
  },
});

export default PassLocation;