import React from 'react';
import {SafeAreaView, View, Text, SectionList, StyleSheet} from 'react-native';

export const Settings = () => {
  return (
    // <SafeAreaView style={styles.containerBox}>
    <View style={styles.container}>
      <SectionList
        style={styles.listContainer}
        sections={[
          {title: '버전', data: ['1.00 ver']},
          {title: '개발자', data: ['밥', 'PetiteZel']},
          {title: '배포일', data: ['최초:  2024-08-23']},
        ]}
        renderItem={({item, idx}) => (
          <Text
            style={{
              fontSize: 14,
              padding: 5,
              paddingBottom: 0,
              margin: 10,
              marginTop: 0,
              marginLeft: 50,
            }}>
            {'🎃 ' + item}
          </Text>
        )}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => `basicListEntry-${item}`}
      />
      <SectionList
        style={styles.listContainer}
        sections={[
          {
            title: '개발 예정',
            data: [
              '도착지 알람 서비스',
              '사상-녹산 경로 추가',
              '화전-하단 경로 추가',
            ],
          },
        ]}
        renderItem={({item, idx}) => (
          <Text
            style={{
              fontSize: 12,
              padding: 10,
              paddingLeft: 50,
            }}>
            {'💣 ' + item}
          </Text>
        )}
        renderSectionHeader={({section}) => (
          <Text style={[styles.sectionHeader, styles.notYet]}>
            {section.title}
          </Text>
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
    width: '100%',
    paddingTop: 22,
    backgroundColor: '#47bf80',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    width: 300,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 5,
  },
  sectionHeader: {
    padding: 0,
    paddingTop: 5,
    paddingBottom: 7,
    marginLeft: 10,
    width: 100,
    textAlign: 'center',
    textAlignVertical: 'center',

    borderRadius: 5,
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#f17b00',
  },
  notYet: {
    backgroundColor: 'gray',
  },
  item: {
    fontSize: 1,
    backgroundColor: 'yellow',
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
