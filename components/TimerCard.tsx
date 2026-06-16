import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Preset } from '../types';
import { useTimer } from '../hooks/useTimer';
import { ProgressBar } from './ProgressBar';
import { formatTime, formatTimePadded } from '../format';

const BLUE = '#6c6cf5';
const GREEN = '#2da84a';

type Props = {
  preset: Preset;
  onLongPress: () => void;
};

export function TimerCard({ preset, onLongPress }: Props) {
  const { remaining, state, start, stop, reset } = useTimer(preset.durationSecs);

  const elapsed = preset.durationSecs - remaining;
  const progress = preset.durationSecs > 0 ? elapsed / preset.durationSecs : 0;
  const done = state === 'done';
  const running = state === 'running';

  function handleButton() {
    if (running) stop();
    else if (done) reset();
    else start();
  }

  const btnColor = done ? GREEN : BLUE;
  const btnLabel = running ? '■' : done ? '↺' : '▶';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={styles.card}
    >
      <View style={styles.top}>
        <View style={styles.left}>
          <Text style={[styles.name, (running || done) && styles.nameActive, done && { color: GREEN }]}>
            {preset.name}
          </Text>
          {done ? (
            <Text style={styles.doneText}>Ready!</Text>
          ) : (
            <Text style={[styles.duration, running && styles.durationActive]}>
              {running ? formatTimePadded(remaining) : formatTimePadded(preset.durationSecs)}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleButton}
          activeOpacity={0.7}
          style={[styles.playBtn, { backgroundColor: btnColor }]}
        >
          <Text style={[styles.playIcon, btnLabel !== '▶' && styles.playIconSmall]}>{btnLabel}</Text>
        </TouchableOpacity>
      </View>

      {(running || done) && (
        <View style={styles.progressSection}>
          <ProgressBar progress={done ? 1 : progress} color={done ? GREEN : BLUE} />
          <View style={styles.labels}>
            {done ? (
              <Text style={styles.doneMsg}>Done.</Text>
            ) : (
              <Text style={styles.label}>{formatTime(elapsed)} elapsed</Text>
            )}
            <Text style={styles.label}>
              {done ? `${formatTime(preset.durationSecs)} / ${formatTime(preset.durationSecs)}` : `of ${formatTime(preset.durationSecs)}`}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flex: 1 },
  name: { fontSize: 14, color: '#999', fontWeight: '500' },
  nameActive: { color: '#333' },
  duration: { fontSize: 36, fontWeight: '300', color: '#bbb', letterSpacing: -1, marginTop: 2 },
  durationActive: { color: '#111', fontWeight: '400' },
  doneText: { fontSize: 28, fontWeight: '600', color: GREEN, marginTop: 4 },
  playBtn: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 12,
  },
  playIcon: { color: '#fff', fontSize: 26, fontWeight: '700' },
  playIconSmall: { fontSize: 22 },
  progressSection: { marginTop: 12 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  label: { fontSize: 12, color: '#aaa' },
  doneMsg: { fontSize: 12, color: GREEN, fontWeight: '600' },
});
