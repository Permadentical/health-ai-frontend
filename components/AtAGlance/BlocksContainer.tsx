import React, { useState, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, Animated } from 'react-native';
import ExpandableBlock from '../../components/AtAGlance/ExpandableBlock';
import MainCalories from './Blocks/MainCalories';
import { ThemeColors } from '@/constants/Colors';

type BlocksContainerProps = {
    theme: ThemeColors
}

const BlocksContainer = ({theme}: BlocksContainerProps) => {
  const [expandedPosition, setExpandedPosition] = useState<'left' | 'right' | null>(null);
  
  // Create animated values for layout adjustments
  const leftBlockOffset = useRef(new Animated.Value(0)).current;
  const rightBlockOffset = useRef(new Animated.Value(0)).current;

  const timeStatsContent = () => (
    <View style={styles.expandedStatsContent}>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartText}>Reading time chart would go here</Text>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Weekly average</Text>
          <Text style={styles.statValue}>5:48</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Monthly average</Text>
          <Text style={styles.statValue}>6:12</Text>
        </View>
      </View>
    </View>
  );

  const streakStatsContent = () => (
    <View style={styles.expandedStatsContent}>
      <View style={styles.calendarPlaceholder}>
        <Text style={styles.chartText}>Reading calendar would go here</Text>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Best streak</Text>
          <Text style={styles.statValue}>14 days</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total days read</Text>
          <Text style={styles.statValue}>127</Text>
        </View>
      </View>
    </View>
  );

  // Handle block expansion
  const handleBlockExpand = (position: 'left' | 'right' | null) => {
    setExpandedPosition(position);
    if (position === null) return
    // Animate the other block out of the way
    if (position === 'left') {
      // Move right block off-screen
      Animated.timing(rightBlockOffset, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true
      }).start();
      
      // Reset left block position
      Animated.timing(leftBlockOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      // Move left block off-screen
      Animated.timing(leftBlockOffset, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true
      }).start();
      
      // Reset right block position
      Animated.timing(rightBlockOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  };

  // Handle block collapse
  const handleBlockCollapse = () => {
    setExpandedPosition(null);
    
    // Animate blocks back to original positions
    Animated.parallel([
      Animated.timing(leftBlockOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(rightBlockOffset, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  return (
    <ScrollView style={{paddingVertical: 20, paddingHorizontal: 15}}>
        <View style={styles.row}>
          <MainCalories 
          handleBlockCollapse={handleBlockCollapse}
          handleBlockExpand={handleBlockExpand}
          theme={theme}/>
        </View>
        
        <View style={styles.row}>
          <Animated.View 
            style={[
              styles.blockWrapper, 
              { transform: [{ translateX: leftBlockOffset }] }
            ]}
          >
            <ExpandableBlock 
              size="small"
              position="left"
              backgroundColor="#FFAA7B"
              title="TIME"
              mainValue="6:24"
              mainIcon="clock"
              subtitle="Global avg. read time"
              extraInfo="for your progress 7:28"
              progress={0.77}
              additionalContent={timeStatsContent()}
              onExpand={handleBlockExpand}
              onCollapse={handleBlockCollapse}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.blockWrapper, 
              { transform: [{ translateX: rightBlockOffset }] }
            ]}
          >
            <ExpandableBlock 
              size="small"
              position="right"
              backgroundColor="#B8F2A8"
              title="STREAK"
              mainValue="7"
              mainIcon="activity"
              subtitle="Day streak, come back"
              extraInfo="tomorrow to keep it up!"
              progress={0.19}
              additionalContent={streakStatsContent()}
              onExpand={handleBlockExpand}
              onCollapse={handleBlockCollapse}
            />
          </Animated.View>
        </View>
      </ScrollView>
  );
};

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

export default BlocksContainer;