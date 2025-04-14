import { ThemeColors } from "@/constants/Colors";
import { ExerciseBlock } from "./GlanceBlocks/ExerciseBlock";
import { NutritionBlock } from "./GlanceBlocks/NutritionBlock";
import { ScrollView, View } from "react-native";

type GlanceProps = {
    theme: ThemeColors;
}

export function AtAGlance({theme}: GlanceProps) {


    return (
        <ScrollView style={{ paddingVertical: 80 }}>
            <View style={{}}>
                <NutritionBlock theme={theme}/>
                <ExerciseBlock />
            </View>
        </ScrollView>
    );
}
