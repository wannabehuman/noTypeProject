import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {pickContext} from '../../../App';

export const SelectOption = () => {
  const {stOption, edOption, selectSt, setSelectSt, selectEd, setSelectEd} =
    React.useContext(pickContext);

  return (
    <View style={styles.searchBox}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectSt}
          style={styles.pickerSt}
          onValueChange={st => setSelectSt(st)}>
          <Picker.Item label="출발지 선택" value="0" />
          {stOption.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
      </View>
      <Picker
        selectedValue={selectEd}
        style={styles.pickerEd}
        onValueChange={ed => setSelectEd(ed)}>
        <Picker.Item label="도착지 선택" value="0" />
        {edOption.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: 140,
    backgroundColor: 'white',

    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 5,
    elevation: 5,
  },
  pickerContainer: {
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  pickerSt: {
    height: 60,
    width: '100%',
  },
  pickerEd: {
    height: 60,
    width: '90%',
  },
});
