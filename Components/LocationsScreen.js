import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {LOCATIONS} from './Data';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

export default function LocationsScreen({navigation}) {
  const [randomLoc, setRandomLoc] = useState(null);
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();

  const pickRandom = () => {
    const r = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    setRandomLoc(r);
  };

  const openDetail = loc => {
    navigation.navigate('LocationDetail', {location: loc});
  };

  const openFavorites = () => {
    navigation.navigate('Favorites');
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingTop: (insets.top || 0) + 24}]}
        showsVerticalScrollIndicator={false}>
        {/* Random block */}
        <TouchableOpacity
          style={styles.randomCard}
          onPress={() => randomLoc && openDetail(randomLoc)}
          activeOpacity={randomLoc ? 0.85 : 1}>
          <LinearGradient
            colors={['rgba(3,40,16,1)', 'rgba(3,40,16,0)']}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            style={styles.randomCardGradient}
          />
          <View style={styles.randomImgWrap}>
            {randomLoc ? (
              <Image source={Assets.LOC[randomLoc.image]} style={styles.randomImg} resizeMode="cover" />
            ) : (
              <Image source={Assets.ICONS.question} style={styles.randomQImg} resizeMode="cover" />
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.65)']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.randomImgGradient}
            />
            <Text style={styles.randomText} numberOfLines={1}>
              {randomLoc ? randomLoc.name : 'Random location'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeBtnWrap} onPress={pickRandom} activeOpacity={0.8}>
          <LinearGradient
            colors={['#F6D28F', '#E5B96A']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.seeBtn}>
            <View style={styles.seeBtnInner}>
              <Text style={styles.seeBtnText}>{randomLoc ? 'Another location' : 'See!'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Row: choose label + favorites btn */}
        <View style={styles.listHeader}>
          <Text style={styles.listLabel}>Choose the location to visit</Text>
          <TouchableOpacity style={styles.favBtn} onPress={openFavorites} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FFE9B0', '#C8901A']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.favGradient}>
              <Image source={Assets.ICONS.icon_heart_filled} style={styles.favIcon} resizeMode="contain" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Locations list */}
        {LOCATIONS.map(loc => (
          <TouchableOpacity
            key={loc.id}
            style={styles.locCard}
            onPress={() => openDetail(loc)}
            activeOpacity={0.85}>
            <LinearGradient
              colors={['rgba(3,40,16,1)', 'rgba(3,40,16,0)']}
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}
              style={styles.locCardGradient}
            />
            <View style={styles.locImgWrap}>
              <Image
                source={Assets.LOC[loc.image]}
                style={styles.locImg}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.65)']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.locImgGradient}
              />
              <Text style={styles.locName} numberOfLines={1}>{loc.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={[styles.contentBottom, {marginBottom: bottomPadding}]} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'transparent'},
  scroll: {flex: 1},
  content: {marginHorizontal: 16},

  randomCard: {
    marginBottom: 12,
    borderRadius: 26,
    borderWidth: 0.4,
    
    borderColor: '#F1CB85',
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  randomCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  randomImgWrap: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  randomImgGradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '45%',
  },
  randomText: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    color: Colors.GOLD_LIGHT,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  randomQImg: {width: '100%', height: 220},

  seeBtnWrap: {width: '100%', marginBottom: 20},
  seeBtn: {
    borderRadius: 999,
    marginVertical: 0,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  seeBtnInner: {marginVertical: 12, marginHorizontal: 32},
  seeBtnText: {color: Colors.BG_DARK, fontWeight: '700', fontSize: 15},
  contentBottom: {height: 20},

  randomImg: {width: '100%', height: 220},

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listLabel: {color: Colors.TEXT_DIM, fontSize: 14},
  favBtn: {
    width: 60,
    height: 38,
    borderRadius: 25,
    overflow: 'hidden',
  },
  favGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {width: 24, height: 24},

  locCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 26,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  locCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  locImgWrap: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  locImg: {width: '100%', height: 180},
  locImgGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  locName: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    color: Colors.GOLD_LIGHT,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
