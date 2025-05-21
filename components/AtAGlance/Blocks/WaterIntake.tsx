import { ThemeColors } from "@/constants/Colors";
import ExpandableBlock from "../ExpandableBlock";
import { StyleSheet, View, Text } from "react-native";

type WaterIntakeProps = {
    handleBlockExpand: (position: "left" | "right" | null) => void,
    handleBlockCollapse: () => void;
    theme: ThemeColors;
}
const WaterIntake = ({ handleBlockExpand, handleBlockCollapse, theme }: WaterIntakeProps) => {


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


    return (
        <ExpandableBlock
            size="small"
            position="left"
            backgroundColor="#FFAA7B"
            title="Water Intake"
            mainValue="1/8"
            mainValueTidBit="glasses"
            mainIcon="clock"
            subtitle="glasses of water"
            extraInfo="for your progress 7:28"
            progress={0.77}
            additionalContent={timeStatsContent()}
            onExpand={handleBlockExpand}
            onCollapse={handleBlockCollapse}
        />
    )
}

const styles = StyleSheet.create({
    chartText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#00000060',
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

    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statItem: {
        width: '48%',
    },

    expandedStatsContent: {
        flex: 1,
        marginTop: 16,
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: '#00000010',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
})

export default WaterIntake;