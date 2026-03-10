import React, {useState} from 'react';
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
import Colors from './Colors';
import {useTabBarInset} from './MainTabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {QUIZ_BEGINNER, QUIZ_EXPLORER, QUIZ_EXPERT} from './Data';

const SCORES_KEY = '@timeless_quiz_scores';

const QUESTION_SETS = {
  Beginner: QUIZ_BEGINNER,
  Explorer: QUIZ_EXPLORER,
  Expert: QUIZ_EXPERT,
};

export default function QuizPlayScreen({route, navigation}) {
  const {level} = route.params;
  const questions = QUESTION_SETS[level];
  const bottomPadding = useTabBarInset();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const q = questions[current];

  const choose = async idx => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correct;
    const newScore = correct ? score + 1 : score;

    setTimeout(async () => {
      if (current + 1 < questions.length) {
        setCurrent(c => c + 1);
        setSelected(null);
        if (correct) setScore(newScore);
      } else {
        // Save best score
        try {
          const raw = await AsyncStorage.getItem(SCORES_KEY);
          const scores = raw ? JSON.parse(raw) : {};
          const finalScore = newScore;
          if (scores[level] === undefined || finalScore > scores[level]) {
            scores[level] = finalScore;
            await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(scores));
          }
        } catch {}
        navigation.replace('QuizResult', {
          level,
          score: newScore,
          total: questions.length,
        });
      }
    }, 600);
  };

  const getOptionStyle = idx => {
    if (selected === null) return styles.option;
    if (idx === q.correct) return [styles.option, styles.optionCorrect];
    if (idx === selected) return [styles.option, styles.optionWrong];
    return styles.option;
  };

  const getOptionTextStyle = idx => {
    if (selected === null) return styles.optionText;
    if (idx === q.correct) return [styles.optionText, styles.optionTextCorrect];
    if (idx === selected) return [styles.optionText, styles.optionTextWrong];
    return styles.optionText;
  };

  const getRadioStyle = idx => {
    if (selected === null) return styles.radio;
    if (idx === q.correct) return [styles.radio, styles.radioCorrect];
    if (idx === selected) return [styles.radio, styles.radioWrong];
    return styles.radio;
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: (insets.top || 0) + 16}]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={Assets.ICONS.icon_back} style={styles.backIcon} resizeMode="contain" tintColor={Colors.GOLD_LIGHT} />
        </TouchableOpacity>
        <Text style={styles.levelLabel}>{level}</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        {/* Question */}
        <Text style={styles.question}>{q.question}</Text>

        {/* Options */}
        {q.options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={getOptionStyle(idx)}
            onPress={() => choose(idx)}
            activeOpacity={0.85}>
            <Text style={getOptionTextStyle(idx)}>{opt}</Text>
            <LinearGradient
              colors={['#FFE9B0', '#C8901A']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.radioWrap}>
              <View style={getRadioStyle(idx)} />
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* Progress */}
        <Text style={styles.progress}>
          {current + 1}/{questions.length}
        </Text>
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
    paddingTop: 0,
    paddingBottom: 8,
  },
  backBtn: {padding: 8},
  backIcon: {width: 24, height: 24},
  levelLabel: {color: Colors.TEXT_DIM, fontSize: 15, fontWeight: '600'},
  scroll: {flex: 1},
  content: {paddingHorizontal: 16, paddingTop: 24},
  question: {
    color: Colors.TEXT,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  optionCorrect: {
    backgroundColor: Colors.CORRECT,
    borderColor: Colors.GREEN_LIGHT,
  },
  optionWrong: {
    backgroundColor: Colors.WRONG,
    borderColor: '#8b2020',
  },
  optionText: {color: Colors.TEXT, fontSize: 15, flex: 1},
  optionTextCorrect: {color: Colors.WHITE, fontWeight: '700'},
  optionTextWrong: {color: '#ffaaaa'},
  radioWrap: {
    width: 54,
    height: 38,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.BG_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCorrect: {borderColor: Colors.GREEN_LIGHT, backgroundColor: Colors.GREEN_LIGHT},
  radioWrong: {borderColor: '#8b2020', backgroundColor: '#8b2020'},
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.GOLD,
  },
  progress: {
    color: Colors.TEXT_DIM,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});
