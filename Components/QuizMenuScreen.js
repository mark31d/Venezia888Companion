import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Assets from './AssetRegistry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Colors from './Colors';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SCORES_KEY = '@timeless_quiz_scores';

const LEVELS = [
  {key: 'Beginner', label: 'Beginner', count: 15},
  {key: 'Explorer', label: 'Explorer', count: 20},
  {key: 'Expert', label: 'Expert', count: 30},
];

const MEDAL_ICON = {Expert: 'medal_1', Explorer: 'medal_2', Beginner: 'medal_3'};

export default function QuizMenuScreen({navigation}) {
  const [scores, setScores] = useState({});
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      loadScores();
    }, []),
  );

  const loadScores = async () => {
    try {
      const raw = await AsyncStorage.getItem(SCORES_KEY);
      setScores(raw ? JSON.parse(raw) : {});
    } catch {}
  };

  const startLevel = level => {
    navigation.navigate('QuizPlay', {level});
  };

  const startRandom = () => {
    const r = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    navigation.navigate('QuizPlay', {level: r.key});
  };

  const hasScores = Object.keys(scores).length > 0;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingTop: (insets.top || 0) + 16, paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Test Your Venezia Knowledge</Text>
        <Text style={styles.sub}>Choose your level and challenge yourself.</Text>

        {LEVELS.map(lv => (
          <TouchableOpacity
            key={lv.key}
            style={styles.levelRow}
            onPress={() => startLevel(lv.key)}
            activeOpacity={0.85}>
            <View style={styles.levelBtn}>
              <Text style={styles.levelText}>{lv.label}</Text>
            </View>
            <LinearGradient
              colors={['#FFE9B0', '#C8901A']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.arrowBtn}>
              <Image
                source={Assets.ICONS.chevron}
                style={styles.chevronIcon}
                resizeMode="contain"
                tintColor={Colors.BG_DARK}
              />
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.randomWrap}
          onPress={startRandom}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#F6D28F', '#E5B96A']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.randomBtn}>
            <View style={styles.randomBtnInner}>
              <Text style={styles.randomText}>Start random quiz</Text>
              <Image
                source={Assets.ICONS.chevron}
                style={styles.chevronIcon}
                resizeMode="contain"
                tintColor={Colors.BG_DARK}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {hasScores && (
          <View style={styles.bestSection}>
            <Text style={styles.bestTitle}>Your Best Results</Text>
            {LEVELS.filter(lv => scores[lv.key] !== undefined).map(lv => (
              <View key={lv.key} style={styles.bestRow}>
                <Image source={Assets.ICONS[MEDAL_ICON[lv.key]]} style={styles.medal} resizeMode="contain" tintColor={Colors.GOLD} />
                <Text style={styles.bestLevel}>{lv.key}</Text>
                <View style={styles.bestScoreBadge}>
                  <Text style={styles.bestScore}>
                    {scores[lv.key]}/{lv.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'transparent'},
  scroll: {flex: 1},
  content: {paddingHorizontal: 16},
  title: {color: Colors.TEXT, fontSize: 20, fontWeight: '700', marginBottom: 4},
  sub: {color: Colors.TEXT_DIM, fontSize: 13, marginBottom: 24},
  levelRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  levelBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
  },
  levelText: {color: Colors.TEXT, fontSize: 16, fontWeight: '600', textAlign: 'center'},
  arrowBtn: {
    top:4,
    width: 66,
    height:50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronIcon: {
    width: 25,
    height: 25,
    transform: [{rotate: '270deg'}],
  },

  randomWrap: {
    width: '100%',
    marginTop: 4,
    marginBottom: 28,
  },
  randomBtn: {
    borderRadius: 50,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  randomBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  randomText: {color: Colors.BG_DARK, fontSize: 15, fontWeight: '700'},

  bestSection: {
    backgroundColor: Colors.BG_CARD,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  bestTitle: {
    color: Colors.TEXT_DIM,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medal: {width: 24, height: 24, marginRight: 8},
  bestLevel: {color: Colors.TEXT, fontSize: 14, flex: 1},
  bestScoreBadge: {
    backgroundColor: Colors.GOLD + '33',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.GOLD + '55',
  },
  bestScore: {color: Colors.GOLD, fontSize: 13, fontWeight: '700'},
});
