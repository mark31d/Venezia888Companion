import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Colors from './Colors';
import Assets from './AssetRegistry';
import Loader from './Loader';

const {width, height} = Dimensions.get('window');

export default function SplashScreen({onFinish}) {
  const [showLoader, setShowLoader] = useState(true);
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // After 1.5s hide loader and show logo
    const timer1 = setTimeout(() => {
      Animated.timing(loaderOpacity, {toValue: 0, duration: 300, useNativeDriver: true}).start(() =>
        setShowLoader(false),
      );
      Animated.parallel([
        Animated.spring(logoScale, {toValue: 1, friction: 6, useNativeDriver: true}),
        Animated.timing(logoOpacity, {toValue: 1, duration: 500, useNativeDriver: true}),
      ]).start();
    }, 1500);

    // After 3.2s go to onboarding
    const timer2 = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {/* Loader */}
      {showLoader && (
        <Animated.View style={[styles.loaderWrap, {opacity: loaderOpacity}]}>
          <Loader size={56} />
        </Animated.View>
      )}
      {/* Logo */}
      <Animated.Image
        source={Assets.LOGO}
        style={[styles.logoImg, {opacity: logoOpacity, transform: [{scale: logoScale}]}]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderWrap: {
    alignSelf: 'center',
  },
  logoImg: {
    width: 220,
    height: 220,
    borderRadius: 36,
    overflow: 'hidden',
  },
});
