import { createFileRoute } from "@tanstack/react-router";
import { CustomizationSettings } from "../components/customization-settings";
import { useAppContext } from "./app";

export const Route = createFileRoute("/app/settings")({
  component: CustomizationRoute,
});

function CustomizationRoute() {
  const { settings, setSettings, skinSwatchClass } = useAppContext();
  return (
    <CustomizationSettings
      settings={settings}
      setSettings={setSettings}
      skinSwatchClass={skinSwatchClass}
    />
  );
}

