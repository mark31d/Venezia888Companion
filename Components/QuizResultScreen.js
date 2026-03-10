import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function QuizResultScreen({route, navigation}) {
  const {level, score, total} = route.params;
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();

  const tryAgain = () => {
    navigation.replace('QuizPlay', {level});
  };

  return (
    <View style={[styles.root, {paddingBottom: bottomPadding}]}>
      {/* Back */}
      <TouchableOpacity style={[styles.backBtn, {top: (insets.top || 0) + 16}]} onPress={() => navigation.navigate('QuizMenu')}>
        <Image source={Assets.ICONS.icon_back} style={styles.backIcon} resizeMode="contain" tintColor={Colors.GOLD_LIGHT} />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.center}>
        <Text style={styles.levelName}>{level}</Text>
        <Image source={Assets.LEO} style={styles.logo} resizeMode="contain" />

        {/* Score badge */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>Your score</Text>
          <Text style={styles.scoreValue}>
            {score}/{total}
          </Text>
        </View>

        {/* Start again */}
        <TouchableOpacity style={styles.tryBtnWrap} onPress={tryAgain} activeOpacity={0.85}>
          <LinearGradient
            colors={['#F6D28F', '#E5B96A']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.tryBtn}>
            <View style={styles.tryBtnInner}>
              <Text style={styles.tryBtnText}>Start again</Text>
            </View>
            <Image
              source={Assets.ICONS.chevron}
              style={styles.tryBtnChevron}
              resizeMode="contain"
              tintColor={Colors.BG_DARK}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'transparent'},
  backBtn: {
    position: 'absolute',
    zIndex: 10,
    padding: 8,
  },
  backIcon: {width: 24, height: 24},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  levelName: {
    color: Colors.GOLD_LIGHT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  logo: {
    width: 360,
    height: 360,
    marginBottom: 24,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.BG_CARD,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  scoreLabel: {color: Colors.TEXT_DIM, fontSize: 15},
  scoreValue: {color: Colors.GOLD_LIGHT, fontSize: 18, fontWeight: '700'},
  tryBtnWrap: {width: '100%'},
  tryBtn: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tryBtnInner: {marginVertical: 16, marginHorizontal: 32},
  tryBtnText: {color: Colors.BG_DARK, fontSize: 16, fontWeight: '700', textAlign: 'center'},
  tryBtnChevron: {position: 'absolute', right: 10, width: 25, height: 25, transform: [{rotate: '270deg'}]},
});
