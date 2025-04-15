import { View, Text, StyleSheet } from "react-native";
import ExpandableBlock from "../ExpandableBlock"
import { ThemeColors } from "@/constants/Colors";

type MainCaloriesProps = {
    handleBlockExpand: (position: "left" | "right" | null) => void,
    handleBlockCollapse: () => void,
    theme: ThemeColors
}

const macroAvatars = [
    { uri: 'https://example.com/avatar1.jpg' },
    { uri: 'https://example.com/avatar2.jpg' },
    { uri: 'https://example.com/avatar3.jpg' },
    { uri: 'https://example.com/avatar4.jpg' },
    { uri: 'https://example.com/avatar5.jpg' },
    { uri: 'https://example.com/avatar6.jpg' },
  ];

  // Additional content to display when blocks are expanded
const caloriesExpandedContent = () => (
    <View style={styles.expandedStatsContent}>
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current chapter</Text>
          <Text style={styles.statValue}>Chapter 24</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pages left</Text>
          <Text style={styles.statValue}>682</Text>
        </View>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Reading speed</Text>
          <Text style={styles.statValue}>37 pages/day</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Est. completion</Text>
          <Text style={styles.statValue}>May 12</Text>
        </View>
      </View>
      
      <View style={styles.friendsSection}>
        <Text style={styles.sectionTitle}>Friends' progress</Text>
        {macroAvatars.map((_, index: number) => (
          <View key={index} style={styles.friendItem}>
            <View style={styles.friendAvatar} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>Friend {index + 1}</Text>
              <View style={styles.friendProgressBar}>
                <View style={[styles.friendProgressFill, { width: `${90 - index * 15}%` }]} />
              </View>
            </View>
            <Text style={styles.friendPages}>{800 - index * 100}</Text>
          </View>
        ))}
      </View>
    </View>
  );

const MainCalories = ({handleBlockExpand, handleBlockCollapse, theme }: MainCaloriesProps) => {

    // TODO Fetch Details from backend
    const title: string = "CALORIES"

    return (
        <ExpandableBlock 
            size="medium"
            position={null}
            backgroundColor={theme.cardAccentYellow}
            title={title}
            mainValue="543"
            mainValueTidBit="kcal"
            mainIcon="pie-chart"
            subtitle="Out of 1,225 kcal"
            extraInfo="#5 among friends"
            progress={0.45}
            avatars={[]}
            additionalContent={caloriesExpandedContent()}
            onExpand={handleBlockExpand}
            onCollapse={handleBlockCollapse}
          />
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  scrollContent: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    position: 'relative',
  },
  blockWrapper: {
    width: '48%',  // Just under half to account for margin
  },
  expandedStatsContent: {
    flex: 1,
    marginTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
  },
  statLabel: {
    fontSize: 14,
    color: '#00000080',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  friendsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00000020',
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  friendProgressBar: {
    height: 6,
    backgroundColor: '#00000020',
    borderRadius: 3,
  },
  friendProgressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 3,
  },
  friendPages: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#00000010',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  calendarPlaceholder: {
    height: 240,
    backgroundColor: '#00000010',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00000060',
  },
});

export default MainCalories;