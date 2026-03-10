import React, {useMemo} from 'react';
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
import {ARTWORKS} from './Data';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

export default function ArtScreen({navigation}) {
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();
  const artOfDay = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const day = Math.floor(diff / 86400000);
    return ARTWORKS[day % ARTWORKS.length];
  }, []);

  const openDetail = art => {
    navigation.navigate('ArtDetail', {artwork: art});
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingTop: (insets.top || 0) + 16, paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.screenTitle}>Art Spotlight</Text>
        <Text style={styles.screenSub}>Explore the art that shaped Venice.</Text>

        {/* Art of the day */}
        <TouchableOpacity
          style={styles.artDayCard}
          onPress={() => openDetail(artOfDay)}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['rgba(3,40,16,1)', 'rgba(3,40,16,0)']}
            start={{x: 0, y: 1}}
            end={{x: 0, y: 0}}
            style={styles.artDayGradient}
          />
          <View style={styles.artDayImgWrap}>
            <Image
              source={Assets.BOARD}
              style={styles.artDayImg}
              resizeMode="cover"
            />
          </View>
          <View style={styles.artDayInfo}>
            <Text style={styles.artDayLabel}>The art of the day</Text>
          </View>
        </TouchableOpacity>

        {/* See button */}
        <TouchableOpacity
          style={styles.seeBtnWrap}
          onPress={() => openDetail(artOfDay)}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#F6D28F', '#E5B96A']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.seeBtn}>
            <View style={styles.seeBtnInner}>
              <Text style={styles.seeBtnText}>See!</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Gallery label */}
        <View style={styles.galleryLabel}>
          <Text style={styles.galleryLabelText}>Gallery</Text>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {ARTWORKS.map(art => (
            <TouchableOpacity
              key={art.id}
              style={styles.gridCard}
              onPress={() => openDetail(art)}
              activeOpacity={0.85}>
              <Image
                source={Assets.ART[art.image]}
                style={styles.gridImg}
                resizeMode="cover"
              />
              <View style={styles.gridLabel}>
                <Text style={styles.gridName} numberOfLines={2}>{art.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  screenTitle: {color: Colors.GOLD, fontSize: 22, fontWeight: '700', marginBottom: 4},
  screenSub: {color: Colors.TEXT_DIM, fontSize: 13, marginBottom: 16},

  artDayCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  artDayGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  artDayImgWrap: {
    overflow: 'hidden',
  },
  artDayImg: {width: 170, height: 180},
  artDayInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  artDayLabel: {color: Colors.GOLD_LIGHT, fontSize: 16, fontWeight: '700', textAlign: 'center'},

  seeBtnWrap: {width: '100%', marginBottom: 20},
  seeBtn: {
    borderRadius: 999,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  seeBtnInner: {marginVertical: 12, marginHorizontal: 32},
  seeBtnText: {color: Colors.BG_DARK, fontWeight: '700', fontSize: 15},

  galleryLabel: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
  },
  galleryLabelText: {color: Colors.TEXT_DIM, fontSize: 13, fontWeight: '600'},

  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  gridCard: {
    width: CARD_W,
    backgroundColor: Colors.BG_CARD,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  gridImg: {width: '100%', height: 180},
  gridLabel: {
    backgroundColor: Colors.BG_CARD2,
    padding: 10,
    minHeight: 58,
    justifyContent: 'center',
  },
  gridName: {
    color: Colors.GOLD_LIGHT,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
