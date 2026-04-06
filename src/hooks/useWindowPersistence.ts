import { useCallback, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  LogicalPosition,
  LogicalSize,
  currentMonitor,
  type Window as TauriWindow,
} from "@tauri-apps/api/window";
import { load as loadStore } from "@tauri-apps/plugin-store";
import { migrateLegacySettings, type AppSettings } from "../lib/buddyConfig";

type SavedWindowPosition = {
  x: number;
  y: number;
};

type UseWindowPersistenceParams = {
  appWindow: TauriWindow;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
};

const STORE_FILE = "Lory.json";
const STORE_WINDOW_POSITION_KEY = "window.position";
const STORE_SETTINGS_KEY = "settings.data";
const WINDOW_MARGIN = 16;

const WINDOW_SIZE = { width: 84, height: 84 };

export const useWindowPersistence = ({
  appWindow,
  setSettings,
}: UseWindowPersistenceParams): void => {
  const hasPlacedWindowRef = useRef(false);
  const storeRef = useRef<Awaited<ReturnType<typeof loadStore>> | null>(null);

  const getDefaultBottomLeftPosition = useCallback(async () => {
    const monitor = await currentMonitor();
    if (!monitor) {
      return {
        x: WINDOW_MARGIN,
        y: WINDOW_MARGIN + WINDOW_SIZE.height,
      };
    }

    const scaleFactor = await appWindow.scaleFactor();
    const area = monitor.workArea.size.toLogical(scaleFactor);
    const pos = monitor.workArea.position.toLogical(scaleFactor);

    return {
      x: pos.x + WINDOW_MARGIN,
      y: pos.y + area.height - WINDOW_MARGIN,
    };
  }, [appWindow]);

  useEffect(() => {
    const initStoreAndPosition = async () => {
      const store = await loadStore(STORE_FILE, {
        defaults: {},
        autoSave: true,
      });
      storeRef.current = store;

      const savedSettings = await store.get<Record<string, unknown>>(STORE_SETTINGS_KEY);
      if (savedSettings) {
        setSettings(migrateLegacySettings(savedSettings));
      }

      const savedPos = await store.get<SavedWindowPosition>(
        STORE_WINDOW_POSITION_KEY,
      );
      const initialBottomLeft =
        savedPos ?? (await getDefaultBottomLeftPosition());

      await appWindow.setSize(
        new LogicalSize(WINDOW_SIZE.width, WINDOW_SIZE.height),
      );
      await appWindow.setPosition(
        new LogicalPosition(
          initialBottomLeft.x,
          initialBottomLeft.y - WINDOW_SIZE.height,
        ),
      );
      hasPlacedWindowRef.current = true;
    };

    void initStoreAndPosition();
  }, [appWindow, getDefaultBottomLeftPosition, setSettings]);

  useEffect(() => {
    const unlistenPromise = appWindow.onMoved(async ({ payload }) => {
      if (!hasPlacedWindowRef.current || !storeRef.current) {
        return;
      }

      const scaleFactor = await appWindow.scaleFactor();
      const logicalPos = payload.toLogical(scaleFactor);
      const logicalSize = (await appWindow.innerSize()).toLogical(scaleFactor);

      await storeRef.current.set(STORE_WINDOW_POSITION_KEY, {
        x: logicalPos.x,
        y: logicalPos.y + logicalSize.height,
      });
    });

    return () => {
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, [appWindow]);
};
