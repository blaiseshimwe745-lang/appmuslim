import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, RADIUS } from '../components/theme';

const { width } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: '0',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    title: 'Willkommen bei',
    highlight: 'Barakah',
    subtitle:
      'Dein digitaler Begleiter für eine gesegnete Bildschirmzeit. Gewinne die Kontrolle zurück – eine gute Tat nach der anderen.',
    illustration: '🕌',
    features: [],
  },
  {
    id: '1',
    arabic: '',
    title: 'Gebet & Qur\'an',
    highlight: 'zuerst',
    subtitle:
      'Social Media ist erst frei, wenn du deine täglichen Ibadaat erledigt hast. Dein Iman dankt es dir.',
    illustration: '🕌',
    features: [
      { emoji: '🕋', title: 'Gebets-Tracker', desc: 'Fajr, Dhuhr, Asr, Maghrib & Isha – alles im Blick' },
      { emoji: '📖', title: 'Qur\'an lesen', desc: 'Mindestens 5 Minuten Rezitation vor der Freischaltung' },
      { emoji: '📿', title: 'Dhikr', desc: '33× Subhanallah · 33× Alhamdulillah · 34× Allahu Akbar' },
    ],
  },
  {
    id: '2',
    arabic: '',
    title: 'Dein',
    highlight: 'Streak',
    subtitle:
      'Jeder Tag, an dem du deine Aufgaben erledigst, verlängert deine Serie. Unterbrich den Teufelskreis!',
    illustration: '🔥',
    features: [
      { emoji: '🔥', title: 'Täglicher Streak', desc: 'Bleib dran – je länger die Serie, desto mehr Barakah' },
      { emoji: '🏆', title: 'Meilensteine', desc: '7, 30, 100 Tage – jede Serie wird belohnt' },
      { emoji: '📊', title: 'Statistiken', desc: 'Sieh deinen Fortschritt und wie viel Zeit du zurückgewonnen hast' },
    ],
  },
];

export function OnboardingScreen({ onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => (
    <View style={styles.slide}>
      <View style={styles.illustrationWrap}>
        <View style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>{item.illustration}</Text>
        </View>
      </View>

      {item.arabic ? (
        <Text style={styles.arabic}>{item.arabic}</Text>
      ) : null}

      <Text style={styles.title}>
        {item.title}{'\n'}
        <Text style={styles.highlight}>{item.highlight}</Text>
      </Text>

      <Text style={styles.subtitle}>{item.subtitle}</Text>

      {item.features.length > 0 && (
        <View style={styles.features}>
          {item.features.map((f, i) => (
            <View style={styles.featureItem} key={i}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goToSlide(i)}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => {
            if (isLast) {
              onComplete();
            } else {
              goToSlide(currentIndex + 1);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            {isLast ? 'App starten 🚀' : currentIndex === 0 ? 'Los geht\'s →' : 'Weiter →'}
          </Text>
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity onPress={onComplete} style={styles.btnSkip}>
            <Text style={styles.btnSkipText}>Überspringen</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  slide: {
    width,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.greenPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: { fontSize: 72 },
  arabic: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.goldDark,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.greenDeep,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 10,
  },
  highlight: {
    color: COLORS.gold,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 310,
    alignSelf: 'center',
  },
  features: {
    marginTop: 20,
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 18,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    shadowColor: COLORS.greenDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.greenPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: { fontSize: 20 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  featureDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.sand,
  },
  dotActive: {
    width: 26,
    borderRadius: 6,
    backgroundColor: COLORS.greenDeep,
  },
  btnPrimary: {
    width: '100%',
    padding: 18,
    backgroundColor: COLORS.greenDeep,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    shadowColor: COLORS.greenDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  btnSkip: { padding: 8 },
  btnSkipText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
});
