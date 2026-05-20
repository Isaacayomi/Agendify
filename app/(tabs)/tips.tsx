import { StyleSheet, Text, View } from 'react-native';

export function TipsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tips</Text>
      <Text style={styles.subtitle}>Helpful study tips can live here.</Text>
    </View>
  );
}

export default TipsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
});
