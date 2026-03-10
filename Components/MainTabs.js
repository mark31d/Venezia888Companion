import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, useWindowDimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Assets from './AssetRegistry';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import InfoScreen from './InfoScreen';
import LocationsScreen from './LocationsScreen';
import LocationDetailScreen from './LocationDetailScreen';
import FavoritesScreen from './FavoritesScreen';
import ArtScreen from './ArtScreen';
import ArtDetailScreen from './ArtDetailScreen';
import QuizMenuScreen from './QuizMenuScreen';
import QuizPlayScreen from './QuizPlayScreen';
import QuizResultScreen from './QuizResultScreen';
import MapScreen from './MapScreen';

const Tab = createBottomTabNavigator();
const LocStack = createNativeStackNavigator();
const ArtStack = createNativeStackNavigator();
const QuizStack = createNativeStackNavigator();
const MapStack = createNativeStackNavigator();

const TAB_ICON_KEYS = {
  Info: 'tab_info',
  Locations: 'tab_loc',
  Art: 'tab_art',
  Quiz: 'tab_quiz',
  Map: 'tab_map',
};

/** Высота таббара: pill (44) + padding (6*2) + marginBottom (20) = 76 */
export const TAB_BAR_HEIGHT = 76;

/** Хук: paddingBottom для ScrollView = TAB_BAR_HEIGHT + safeAreaInsets.bottom + extra */
export function useTabBarInset(extra = 16) {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + (insets.bottom || 0) + extra;
}

function CustomTabBar({state, navigation}) {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const pad = 12;
  const leftPad = pad + (insets.left || 0);
  const rightPad = pad + (insets.right || 0);
  const tabBarWidth = width - leftPad - rightPad;
  return (
    <View style={[styles.tabBarWrap, {marginBottom: (insets.bottom || 0) + 20, paddingHorizontal: leftPad}]}>
      <View style={[styles.tabBarOuter, {width: tabBarWidth}]}>
        <LinearGradient
          colors={['#030d06', '#1a4020']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientBg}
          borderRadius={28}
        />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const iconKey = TAB_ICON_KEYS[route.name];
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}>
              <LinearGradient
                colors={isFocused ? ['#FFE9B0', '#C8901A'] : ['rgba(255,233,176,0.18)', 'rgba(200,144,26,0.18)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.pill}>
                <Image
                  source={Assets.ICONS[iconKey]}
                  style={styles.tabIcon}
                  resizeMode="contain"
                />
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function LocationStack() {
  return (
    <LocStack.Navigator screenOptions={{headerShown: false}}>
      <LocStack.Screen name="LocationsList" component={LocationsScreen} />
      <LocStack.Screen name="LocationDetail" component={LocationDetailScreen} />
      <LocStack.Screen name="Favorites" component={FavoritesScreen} />
    </LocStack.Navigator>
  );
}

function ArtStackNav() {
  return (
    <ArtStack.Navigator screenOptions={{headerShown: false}}>
      <ArtStack.Screen name="ArtList" component={ArtScreen} />
      <ArtStack.Screen name="ArtDetail" component={ArtDetailScreen} />
    </ArtStack.Navigator>
  );
}

function QuizStackNav() {
  return (
    <QuizStack.Navigator screenOptions={{headerShown: false}}>
      <QuizStack.Screen name="QuizMenu" component={QuizMenuScreen} />
      <QuizStack.Screen name="QuizPlay" component={QuizPlayScreen} />
      <QuizStack.Screen name="QuizResult" component={QuizResultScreen} />
    </QuizStack.Navigator>
  );
}

function MapStackNav() {
  return (
    <MapStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {flex: 1, backgroundColor: 'transparent'},
      }}>
      <MapStack.Screen
        name="MapMain"
        component={MapScreen}
        options={{safeAreaInsets: {top: 0, bottom: 0, left: 0, right: 0}}}
      />
      <MapStack.Screen name="LocationDetail" component={LocationDetailScreen} />
    </MapStack.Navigator>
  );
}

const tabScreenOptions = {
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  sceneContainerStyle: {flex: 1, backgroundColor: 'transparent'},
  tabBarBackground: function() { return null; },
};

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={tabScreenOptions}>
      <Tab.Screen name="Info" component={InfoScreen} />
      <Tab.Screen name="Locations" component={LocationStack} />
      <Tab.Screen name="Art" component={ArtStackNav} />
      <Tab.Screen name="Quiz" component={QuizStackNav} />
      <Tab.Screen
        name="Map"
        component={MapStackNav}
        options={{
          safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
          sceneStyle: { flex: 1, marginBottom: 0, paddingBottom: 0 },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'stretch',
  },
  tabBarOuter: {
    flexDirection: 'row',
    borderRadius: 28,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(246,210,143,0.4)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  pill: {
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
});
