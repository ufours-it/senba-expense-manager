import { COLORS } from "@/constants/theme";
import { useTheme } from "@/context/themeContext";
import { IconButton } from "react-native-paper";

export const ThemeToggle = () => {
  const { isDark, setIsDark } = useTheme();

  return (
    <IconButton
      iconColor={COLORS.primary}
      icon={isDark ? "weather-sunny" : "weather-night"}
      onPress={() => setIsDark(!isDark)}
    />
  );
};
