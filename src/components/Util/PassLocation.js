import React, { useEffect, useRef, useState  } from 'react';

import { WebView } from 'react-native-webview';

import { View, Text, StyleSheet } from 'react-native';



const PassLocation = ({ data }) => {
    if(!data){
        data = []
    }
  return (
    <View style={styles.container}>
    


      <View style={styles.row}>
        {data.slice(0,5).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize:10}}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        {data.slice(5,10).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize:10}}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        {data.slice(10,15).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize:10}}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.empty}>
        {data.length === 0 ? (
          <View>
            <Text style={{    fontSize : 30}}>추후 업데이트 예정</Text>
          </View>
        ) : ""}
      </View>
      <View style={styles.row}>
        {data.slice(16,21).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize:10}}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        {data.slice(21,26).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize:10}} >{item}</Text>
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

  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  item: {
    width: 72.8, // 각 아이템의 너비를 지정
    height: 40, // 각 아이템의 높이를 지정
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'orange',
    borderRadius: 30,
    marginTop: 27,
    marginLeft: 6,
  },
  empty:{
    marginLeft: 70,
    justifyContent: 'center',
  }
});

export default PassLocation;