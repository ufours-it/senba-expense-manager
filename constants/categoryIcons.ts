import { Ionicons } from "@expo/vector-icons";

export type CategoryKey =
  | "Meals"
  | "Transportation"
  | "Groceries"
  | "Utilities"
  | "Healthcare"
  | "Entertainment"
  | "PersonalCare"
  | "Miscellaneous";

export const CATEGORY_ICON_MAP: Record<
  CategoryKey,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  Meals: {
    icon: "restaurant",
    color: "#F97316", // orange
  },
  Transportation: {
    icon: "car",
    color: "#0EA5E9", // blue
  },
  Groceries: {
    icon: "cart",
    color: "#22C55E", // green
  },
  Utilities: {
    icon: "flash",
    color: "#A855F7", // purple
  },
  Healthcare: {
    icon: "medkit",
    color: "#EF4444", // red
  },
  Entertainment: {
    icon: "film",
    color: "#EC4899", // pink
  },
  PersonalCare: {
    icon: "person",
    color: "#14B8A6", // teal
  },
  Miscellaneous: {
    icon: "ellipsis-vertical",
    color: "#64748B", // slate
  },
};
