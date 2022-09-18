import React from "react";
import * as TauriFs from "@tauri-apps/api/fs";
import { FieldGrid } from "./components/FieldGrid";
import { FolderSelect } from "./components/FolderSelect";
import UpdateIcon from "@/assets/icons/update.svg";
import { useAppdata } from "./hooks/appdata.hook";
import "@/style/main.scss";

function App() {
  const appdata = useAppdata();
  const [valid, setValid] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (appdata.gameDir != null) {
      TauriFs.readDir(appdata.gameDir).then((files) => {
        const hasGw2Exe = files.some(
          (file) => file.name?.toLowerCase() === "gw2-64.exe"
        );
        setValid(hasGw2Exe);
      });
    }
  }, [valid, appdata.gameDir]);

  return (
    <div id="app">
      <div className="page">
        <div className="app-title">
          <img src={UpdateIcon} height={40} />
          <h1>Arcdps Updater</h1>
          <span className="divider" />
          <h2>For DX11 Update</h2>
        </div>

        <div className="app-body">
          <FieldGrid>
            <h4>Game Directory:</h4>
            <FolderSelect
              value={appdata.gameDir || ""}
              onChange={async (gameDir) => {
                appdata.partialUpdate({ gameDir });
                setValid(null);
              }}
              state={valid == null ? "pending" : valid ? "valid" : "invalid"}
            />
          </FieldGrid>
        </div>
      </div>
    </div>
  );
}

export default App;
