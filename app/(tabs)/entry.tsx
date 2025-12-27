import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Modal, Portal, Text, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import uuid from "react-native-uuid";

//local Imports
import { ThemeToggle } from "@/components/themeToggle";
import { CATEGORY_OPTIONS } from "@/constants/categories";
import { useExpenses } from "@/context/expenseContext";
import { useTheme } from "@/context/themeContext";
import { ExpenseModel } from "@/models/expense";
import { formatDate } from "@/utils/formatDate";
import { expenseSchema } from "@/validation/expenseSchema";

export default function EntryScreen() {
  const { theme } = useTheme();
  const { expenseId } = useLocalSearchParams();
  const { expenses, addExpense, updateExpense } = useExpenses();
  const router = useRouter();
  const isSubmittingRef = useRef(false);
  const styles = createStyles(theme);

  const [menuVisible, setMenuVisible] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const stripTime = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = stripTime(new Date());
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseModel>({
    resolver: yupResolver(expenseSchema),
    defaultValues: {
      id: uuid.v4() as string,
      category: "",
      amount: undefined,
      date: new Date(),
      notes: "",
    },
  });
  const selectedDate = watch("date");

  useEffect(() => {
    if (!expenseId) {
      reset({
        id: uuid.v4() as string,
        category: "",
        amount: undefined,
        date: new Date(),
        notes: "",
      });
      return;
    }

    const expense = expenses.find((e) => e.id === expenseId);
    if (expense) {
      reset({
        ...expense,
        date: new Date(expense.date),
      });
    }
  }, [expenseId, expenses]);

  const onSubmit = (data: ExpenseModel) => {
    try {
      isSubmittingRef.current = true;
      if (expenseId) {
        updateExpense({ ...data, date: data.date, id: expenseId.toString() });
      } else {
        addExpense({
          ...data,
          date: data.date || new Date(),
          id: uuid.v4().toString(),
        });
      }
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: expenseId
          ? "Expense updated successfully"
          : "Expense added successfully",
      });
      reset();
      router.replace("/(tabs)/dashboard");
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 300);
    } catch (error) {
      console.error("Error saving expense:", error);
      Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: "We could not save this expense. Please try again.",
      });
      isSubmittingRef.current = false;
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemeToggle />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Record Expense</Text>
            <Text style={styles.pageSubtitle}>
              Track and categorize your expenses.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Category<Text style={{ color: "red" }}> *</Text>
              </Text>
              <Pressable onPress={() => setMenuVisible(true)}>
                <View style={styles.selectInput}>
                  <Text
                    style={[
                      styles.selectText,
                      !watch("category") && styles.placeholder,
                    ]}
                  >
                    {watch("category") || "Select category"}
                  </Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
              {!!errors.category && (
                <Text style={styles.errorText}>{errors.category?.message}</Text>
              )}
            </View>

            <Portal>
              <Modal
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                contentContainerStyle={styles.modal}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                </View>
                <ScrollView style={styles.modalScroll}>
                  {CATEGORY_OPTIONS.map((item, index) => (
                    <Pressable
                      key={item.value}
                      onPress={() => {
                        setValue("category", item.value, {
                          shouldValidate: true,
                        });
                        setMenuVisible(false);
                      }}
                      style={({ pressed }) => [
                        styles.modalItem,
                        pressed && styles.modalItemPressed,
                        index === CATEGORY_OPTIONS.length - 1 &&
                          styles.modalItemLast,
                      ]}
                    >
                      <Text style={styles.modalItemText}>{item.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </Modal>
            </Portal>

            {/* AMOUNT */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Amount<Text style={{ color: "red" }}> *</Text>
              </Text>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.amountInputWrapper}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      mode="flat"
                      keyboardType="numeric"
                      value={value !== undefined ? String(value) : ""}
                      onChangeText={(text) => {
                        const regex = /^\d{0,7}(\.\d{0,2})?$/;
                        if (regex.test(text)) {
                          onChange(text);
                        }
                      }}
                      placeholder="0.00"
                      style={styles.amountInput}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      textColor={theme.colors.textPrimary}
                      placeholderTextColor={theme.colors.textMuted}
                      theme={{
                        colors: {
                          background: "transparent",
                        },
                      }}
                    />
                  </View>
                )}
              />
              {!!errors.amount && (
                <Text style={styles.errorText}>{errors.amount?.message}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Date<Text style={{ color: "red" }}> *</Text>
              </Text>
              <Pressable onPress={() => setDateVisible(true)}>
                <View style={styles.selectInput}>
                  <Text style={styles.selectText}>
                    {formatDate(selectedDate)}
                  </Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
              {!!errors.date && (
                <Text style={styles.errorText}>{errors.date?.message}</Text>
              )}
            </View>

            <DatePickerModal
              locale="en"
              mode="single"
              visible={dateVisible}
              date={selectedDate}
              onDismiss={() => setDateVisible(false)}
              onConfirm={({ date }) => {
                setDateVisible(false);
                setValue("date", date || new Date());
              }}
              validRange={{ endDate: today }}
            />
<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
   <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Notes<Text style={{ color: "red" }}> *</Text>
              </Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    mode="flat"
                    multiline
                    numberOfLines={3}
                    maxLength={100}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Add notes about this expense..."
                    style={styles.notesInput}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    textColor={theme.colors.textPrimary}
                    placeholderTextColor={theme.colors.textMuted}
                    theme={{
                      colors: {
                        background: "transparent",
                      },
                    }}
                  />
                )}
              />
              {!!errors.notes && (
                <Text style={styles.errorText}>{errors.notes?.message}</Text>
              )}
            </View>
</ScrollView></KeyboardAvoidingView>
            {/* ACTION BUTTON */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Save Expense</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      flex: 1,
    },

    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },

    /* PAGE HEADER */
    pageHeader: {
      marginTop: 8,
      marginBottom: 24,
      paddingHorizontal: 4,
    },

    pageTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.textPrimary,
      letterSpacing: -0.5,
    },

    pageSubtitle: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginTop: 6,
    },

    /* FORM CARD */
    formCard: {
      backgroundColor: theme.mode === "dark" ? theme.colors.surface : "#FFFFFF",
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.mode === "dark" ? 0 : 0.06,
      shadowRadius: 12,
      elevation: theme.mode === "dark" ? 0 : 3,
    },

    /* FIELD GROUP */
    fieldGroup: {
      marginBottom: 24,
    },

    fieldLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 8,
      letterSpacing: 0.2,
    },

    /* SELECT INPUT */
    selectInput: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    selectText: {
      fontSize: 15,
      color: theme.colors.textPrimary,
      flex: 1,
    },

    placeholder: {
      color: theme.colors.textMuted,
    },

    chevron: {
      fontSize: 24,
      color: theme.colors.textMuted,
      fontWeight: "300",
      transform: [{ rotate: "90deg" }],
    },

    /* AMOUNT INPUT */
    amountInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    currencySymbol: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginRight: 8,
    },

    amountInput: {
      flex: 1,
      fontSize: 16,
      backgroundColor: "transparent",
      paddingHorizontal: 0,
    },

    /* NOTES INPUT */
    notesInput: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontSize: 15,
      minHeight: 90,
      textAlignVertical: "top",
    },

    /* ERROR TEXT */
    errorText: {
      fontSize: 12,
      color: theme.colors.danger,
      marginTop: 6,
      marginLeft: 4,
    },

    /* MODAL */
    modal: {
      backgroundColor: theme.mode === "dark" ? theme.colors.surface : "#FFFFFF",
      marginHorizontal: 24,
      borderRadius: 20,
      maxHeight: "70%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: theme.mode === "dark" ? 1 : 0,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },

    modalHeader: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },

    modalScroll: {
      maxHeight: 400,
    },

    modalItem: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    modalItemLast: {
      borderBottomWidth: 0,
    },

    modalItemPressed: {
      backgroundColor:
        theme.mode === "dark"
          ? "rgba(99, 102, 241, 0.15)"
          : "rgba(99, 102, 241, 0.08)",
    },

    modalItemText: {
      fontSize: 15,
      color: theme.colors.textPrimary,
      fontWeight: "500",
    },

    /* BUTTON */
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 8,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.mode === "dark" ? 0 : 0.3,
      shadowRadius: 8,
      elevation: theme.mode === "dark" ? 0 : 4,
    },

    buttonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
  });
