import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

export default function ArtDetailScreen({route, navigation}) {
  const {artwork} = route.params;
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <TouchableOpacity style={[styles.backBtn, {top: (insets.top || 0) + 16}]} onPress={() => navigation.goBack()}>
        <Image source={Assets.ICONS.icon_back} style={styles.backIcon} resizeMode="contain" tintColor={Colors.GOLD_LIGHT} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingTop: (insets.top || 0) + 60, paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        {/* Artwork image */}
        <View style={styles.imgWrap}>
          <Image
            source={Assets.ART[artwork.image]}
            style={styles.img}
            resizeMode="cover"
          />
        </View>
        {/* Name card */}
        <View style={styles.nameCard}>
          <Text style={styles.name}>{artwork.name}</Text>
        </View>
        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.desc}>{artwork.description}</Text>
          <View style={styles.metaRow}>
            <Image source={Assets.ICONS.profile} style={styles.metaIcon} resizeMode="contain" />
            <Text style={styles.metaText}>{artwork.artist}</Text>
          </View>
          <View style={styles.metaRow}>
            <Image source={Assets.ICONS.calendar} style={styles.metaIcon} resizeMode="contain" />
            <Text style={styles.metaText}>{artwork.year}</Text>
          </View>
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
    position: 'absolute',
    zIndex: 10,
    padding: 8,
  },
  backIcon: {width: 24, height: 24},
  imgWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  img: {
    width: '100%',
    height: 450,
  },
  nameCard: {
    backgroundColor: Colors.BG_CARD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  name: {color: Colors.GOLD_LIGHT, fontSize: 20, fontWeight: '700', textAlign: 'center'},
  infoCard: {
    backgroundColor: Colors.BG_CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  desc: {color: Colors.TEXT, fontSize: 14, lineHeight: 22, marginBottom: 16},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaIcon: {width: 18, height: 18, marginRight: 8, tintColor: Colors.ACCENT2},
  metaText: {color: Colors.TEXT_DIM, fontSize: 14},
});
