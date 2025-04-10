import { ExerciseBlock } from "./GlanceBlocks/ExerciseBlock";
import { NutritionBlock } from "./GlanceBlocks/NutritionBlock";
import { ScrollView, View } from "react-native";

export function AtAGlance() {
    return (
        <ScrollView style={{ paddingVertical: 100 }}>
            <View style={{}}>
                <NutritionBlock />
            </View>
            <View>
                <ExerciseBlock />
            </View>
        </ScrollView>
    );
}
