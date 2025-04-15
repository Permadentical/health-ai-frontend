import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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

// Replace with real food data as needed
const foodMeals = {
    breakfast: [
        { name: "Oatmeal", calories: 150 },
        { name: "Eggs", calories: 200 },
        { name: "Orange Juice", calories: 100 },
        { name: "Coffee", calories: 50 },
    ],
    lunch: [
        { name: "Chicken Salad", calories: 350 },
        { name: "Protein Shake", calories: 250 },
        { name: "Fruit Bowl", calories: 150 },
    ],
    dinner: [
        { name: "Steak", calories: 500 },
        { name: "Mashed Potatoes", calories: 300 },
        { name: "Green Beans", calories: 100 },
    ],
    snacks: [
        { name: "Yogurt", calories: 120 },
        { name: "Granola Bar", calories: 180 },
        { name: "Almonds", calories: 160 },
    ],
};

const fetchMacros = () => {

    // TODO: ADD backend logic, and better icon fetching
    return {
        protein: {
            label: "Protein",
            icon: "🍗", // or <ProteinIcon />
            current: 15,
            goal: 50,
        },
        carbs: {
            label: "Carbs",
            icon: "🍞", // or <CarbsIcon />
            current: 55,
            goal: 200,
        },
        fat: {
            label: "Fat",
            icon: "🥑", // or <FatIcon />
            current: 22,
            goal: 70,
        },
    };
};


// Additional content to display when blocks are expanded
const caloriesExpandedContent = () => {
    const macros = fetchMacros();

    // Helper function to render each meal section with top 3 highest cal foods
    const renderMealSection = (mealName: string, foods: any[]) => {
        // Sort foods descending by calories and take the top three
        const topFoods = foods.sort((a, b) => b.calories - a.calories).slice(0, 3);
        const totalCals = topFoods.reduce((prev, next) => prev + next.calories, 0)
        return (
            <View key={mealName} style={styles.mealSection}>
              <TouchableOpacity
                style={styles.mealHeader}
                // TODO: ADD DETAIL EXPANSION 
                onPress={() => console.log(totalCals)}
              >
                <Text style={styles.mealTitle}>
                  {mealName.charAt(0).toUpperCase() + mealName.slice(1)}
                  <Text style={styles.totalCals}> {"  "+totalCals}</Text>
                </Text>
                <Text style={styles.mealArrow}>{">"}</Text>
              </TouchableOpacity>
              <View style={styles.mealFoods}>
                {topFoods.map((food, index) => (
                  <Text key={index} style={styles.foodItem}>
                    {food.name}
                    {index !== topFoods.length - 1 ? "  |  " : ""}
                  </Text>
                ))}
              </View>
            </View>
          );
          
    };

    return (
        <View style={styles.expandedStatsContent}>
            {/* Replace reading info with food meal sections */}
            {renderMealSection("breakfast", foodMeals.breakfast)}
            {renderMealSection("lunch", foodMeals.lunch)}
            {renderMealSection("dinner", foodMeals.dinner)}
            {renderMealSection("snacks", foodMeals.snacks)}

            {/* Macro progress section remains below (optional placement) */}
            <View style={{ marginTop: 16 }}>
                <Text style={styles.sectionTitle}>Macro Progress</Text>
                {Object.entries(macros).map(([key, macro]) => {
                    const percent = Math.min((macro.current / macro.goal) * 100, 100);

                    return (
                        <View key={key} style={styles.macroRow}>
                            <View style={styles.macroHeader}>
                                <Text style={styles.macroIcon}>{macro.icon}</Text>
                                <Text style={styles.macroLabel}>{macro.label}</Text>
                                <Text style={styles.macroAmount}>
                                    {macro.current}g / {macro.goal}g
                                </Text>
                            </View>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${percent}%` },
                                    ]}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};



const MainCalories = ({ handleBlockExpand, handleBlockCollapse, theme }: MainCaloriesProps) => {

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
    macroRow: {
        marginBottom: 16,
    },

    macroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    macroIcon: {
        fontSize: 18,
        marginRight: 8,
    },

    macroLabel: {
        flex: 1,
        fontWeight: '600',
        fontSize: 16,
    },

    macroAmount: {
        fontSize: 14,
        color: '#888',
    },

    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },

    progressFill: {
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
    },
    /* Meal section styles */
    mealSection: {
        marginBottom: 16,
    },
    mealHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    mealArrow: {
        fontSize: 18,
    },
    mealFoods: {
        flexDirection: "row",
        marginTop: 8,
    },
    foodItem: {
        fontSize: 14,
        color: "#555",
    },
    totalCals: {
        fontSize: 14,  // smaller fontSize for totalCals
        fontWeight: "normal",  // adjust as needed
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