import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

export function ExerciseBlock() {
    // Calorie Block Animation
    const calorieWidth = useSharedValue(340);
    const calorieHeight = useSharedValue(80);

    // Macro Blocks Animation
    const macroTotalWidth = 335;
    const macroWidthLeft = useSharedValue(macroTotalWidth / 2);
    const macroWidthRight = useSharedValue(macroTotalWidth / 2);
    const macroHeight = useSharedValue(100);

    // Additional Macro Animation
    const addMacroWidth = useSharedValue(340);
    const addMacroHeight = useSharedValue(80);

    const [isExpandedLeft, setIsExpandedLeft] = useState(false);
    const [isExpandedRight, setIsExpandedRight] = useState(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isAddMacroExpanded, setIsAddMacroExpanded] =
        useState<boolean>(false);

    const calorieInformation = {
        totalCalorieIn: 2500,
        totalCalorieOut: 250,
        nutritionBreakdown: {
            breakfast: { "Egg, Toasted": 800, "Bread Slice": 600 },
            lunch: { "Burger, large": 1000, "Diet Coke": 0 },
            dinner: { "Steak Sirloin": 600, "Mashed Potatoe": 900 },
            snacks: { "Cashew Nuts": 500 },
        },
    };

    const handleCaloriePress = () => {
        const heightChange = isExpanded ? -175 : 175;
        calorieHeight.value = withSpring(calorieHeight.value + heightChange);
        setIsExpanded(!isExpanded);
    };

    const handleMacroPressLeft = () => {
        if (isExpandedLeft) {
            macroWidthLeft.value = withSpring(macroTotalWidth / 2);
            macroWidthRight.value = withSpring(macroTotalWidth / 2);
        } else {
            macroWidthLeft.value = withSpring(macroTotalWidth * 0.75);
            macroWidthRight.value = withSpring(macroTotalWidth * 0.25);
        }
        setIsExpandedLeft(!isExpandedLeft);
        setIsExpandedRight(false); // Ensure right block closes if open
    };

    const handleMacroPressRight = () => {
        if (isExpandedRight) {
            macroWidthRight.value = withSpring(macroTotalWidth / 2);
            macroWidthLeft.value = withSpring(macroTotalWidth / 2);
        } else {
            macroWidthRight.value = withSpring(macroTotalWidth * 0.75);
            macroWidthLeft.value = withSpring(macroTotalWidth * 0.25);
        }
        setIsExpandedRight(!isExpandedRight);
        setIsExpandedLeft(false); // Ensure left block closes if open
    };

    const handleAdditionalMacroPress = () => {
        const heightChange = isAddMacroExpanded ? -175 : 175;
        addMacroHeight.value = withSpring(addMacroHeight.value + heightChange);
        setIsAddMacroExpanded(!isAddMacroExpanded);
    };

    return (
        <ScrollView
            contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
        >
            <View style={{ flex: 1, alignItems: "center" }}>
                {/* Calorie Sub-Block */}
                <Pressable onPress={handleCaloriePress}>
                    <Animated.View
                        style={[
                            styles.calorieBlock,
                            { width: calorieWidth, height: calorieHeight },
                        ]}
                    >
                        <Text style={styles.calorieTitle}>
                            Net Calories:{" "}
                            {calorieInformation.totalCalorieIn -
                                calorieInformation.totalCalorieOut}
                        </Text>
                        {/* Animated View for Fade Effect */}
                        {isExpanded && (
                            <Animated.View>
                                {Object.entries(
                                    calorieInformation.nutritionBreakdown
                                ).map(([meal, items]) => (
                                    <View
                                        key={meal}
                                        style={styles.mealContainer}
                                    >
                                        <Text style={styles.mealTitle}>
                                            {meal.toUpperCase()}
                                        </Text>
                                        {Object.entries(items).map(
                                            ([food, calories]) => (
                                                <Text
                                                    key={food}
                                                    style={styles.foodItem}
                                                >
                                                    {food}: {calories} kcal
                                                </Text>
                                            )
                                        )}
                                    </View>
                                ))}
                            </Animated.View>
                        )}
                    </Animated.View>
                </Pressable>
                {/* Macro Sub-Blocks (Side-by-Side) */}
                <View style={styles.macroContainer}>
                    <Pressable onPress={handleMacroPressLeft}>
                        <Animated.View
                            style={[
                                styles.macroBlock,
                                {
                                    width: macroWidthLeft,
                                    height: macroHeight,
                                    backgroundColor: "green",
                                },
                            ]}
                        >
                            <Text style={styles.macroText}>
                                Protein, Carbs, Fats
                            </Text>
                        </Animated.View>
                    </Pressable>
                    <Pressable onPress={handleMacroPressRight}>
                        <Animated.View
                            style={[
                                styles.macroBlock,
                                {
                                    width: macroWidthRight,
                                    height: macroHeight,
                                    backgroundColor: "blue",
                                },
                            ]}
                        >
                            <Text style={styles.macroText}>
                                More Nutrition Info
                            </Text>
                        </Animated.View>
                    </Pressable>
                </View>
                <Pressable onPress={handleAdditionalMacroPress}>
                    <Animated.View
                        style={[
                            styles.calorieBlock,
                            { width: addMacroWidth, height: addMacroHeight },
                        ]}
                    ></Animated.View>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    calorieBlock: {
        backgroundColor: "pink",
        borderRadius: 20,
        padding: 10,
        justifyContent: "center",
        marginTop: 5,
    },
    macroContainer: {
        flexDirection: "row",
        marginTop: 5,
        gap: 5,
    },
    macroBlock: {
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    calorieTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    mealContainer: {
        marginTop: 10,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    foodItem: {
        fontSize: 14,
        textAlign: "center",
    },
    macroText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
});

export default ExerciseBlock;
