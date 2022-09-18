import React from "react";
import {
  BaseDirectory,
  exists,
  createDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";

const APP_DATA_FOLDER = "ArcdpsUpdaterDx11";
const CONFIG_FILE_NAME = "app.config.json";

interface AppConfig {
  gameDir?: string;
}

const defaultConfig: AppConfig = {
  gameDir: "",
};

export function useAppdata() {
  const [config, setConfig] = React.useState<AppConfig>(defaultConfig);

  const initialize = React.useCallback(async () => {
    setConfig(await readConfigJson());
  }, []);

  const update = (partialUpdate: Partial<AppConfig>) => {
    const newConfig = Object.assign({ ...partialUpdate }, partialUpdate);
    setConfig(newConfig);
    saveConfigJson(newConfig);
  };

  React.useEffect(() => {
    initialize();
  }, []);

  return { ...config, partialUpdate: update };
}

/* ------------------------- */

export async function createDataFolder() {
  return createDir(APP_DATA_FOLDER, {
    dir: BaseDirectory.Data,
    recursive: true,
  });
}

export async function readConfigJson(): Promise<AppConfig> {
  const filepath = `${APP_DATA_FOLDER}/${CONFIG_FILE_NAME}`;
  try {
    exists(filepath, { dir: BaseDirectory.Data });
    const filedata = await readTextFile(filepath, { dir: BaseDirectory.Data });
    return JSON.parse(filedata);
  } catch (error) {
    saveConfigJson(defaultConfig);
    return defaultConfig;
  }
}

export async function saveConfigJson(config: AppConfig) {
  const filepath = `${APP_DATA_FOLDER}/${CONFIG_FILE_NAME}`;
  writeTextFile(filepath, JSON.stringify(config, undefined, 3), {
    dir: BaseDirectory.Data,
  });
}
