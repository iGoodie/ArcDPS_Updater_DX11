import {
  BaseDirectory,
  exists,
  createDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";

const APP_DATA_FOLDER = "ArcdpsUpdaterDx11";
const CONFIG_FILE_NAME = "app.config.json";

/* ------------------------- */

interface AppConfig {
  gameDir?: string;
}

console.log("Loading App Config...");

let appConfig: AppConfig = {
  gameDir: "",
};
appConfig = await readConfigJson();

console.log("App Config loaded successfully.", appConfig);

/* ------------------------- */

export async function createDataFolder() {
  return createDir(APP_DATA_FOLDER, {
    dir: BaseDirectory.Data,
    recursive: true,
  });
}

export async function readConfigJson() {
  const filepath = `${APP_DATA_FOLDER}/${CONFIG_FILE_NAME}`;
  try {
    exists(filepath, { dir: BaseDirectory.Data });
    const filedata = await readTextFile(filepath, { dir: BaseDirectory.Data });
    return JSON.parse(filedata);
  } catch (error) {
    saveConfigJson();
    return appConfig;
  }
}

export async function saveConfigJson() {
  const filepath = `${APP_DATA_FOLDER}/${CONFIG_FILE_NAME}`;
  writeTextFile(filepath, JSON.stringify(appConfig, undefined, 3), {
    dir: BaseDirectory.Data,
  });
}
