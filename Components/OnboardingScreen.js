import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from './Colors';
import Assets from './AssetRegistry';
import {ONBOARDING_SLIDES} from './Data';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen({onFinish}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {toValue: -20, duration: 100, useNativeDriver: true}),
      Animated.timing(slideAnim, {toValue: 0, duration: 180, useNativeDriver: true}),
    ]).start();

    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const slide = ONBOARDING_SLIDES[currentIndex];
  const img = Assets.ONBOARD[slide.image];

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {/* Character */}
      <Image source={img} style={styles.character} resizeMode="contain" />

      {/* Bottom wrapper — gold line + dark card */}
      <View style={styles.bottomWrapper}>
        <View style={[styles.bottomCard, {backgroundColor: Colors.BG_CARD}]}>
          <Animated.View
            style={[styles.cardContent, {transform: [{translateY: slideAnim}]}]}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.desc}>{slide.description}</Text>

            <TouchableOpacity
              onPress={goNext}
              activeOpacity={0.8}
              style={styles.btnWrap}>
              <LinearGradient
                colors={['#F6D28F', '#E5B96A']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.btn}>
                <View style={styles.btnInner}>
                  <Text style={styles.btnText}>{slide.button}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: 'transparent'},
  character: {
    position: 'absolute',
    bottom: height * 0.33,
    alignSelf: 'center',
    width: width * 0.78,
    height: height * 0.58,
  },
  bottomWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.37,
    backgroundColor: Colors.GOLD,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 4,
    overflow: 'hidden',
  },
  bottomCard: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    justifyContent: 'center',
  },
  title: {
    color: Colors.GOLD_LIGHT,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  desc: {
    color: Colors.TEXT_DIM,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dotEl: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.BORDER2,
    marginRight: 6,
  },
  dotActive: {
    backgroundColor: Colors.GOLD,
    width: 18,
  },
  btnWrap: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  btn: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: {
    marginVertical: 14,
    marginHorizontal: 40,
  },
  btnText: {
    color: Colors.BG_DARK,
    fontSize: 17,
    fontWeight: '700',
  },
});
