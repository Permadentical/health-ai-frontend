import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableWithoutFeedback, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  Image 
} from 'react-native';

const { width, height } = Dimensions.get('window');

type ExpandableBlockProps = {
  size: 'small' | 'medium',
  position: 'left' | 'right' | null,
  backgroundColor: string,
  title: string,
  mainValue: string,
  mainIcon: string,
  subtitle: string,
  extraInfo: string,
  progress: number,
  avatars?: any,
  additionalContent: any,
  onExpand: (position: "left" | "right" | null) => void,
  onCollapse: (position: "left" | "right"| null) => void,
}

const ExpandableBlock = ({ 
  size = 'small', // 'small' or 'medium'
  position,
  backgroundColor = '#FFDF6B', 
  title = 'PROGRESS',
  mainValue = '543',
  mainIcon = 'book',
  subtitle = 'Out of 1,225 pages',
  extraInfo = '#5 among friends',
  progress = 0.45, // Between 0 and 1
  avatars = [], // Array of avatar image sources
  additionalContent = null, // Content to show when expanded
  onExpand, // Callback when block expands
  onCollapse, // Callback when block collapses
}: ExpandableBlockProps) => {
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  
  // Calculate initial dimensions based on the size prop
  const initialWidth = size === 'small' ? width * 0.44 : width * 0.92;
  const initialHeight = size === 'small' ? width * 0.44 : width * 0.32;
  const expandedWidth = width * 0.92;
  const expandedHeight = height * 0.8;
  
  const toggleExpand = () => {
    const willExpand = !expanded;
    const toValue = willExpand ? 1 : 0;
    
    Animated.spring(expandAnim, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
    
    setExpanded(willExpand);
    
    // Trigger callbacks based on expansion state
    if (willExpand) {
      onExpand(position);
    } else {
      onCollapse(position);
    }
  };
  
  // Interpolate width and height for animation
  const blockWidth = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [initialWidth, expandedWidth]
  });
  
  const blockHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [initialHeight, expandedHeight]
  });
  
  const contentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 0, 0]
  });
  
  const expandedContentOpacity = expandAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1]
  });
  
  const borderRadius = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 32]
  });
  
  const zIndex = expanded ? 10 : 1;
  
  // **New: Calculate translateX for right aligned blocks so their right edge stays fixed**
  const translateX = position === 'right'
    ? expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -(expandedWidth - initialWidth)],
      })
    : 0;
  
  // Determine which icon to render
  const renderIcon = () => {
    switch(mainIcon) {
      case 'book':
        return (
          <View style={styles.iconContainer}>
            <Text style={styles.bookIcon}>≡</Text>
            <Text style={styles.bookCover}>📕</Text>
          </View>
        );
      case 'clock':
        return <Text style={styles.icon}>⏱</Text>;
      case 'lightning':
        return <Text style={styles.icon}>⚡</Text>;
      default:
        return <Text style={styles.icon}>📊</Text>;
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={toggleExpand}>
      <Animated.View style={[
        styles.container,
        { 
          backgroundColor,
          width: blockWidth,
          height: blockHeight,
          borderRadius,
          zIndex,
          elevation: expanded ? 5 : 3,
          transform: [{ translateX }]  // Apply the translation here.
        }
      ]}>
        {/* Regular content (visible when not expanded) */}
        <Animated.View 
          style={[styles.contentContainer, { opacity: contentOpacity }]}
          pointerEvents={expanded ? 'none' : 'auto'}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <View style={styles.mainContent}>
            {renderIcon()}
            <Text style={styles.mainValue}>{mainValue}</Text>
          </View>
          
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={styles.extraInfo}>{extraInfo}</Text>
          </View>
          
          {progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              
              {avatars.length > 0 && (
                <View style={styles.avatarsContainer}>
                  {avatars.map((avatar: any, index: number) => (
                    <Image 
                      key={index}
                      source={avatar} 
                      style={[
                        styles.avatar,
                        { marginLeft: index > 0 ? -10 : 0 }
                      ]} 
                    />
                  ))}
                </View>
              )}
            </View>
          )}
        </Animated.View>
        
        {/* Expanded content */}
        <Animated.View 
          style={[
            styles.expandedContent, 
            { opacity: expandedContentOpacity }
          ]}
          pointerEvents={expanded ? 'auto' : 'none'}
        >
          <View style={styles.expandedHeader}>
            <Text style={styles.expandedTitle}>{title}</Text>
            <Text style={styles.closeButton}>×</Text>
          </View>
          
          <View style={styles.expandedMainContent}>
            {renderIcon()}
            <Text style={styles.expandedMainValue}>{mainValue}</Text>
            <Text style={styles.expandedSubtitle}>{subtitle}</Text>
          </View>
          
          {additionalContent}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
    color: '#000',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 8,
  },
  bookIcon: {
    fontSize: 30,
    color: '#000',
  },
  bookCover: {
    position: 'absolute',
    fontSize: 24,
    opacity: 0,
  },
  icon: {
    fontSize: 28,
    marginRight: 8,
  },
  mainValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
  },
  subtitleContainer: {
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  extraInfo: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#FFFFFF80',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  avatarsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  expandedContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  expandedTitle: {
    fontWeight: '800',
    fontSize: 20,
    color: '#000',
  },
  closeButton: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000',
  },
  expandedMainContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  expandedMainValue: {
    fontSize: 64,
    fontWeight: '900',
    color: '#000',
  },
  expandedSubtitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    marginTop: 8,
  },
});

export default ExpandableBlock;
