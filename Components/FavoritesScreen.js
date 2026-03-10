import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const FAV_KEY = '@timeless_favorites';

export default function FavoritesScreen({navigation}) {
  const [favs, setFavs] = useState([]);
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      loadFavs();
    }, []),
  );

  const loadFavs = async () => {
    try {
      const raw = await AsyncStorage.getItem(FAV_KEY);
      setFavs(raw ? JSON.parse(raw) : []);
    } catch {}
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: (insets.top || 0) + 16}]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={Assets.ICONS.icon_back} style={styles.backIcon} resizeMode="contain" tintColor={Colors.GOLD_LIGHT} />
        </TouchableOpacity>
        <LinearGradient
          colors={['#FFE9B0', '#C8901A']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.favIconWrap}>
          <Image source={Assets.ICONS.icon_heart_filled} style={styles.favIcon} resizeMode="contain" />
        </LinearGradient>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        {favs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No saved locations yet</Text>
            <Image source={Assets.LEO} style={styles.emptyLogo} resizeMode="contain" />
          </View>
        ) : (
          favs.map(loc => (
            <TouchableOpacity
              key={loc.id}
              style={styles.card}
              onPress={() => navigation.navigate('LocationDetail', {location: loc})}
              activeOpacity={0.85}>
              <Image
                source={Assets.LOC[loc.image]}
                style={styles.cardImg}
                resizeMode="cover"
              />
              <Text style={styles.cardName}>{loc.name}</Text>
            </TouchableOpacity>
          ))
        )}
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'transparent'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 8,
  },
  backIcon: {width: 24, height: 24},
  favIconWrap: {
    width: 60,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {width: 22, height: 22},
  headerSpacer: {width: 40},
  scroll: {flex: 1},
  content: {paddingHorizontal: 16, paddingTop: 8},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80},
  emptyText: {color: Colors.GOLD, fontSize: 16, marginBottom: 30},
  emptyLogo: {width: 160, height: 160, opacity: 0.7},
  card: {
    backgroundColor: Colors.BG_CARD,
    borderRadius: 18,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  cardImg: {width: '100%', height: 180},
  cardName: {
    color: Colors.GOLD_LIGHT,
    fontSize: 15,
    fontWeight: '700',
    padding: 12,
    backgroundColor: Colors.BG_CARD2,
    textAlign: 'center',
  },
});
