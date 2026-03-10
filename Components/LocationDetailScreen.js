import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const FAV_KEY = '@timeless_favorites';

export default function LocationDetailScreen({route, navigation}) {
  const {location} = route.params;
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    loadFav();
  }, []);

  const loadFav = async () => {
    try {
      const raw = await AsyncStorage.getItem(FAV_KEY);
      const favs = raw ? JSON.parse(raw) : [];
      setIsFav(favs.some(f => f.id === location.id));
    } catch {}
  };

  const toggleFav = async () => {
    try {
      const raw = await AsyncStorage.getItem(FAV_KEY);
      let favs = raw ? JSON.parse(raw) : [];
      if (isFav) {
        favs = favs.filter(f => f.id !== location.id);
      } else {
        favs.push(location);
      }
      await AsyncStorage.setItem(FAV_KEY, JSON.stringify(favs));
      setIsFav(!isFav);
    } catch {}
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${location.name}\n${location.address}\n\nDiscover this amazing place in Venice!`,
      });
    } catch {}
  };

  const openMaps = () => {
    const url = `https://maps.apple.com/?q=${location.lat},${location.lng}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingTop: (insets.top || 0) + 16, paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={Assets.ICONS.icon_back} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        {/* Image */}
        <View style={styles.imgCard}>
          <LinearGradient
            colors={['rgba(3,40,16,1)', 'rgba(3,40,16,0)']}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            style={styles.imgCardGradient}
          />
          <View style={styles.imgWrap}>
            <Image
              source={Assets.LOC[location.image]}
              style={styles.img}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.imgOverlay}
            />
          </View>
        </View>
        {/* Name */}
        <View style={styles.nameCard}>
          <Text style={styles.name}>{location.name}</Text>
        </View>
        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.desc}>{location.description}</Text>
          <View style={styles.addrRow}>
            <Image
              source={Assets.ICONS.icon_pin}
              style={styles.pinImg}
              resizeMode="contain"
            />
            <Text style={styles.addr}>{location.address}</Text>
          </View>
        </View>
        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.mapsBtn} onPress={openMaps} activeOpacity={0.85}>
            <LinearGradient
              colors={['#FFE9B0', '#C8901A']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.mapsBtnGradient}>
              <Text style={styles.mapsBtnText}>Look at maps</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onShare} activeOpacity={0.85}>
            <Image
              source={Assets.ICONS.icon_share}
              style={styles.iconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, isFav && styles.iconBtnActive]}
            onPress={toggleFav}
            activeOpacity={0.85}>
            <Image
              source={isFav ? Assets.ICONS.icon_heart_filled : Assets.ICONS.icon_heart}
              style={styles.iconImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'transparent'},
  scroll: {flex: 1},
  content: {paddingHorizontal: 16},
  backBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 8,
    marginLeft: -4,
  },
  backIcon: {width: 24, height: 24, tintColor: Colors.GOLD_LIGHT},
  imgCard: {
    marginBottom: 12,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  imgCardGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 24,
  },
  imgWrap: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: 220,
  },
  imgOverlay: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '45%',
  },
  nameCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  name: {color: Colors.GOLD_LIGHT, fontSize: 20, fontWeight: '700', textAlign: 'center'},
  descCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  desc: {color: Colors.TEXT, fontSize: 14, lineHeight: 22, marginBottom: 12},
  addrRow: {flexDirection: 'row', alignItems: 'flex-start'},
  pinImg: {width: 22, height: 22, marginRight: 6, marginTop: 1},
  addr: {color: Colors.TEXT_DIM, fontSize: 13, flex: 1, lineHeight: 18},
  actions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  mapsBtn: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
  },
  mapsBtnGradient: {
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapsBtnText: {color: Colors.BG_DARK, fontWeight: '700', fontSize: 14},
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: Colors.BG_CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  iconBtnActive: {backgroundColor: Colors.GOLD + '33', borderColor: Colors.GOLD},
  iconImg: {width: 22, height: 22},
});
