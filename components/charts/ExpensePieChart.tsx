import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Text } from "react-native-paper";

//local imports
import { CATEGORY_ICON_MAP, CategoryKey } from "@/constants/categoryIcons";
import { useExpenses } from "@/context/expenseContext";
import { useTheme } from "@/context/themeContext";

export default function ExpensePieChartScreen() {
  const { expenses } = useExpenses();
  const { theme } = useTheme();
  const [selectedSlice, setSelectedSlice] = useState<any>(null);

  const total = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  const grouped = useMemo(() => {
    return expenses.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
  }, [expenses]);

  const pieData = useMemo(() => {
    if (!total) return [];

    return Object.entries(grouped).map(([category, value]) => ({
      value,
      color:
        CATEGORY_ICON_MAP[category as CategoryKey]?.color ??
        theme.colors.primary,
      label: category,
      percentage: ((value / total) * 100).toFixed(1),
      amount: value,
    }));
  }, [grouped, total, theme]);

  useEffect(() => {
    setSelectedSlice(null);
  }, [pieData]);

  useFocusEffect(
    useCallback(() => {
      setSelectedSlice(null);
    }, [])
  );

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Expense Breakdown
      </Text>

      {/* PIE CHART */}
      <View style={styles.chartWrapper}>
        <PieChart
          data={pieData}
          donut
          radius={95}     
          innerRadius={58}
          strokeWidth={1}
          focusOnPress
          onPress={(item: any) => setSelectedSlice(item)}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: theme.colors.primary,
                }}
              >
                ₹
                {(selectedSlice?.amount ?? total).toFixed(0)}
              </Text>
            </View>
          )}
        />
      </View>

      {/* INFO */}
      <View style={styles.infoContainer}>
        {selectedSlice ? (
          <>
            <Text
              style={[
                styles.categoryName,
                { color: theme.colors.textPrimary },
              ]}
            >
              {selectedSlice.label}
            </Text>
            <Text
              style={[
                styles.percentageText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {selectedSlice.percentage}% of total
            </Text>
          </>
        ) : (
          <Text
            style={[
              styles.instructionText,
              { color: theme.colors.textSecondary },
            ]}
          >
            Tap any slice to view details
          </Text>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 0,
    textAlign: "center",
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 0,
    minHeight: 20,
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
    textAlign: "center",
  },
  percentageText: {
    fontSize: 15,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
});

