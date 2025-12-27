import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { Button, Dialog, IconButton, Menu, Portal, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
//local imports
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import { ThemeToggle } from "@/components/themeToggle";
import { CATEGORY_ICON_MAP } from "@/constants/categoryIcons";
import { useExpenses } from "@/context/expenseContext";
import { useTheme } from "@/context/themeContext";
import { groupExpensesByDate } from "@/utils/listHelper";
export default function Dashboard() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [menuVisibleId, setMenuVisibleId] = useState<string | null>(null);
  const { expenses, deleteExpense } = useExpenses();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const total = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  const sections = groupExpensesByDate(expenses);
  const router = useRouter();

  const confirmDelete = () => {
    if (deleteId) {
      try {
        deleteExpense(deleteId);
        setDeleteId(null);
        Toast.show({
          type: "success",
          text1: "Expense Removed",
          text2: "The expense has been deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting expense:", error);
        Toast.show({
          type: "error",
          text1: "Deletion Failed",
          text2:
            "We could not remove this expense. Please retry or check your connection.",
        });
      }
    }
  };

  const handleEdit = (expenseId: string) => {
    if (!expenseId) return;
    router.push({
      pathname: "/(tabs)/entry",
      params: { expenseId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <ThemeToggle />

        {/* ================= NON-SCROLLING SUMMARY ================= */}
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summaryLabel}>Total Expenditure</Text>
                <Text style={styles.summaryAmount}>
                  ₹
                  {total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View style={styles.summaryIconWrap}>
                <Ionicons
                  name="trending-up"
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ================= SCROLLABLE CONTENT ================= */}
        {sections.length === 0 ? (
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIllustration,
                {
                  backgroundColor:
                    theme.mode === "dark"
                      ? "rgba(99,102,241,0.18)"
                      : "rgba(79,70,229,0.12)",
                },
              ]}
            >
              <Ionicons
                name="wallet-outline"
                size={110}
                color={theme.colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>No expenses to display</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking your spending from{" "}
              <Text style={{ fontWeight: "600", color: theme.colors.primary }}>
                Add Expense
              </Text>
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            ListHeaderComponent={
              <View style={styles.chartContainer}>
                <ExpensePieChart />
              </View>
            }
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeaderWrap}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
              </View>
            )}
            renderItem={({ item }) => {
              const categoryConfig =
                CATEGORY_ICON_MAP[
                  item.category as keyof typeof CATEGORY_ICON_MAP
                ];

              return (
                <View style={styles.expenseCard}>
                  <View
                    style={[
                      styles.accent,
                      { backgroundColor: categoryConfig.color },
                    ]}
                  />

                  <View style={styles.cardBody}>
                    <View style={styles.left}>
                      <View
                        style={[
                          styles.iconWrap,
                          { backgroundColor: `${categoryConfig.color}20` },
                        ]}
                      >
                        <Ionicons
                          name={categoryConfig.icon}
                          size={18}
                          color={categoryConfig.color}
                        />
                      </View>

                      <View style={styles.cardInfo}>
                        <Text style={styles.category}>{item.category}</Text>

                        {!!item.notes && (
                          <Text style={styles.notes} numberOfLines={1}>
                            {item.notes}
                          </Text>
                        )}

                        <Text style={styles.date}>
                          {new Date(item.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.right}>
                      <View style={styles.amountRow}>
                        <Text style={styles.amount}>₹{item.amount}</Text>

                        <Menu
                          visible={menuVisibleId === item.id}
                          onDismiss={() => setMenuVisibleId(null)}
                          anchor={
                            <IconButton
                              icon="dots-vertical"
                              size={20}
                              onPress={() =>
                                setMenuVisibleId(
                                  menuVisibleId === item.id ? null : item.id
                                )
                              }
                              iconColor={theme.colors.textSecondary}
                            />
                          }
                          contentStyle={[ styles.menuContent, { backgroundColor: theme.colors.surface }, ]}
                        >
                          <Menu.Item
                            title="Edit"
                            titleStyle={{ color: theme.colors.primary }}
                            leadingIcon={() => ( <Ionicons name="pencil-outline" size={18} color={theme.colors.primary} /> )}
                            onPress={() => {
                              setMenuVisibleId(null);
                              handleEdit(item.id);
                            }}
                          />
                          <Menu.Item
                            title="Delete"
                            titleStyle={{ color: theme.colors.danger }}
                            leadingIcon={() => ( <Ionicons name="trash-outline" size={18} color={theme.colors.danger} /> )}
                            onPress={() => {
                              setMenuVisibleId(null);
                              setDeleteId(item.id);
                            }}
                          />
                        </Menu>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
          </View>
        )}
      </View>
      {/* DELETE CONFIRMATION DIALOG */}
      <Portal>
        <Dialog
          visible={!!deleteId}
          onDismiss={() => setDeleteId(null)}
          style={[styles.dialog, { backgroundColor: theme.colors.surface }]}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Delete Expense?
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              This expense will be permanently removed from your records. This
              action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDeleteId(null)}
              textColor={theme.colors.textSecondary}
            >
             
              Close
            </Button>
            <Button
              onPress={confirmDelete}
              textColor="#FFFFFF"
              mode="contained"
              buttonColor={theme.colors.danger}
            >
              
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    chartContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
      marginBottom: 12,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    amountRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    summaryWrapper: {
      paddingHorizontal: 16,
      paddingBottom: 2,
      backgroundColor: "transparent",
    },
    menuContent: {
      borderRadius: 12,
      elevation: 5,
    },

    amount: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },

    emptyIllustration: {
      width: 190,
      height: 190,
      borderRadius: 95,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 32,
    },

    emptyTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.textPrimary,
      marginBottom: 12,
      textAlign: "center",
    },

    emptySubtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      maxWidth: 320,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    /* EMPTY STATE */
    emptyCard: {
      marginTop: 100,
      alignItems: "center",
      padding: 32,
      borderRadius: 24,
      backgroundColor: theme.mode === "dark" ? theme.colors.surface : "#FFFFFF",
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.mode === "dark" ? 0 : 0.05,
      shadowRadius: 8,
      elevation: theme.mode === "dark" ? 0 : 2,
    },

    emptyIconWrap: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(99, 102, 241, 0.15)"
          : "rgba(99, 102, 241, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },

    /* SUMMARY CARD */
    summaryCard: {
      marginTop: 16,
      marginBottom: 12,
      padding: 24,
      borderRadius: 24,
      backgroundColor: theme.mode === "dark" ? theme.colors.surface : "#FFFFFF",
      borderWidth: 1,
      borderColor: theme.mode === "dark" ? theme.colors.border : "#E0E7FF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.mode === "dark" ? 0 : 0.08,
      shadowRadius: 12,
      elevation: theme.mode === "dark" ? 0 : 3,
    },

    summaryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    summaryIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(99, 102, 241, 0.1)",
      alignItems: "center",
      justifyContent: "center",
    },

    summaryLabel: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    summaryAmount: {
      color: theme.colors.textPrimary,
      fontSize: 36,
      fontWeight: "800",
      marginVertical: 8,
    },

    summarySub: {
      color: theme.colors.textSecondary,
      fontSize: 13,
    },

    sectionHeaderWrap: {
      marginTop: 24,
      marginBottom: 12,
    },

    sectionHeader: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 8,
    },

    /* EXPENSE CARD */
    expenseCard: {
      flexDirection: "row",
      backgroundColor: theme.mode === "dark" ? theme.colors.surface : "#FFFFFF",
      borderRadius: 20,
      marginBottom: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.mode === "dark" ? 0 : 0.05,
      shadowRadius: 6,
      elevation: theme.mode === "dark" ? 0 : 2,
    },

    accent: {
      width: 4,
    },

    cardBody: {
      flex: 1,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    left: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
      flex: 1,
    },

    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(99, 102, 241, 0.15)"
          : "rgba(99, 102, 241, 0.1)",
      alignItems: "center",
      justifyContent: "center",
    },

    cardInfo: {
      flex: 1,
    },

    category: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },

    notes: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 2,
      marginBottom: 4,
    },

    date: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: "500",
    },

    right: {
      alignItems: "flex-end",
      gap: 8,
    },

    iconActions: {
      flexDirection: "row",
      gap: 6,
    },

    actionButton: {
      margin: 0,
    },

    /* DIALOG */
    dialog: {
      borderRadius: 20,
    },

    dialogTitle: {
      color: theme.colors.textPrimary,
      fontWeight: "700",
    },

    dialogText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
  });
