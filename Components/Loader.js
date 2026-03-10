import {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Easing} from 'react-native';

export default function Loader({size = 60, color = 'rgb(221,255,242)', style}) {
  const rotate = useRef(new Animated.Value(0)).current;
  const wobbleL = useRef(new Animated.Value(0)).current;
  const wobbleR = useRef(new Animated.Value(0)).current;
  const scaleL = useRef(new Animated.Value(1)).current;
  const scaleR = useRef(new Animated.Value(1)).current;

  const dotSize = size * 0.25;
  const wobbleDist = size * 0.2;

  useEffect(() => {
    // Rotate container
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Wobble dots (1.25x speed = 1250ms)
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(wobbleL, {toValue: -wobbleDist, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
          Animated.timing(wobbleR, {toValue: wobbleDist, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
          Animated.timing(scaleL, {toValue: 1.1, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
          Animated.timing(scaleR, {toValue: 1.1, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
        ]),
        Animated.parallel([
          Animated.timing(wobbleL, {toValue: 0, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
          Animated.timing(wobbleR, {toValue: 0, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
          Animated.timing(scaleL, {toValue: 1, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
          Animated.timing(scaleR, {toValue: 1, duration: 625, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
        ]),
      ]),
    ).start();
  }, []);

  const spin = rotate.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});

  return (
    <View style={[{width: size, height: size}, style]}>
      <Animated.View style={[styles.container, {width: size, height: size, transform: [{rotate: spin}]}]}>
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              marginRight: size * 0.05,
              transform: [{translateX: wobbleL}, {scale: scaleL}],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              transform: [{translateX: wobbleR}, {scale: scaleR}],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {},
});
