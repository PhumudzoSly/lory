import { useCallback, useEffect, useRef } from "react";
import {
  LogicalPosition,
  LogicalSize,
  currentMonitor,
  type Window as TauriWindow,
} from "@tauri-apps/api/window";
import {
  readSqliteJson,
  SQLITE_KEYS,
  type SavedWindowPosition,
  writeSqliteJson,
} from "../lib/sqliteStorage";

type UseWindowPersistenceParams = {
  appWindow: TauriWindow;
};

const WINDOW_MARGIN = 16;

const WINDOW_SIZE = { width: 56, height: 56 };

export const useWindowPersistence = ({
  appWindow,
}: UseWindowPersistenceParams): void => {
  const hasPlacedWindowRef = useRef(false);

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
      const savedPos = await readSqliteJson<SavedWindowPosition>(
        SQLITE_KEYS.windowPosition,
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
  }, [appWindow, getDefaultBottomLeftPosition]);

  useEffect(() => {
    const unlistenPromise = appWindow.onMoved(async ({ payload }) => {
      if (!hasPlacedWindowRef.current) {
        return;
      }

      const scaleFactor = await appWindow.scaleFactor();
      const logicalPos = payload.toLogical(scaleFactor);
      const logicalSize = (await appWindow.innerSize()).toLogical(scaleFactor);

      await writeSqliteJson(SQLITE_KEYS.windowPosition, {
        x: logicalPos.x,
        y: logicalPos.y + logicalSize.height,
      });
    });

    return () => {
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, [appWindow]);
};
