import React from 'react';
import {SafeAreaView, View, Text, SectionList, StyleSheet} from 'react-native';

export const Settings = () => {
  return (
    // <SafeAreaView style={styles.containerBox}>
    <View style={styles.container}>
      <SectionList
        sections={[
          {title: '버전', data: ['1.00']},
          {title: '개발자', data: ['PetiteZel']},
          {title: '배포일', data: ['최초: 2024-08-23']},
          {
            title: '개발 예정',
            data: [
              '도착지 알람 서비스',
              '사상-녹산 경로 추가',
              '화전-하단 경로 추가',
            ],
          },
        ]}
        renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => `basicListEntry-${item}`}
      />
    </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
