import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {CITY_INFO, FAQ} from './Data';
import {useTabBarInset} from './MainTabs';

const {width} = Dimensions.get('window');

function FaqItem({item, index}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.faqItemWrap}>
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => setOpen(v => !v)}
        activeOpacity={0.8}>
        <LinearGradient
          colors={['#030d06', '#1a4020']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.faqItemGradient}
        />
        <Text style={styles.faqQ}>{item.question}</Text>
        <Image
          source={Assets.ICONS.chevron}
          style={[styles.faqArrow, open && styles.faqArrowOpen]}
          resizeMode="contain"
          tintColor={Colors.GOLD}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.faqBody}>
          <Text style={styles.faqA}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = useTabBarInset(12);
  const topPadding = (insets.top || 0) + 16;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingTop: topPadding, paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <Image
          source={Assets.LOC.loc_1}
          style={styles.heroImg}
          resizeMode="cover"
        />
        {/* City description */}
        <View style={styles.descCard}>
          <Text style={styles.descText}>{CITY_INFO.description}</Text>
        </View>

        {/* FAQ Header */}
        <View style={styles.faqTitleWrap}>
          <Text style={styles.faqTitle}>FAQ – 10 most common questions</Text>
        </View>

        {/* FAQ Items */}
        {FAQ.map((item, i) => (
          <FaqItem key={i} item={item} index={i} />
        ))}
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'transparent'},
  scroll: {flex: 1},
  content: {},
  heroImg: {
    width: width - 32,
    height: 200,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 12,
    overflow: 'hidden',
  },
  descCard: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  descText: {
    color: Colors.TEXT,
    fontSize: 14,
    lineHeight: 22,
  },
  faqTitleWrap: {
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  faqTitle: {
    color: Colors.TEXT_DIM,
    fontSize: 13,
    fontWeight: '600',
  },
  faqItemWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(246,210,143,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  faqItemGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  faqQ: {
    color: Colors.GOLD_LIGHT,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 8,
  },
  faqArrow: {
    width: 18,
    height: 18,
  },
  faqArrowOpen: {
    transform: [{rotate: '180deg'}],
  },
  faqBody: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  faqA: {
    color: Colors.TEXT_DIM,
    fontSize: 13,
    lineHeight: 20,
  },
});
