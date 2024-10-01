import React, {useEffect, useRef, useState} from 'react';

import {WebView} from 'react-native-webview';

import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const countButton = Math.round((width - 60) / 80);

let lastButton = 0;
const PassLocation = ({data}) => {
  if (!data) {
    data = [];
  }
  const countRow = Math.floor(data.length / countButton);
  lastButton = data.length % countButton;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,

            position: 'relative',
          }}>
          <View
            style={[
              styles.rowBoxContainer,
              {
                alignItems: 'center',
              },
            ]}>
            {Array.from({length: countRow}).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.rowBox,
                  i % 2 === 0
                    ? {borderLeftWidth: 0, borderRightWidth: 3}
                    : {borderLeftWidth: 3, borderRightWidth: 0},
                  i === countRow - 1 && lastButton === 0
                    ? {borderLeftWidth: 0, borderRightWidth: 0}
                    : {},
                  {width: countButton * 62},
                ]}></View>
            ))}
            {lastButton == 0 ? null : (
              <View
                key="last"
                style={
                  countRow % 2 === 0
                    ? {
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: countButton * 78 - 70,
                      }
                    : {
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        width: countButton * 78 - 70,
                      }
                }>
                <View
                  style={[styles.rowBoxLast, {width: lastButton * 50}]}></View>
              </View>
            )}
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View style={styles.empty}>
              {data.length === 0 ? (
                <View>
                  <Text style={{fontSize: 30}}>추후 업데이트 예정</Text>
                </View>
              ) : (
                ''
              )}
            </View>
            {Array.from({length: countRow + 1}).map((_, i) => (
              <View
                style={[
                  styles.row,
                  i % 2 === 0
                    ? {flexDirection: 'row'}
                    : {flexDirection: 'row-reverse'},
                  {
                    width: 73 * countButton + 10 * (countButton - 1),
                  },
                ]}>
                {data
                  .slice(i * countButton, (i + 1) * countButton)
                  .map((item, index) => (
                    <View key={item} style={styles.item}>
                      <Text style={{fontSize: 10}}>{item}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* <View style={styles.row}>
        {data.slice(0, 5).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize: 10}}>1{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        {data.slice(5, 10).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize: 10}}>2{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        {data.slice(10, 15).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize: 10}}>3{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.empty}>
        {data.length === 0 ? (
          <View>
            <Text style={{fontSize: 30}}>4추후 업데이트 예정</Text>
          </View>
        ) : (
          ''
        )}
      </View>
      <View style={styles.row}>
        {data.slice(16, 21).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize: 10}}>5{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        {data.slice(21, 26).map((item, index) => (
          <View key={item} style={styles.item}>
            <Text style={{fontSize: 10}}>6{item}</Text>
          </View>
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
    paddingTop: 20,
    paddingBottom: 70,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 10,
    width: width - 50,

    marginBottom: 10,
  },

  // rowOdd: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  //   rowGap: 10,
  //   columnGap: 10,
  //   width: '100%',
  //   padding: 10,
  // },

  rowBoxContainer: {
    position: 'absolute',
    left: 0,
    top: 30,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowBoxLast: {
    height: 50,
    borderTopWidth: 3,
    borderColor: 'orange',
  },

  rowBox: {
    height: 50,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: 'orange',
  },

  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  item: {
    width: 73, // 각 아이템의 너비를 지정
    height: 40, // 각 아이템의 높이를 지정
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'orange',
    backgroundColor: 'white',
    borderRadius: 30,
    // marginTop: 27,
  },
  empty: {
    justifyContent: 'center',
  },
});

export default PassLocation;
