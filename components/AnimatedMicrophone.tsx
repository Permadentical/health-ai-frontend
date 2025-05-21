import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { ThemeColors } from '@/constants/Colors';

// Animated SVG primitives
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

type AnimatedMicrophoneProps = {
  size?: number;
  onStart?: () => void;
  onStop?: () => void;
  style?: any;
  theme: ThemeColors;
};

export const AnimatedMicrophone: React.FC<AnimatedMicrophoneProps> = ({
  size = 64,
  onStart,
  onStop,
  style,
  theme
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const buttonSize = size;
  const circleRadius = buttonSize / 2 + 40;

  // re‑animated values
  const waveAmplitude = useSharedValue(0);
  const waveFrequency = useSharedValue(1);
  const waveOpacity = useSharedValue(0);

  // refs for recording & analysis timer
  const recordingRef = useRef<any>(null);
  const analyzerTimer = useRef<any>(null);

  // low‑pass filter state
  const previousAmplitude = useRef(0);
  // long‑press timer
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  // on mount, set audio mode
  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    })();
    return () => {
      // cleanup
      if (analyzerTimer.current) clearInterval(analyzerTimer.current);
      if (recordingRef.current) stopRecording();
    };
  }, []);

  // start analyzing "fake" audio levels (or hook into real PCM extractor here)
  const startAudioLevelAnalysis = () => {
    if (analyzerTimer.current) clearInterval(analyzerTimer.current);
    analyzerTimer.current = setInterval(() => {
      const baseLevel = 0.3;
      const randomFactor = Math.random() * 0.5;
      const sim = baseLevel + randomFactor;
      const peak = Math.random() > 0.75;
      const level = peak ? Math.min(sim * 1.5, 1) : sim;
      // smooth + drive animation
      updateAnimationFromAudioLevel(level);
    }, 100);
  };

  const updateAnimationFromAudioLevel = (level: number) => {
    const maxAmp = 15;
    const targetAmp = Math.min(level * maxAmp, maxAmp);
    const smooth = previousAmplitude.current * 0.8 + targetAmp * 0.2;
    previousAmplitude.current = smooth;

    waveAmplitude.value = withTiming(smooth, {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    });
    waveFrequency.value = withTiming(1 + level * 2, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const startRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
      }
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      waveOpacity.value = withTiming(1, { duration: 300 });
      startAudioLevelAnalysis();
      // base “breathing” animation until real levels kick in
      waveAmplitude.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 500 }),
          withTiming(2, { duration: 500 })
        ),
        -1,
        true
      );
      onStart?.();
    } catch (e) {
      console.warn('start rec err', e);
    }
  };

  const stopRecording = async () => {
    try {
      if (analyzerTimer.current) {
        clearInterval(analyzerTimer.current);
        analyzerTimer.current = null;
      }
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
      setIsRecording(false);
      waveOpacity.value = withTiming(0, { duration: 300 });
      waveAmplitude.value = withTiming(0, { duration: 300 });
      onStop?.();
    } catch (e) {
      console.warn('stop rec err', e);
    }
  };

  // Press logic: only fire startRecording if held > 300 ms
  const handlePressIn = () => {
    longPressTimeout.current = setTimeout(() => {
      startRecording();
    }, 300);
  };
  const handlePressOut = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
    if (isRecording) {
      stopRecording();
    }
  };

  // build the wave path
  const animatedWaveProps = useAnimatedProps(() => {
    const N = 72;
    const step = (2 * Math.PI) / N;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const angle = i * step;
      let eff = waveAmplitude.value * Math.sin(angle * waveFrequency.value * 3);
      if (i === 0 || i === N) eff = 0;
      const r = circleRadius + eff;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      d += (i === 0 ? 'M ' : 'L ') + `${x} ${y} `;
    }
    d += 'Z';
    return { d, opacity: waveOpacity.value };
  });

  const animatedCircleProps = useAnimatedProps(() => ({
    opacity: waveOpacity.value * 0.3,
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[isRecording ? theme.cardAccentYellow : theme.background, style]}
    >
      <Svg
        width={buttonSize * 2 + 80}
        height={buttonSize * 2 + 80}
        style={styles.svg}
      >
        <AnimatedCircle
          cx={(buttonSize * 2 + 80) / 2}
          cy={(buttonSize * 2 + 80) / 2}
          r={circleRadius}
          fill="transparent"
          stroke="#3498db"
          strokeWidth={1}
          animatedProps={animatedCircleProps}
        />
        <AnimatedPath
          fill="transparent"
          stroke="#3498db"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          transform={`translate(${(buttonSize * 2 + 80) / 2}, ${(buttonSize * 2 + 80) / 2}) rotate(60)`}
          animatedProps={animatedWaveProps}
        />
      </Svg>
      <Feather name="mic" size={20} color={theme.background} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  svg: { position: 'absolute' },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recording: {
    backgroundColor: '#3498db',
  },
});
