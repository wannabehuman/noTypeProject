import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MyLocation} from '../../Map/MyLocation';
import {TimeTable} from '../../TimeTable/TimeTable';
import {Settings} from '../../Setting/Setting';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="시간표"
        component={TimeTable}
        options={{
          title: '시간표',
          tabBarIcon: () => <Icon name="access-time" size={22} color="gray" />,
        }}
      />
      <Tab.Screen
        name="나의 위치"
        component={MyLocation}
        options={{
          title: '나의 위치',
          tabBarIcon: () => <Icon name="location-on" size={22} color="gray" />,
        }}
      />
      <Tab.Screen
        name="설정"
        component={Settings}
        options={{
          title: '설정',
          tabBarIcon: () => <Icon name="settings" size={22} color="gray" />,
        }}
      />
    </Tab.Navigator>
  );
};
