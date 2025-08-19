import React from "react";
import { withLayoutContext } from "expo-router";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";

export const Tab = withLayoutContext(
  createNativeBottomTabNavigator().Navigator
);

export default function TabLayout() {
  return (
    <Tab>
      <Tab.Screen name="index" options={{ title: "Beinleiðis" }} />
      <Tab.Screen name="program" options={{ title: "Sendingar" }} />
      <Tab.Screen name="vit" options={{ title: "VIT" }} />
      <Tab.Screen name="miks" options={{ title: "MIKS" }} />
    </Tab>
  );
}
