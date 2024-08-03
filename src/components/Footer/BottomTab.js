import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MyLocation } from '../../Map/MyLocation';
import { TimeTable } from '../../TimeTable/TimeTable';
import { Settings } from '../../Setting/Setting';

const Tab = createBottomTabNavigator();


export default BottomTabs = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="시간표" component={TimeTable} />
        <Tab.Screen name="나의 위치" component={MyLocation} />
        <Tab.Screen name="설정" component={Settings} />
      </Tab.Navigator>
    );
  };