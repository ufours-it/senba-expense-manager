import { getToastConfig } from '@/config/toastConfig';
import { ExpenseProvider } from "@/context/expenseContext";
import { useTheme } from "@/context/themeContext";
import { Stack } from "expo-router";
import { PaperProvider, Portal } from "react-native-paper";
import Toast from 'react-native-toast-message';

//local imports
import { ThemeProvider } from "@/context/themeContext";

function ToastWrapper() {
  const { theme } = useTheme();
  return <Toast config={getToastConfig(theme)} />;
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <Portal.Host>
        <ThemeProvider>
        <ExpenseProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <ToastWrapper />
        </ExpenseProvider>
        </ThemeProvider>
      </Portal.Host>
    </PaperProvider>
  );
}
