import React from "react";
import * as TauriFs from "@tauri-apps/api/fs";
import { FieldGrid } from "./components/FieldGrid";
import { FolderSelect } from "./components/FolderSelect";
import UpdateIcon from "@/assets/icons/update.svg";
import DoubleUpIcon from "@/assets/icons/double-up.svg";
import { useAppdata } from "./hooks/appdata.hook";
import { useLocalDll, useRemoteChecksum } from "./hooks/arcdps.hook";
import "@/style/main.scss";

function App() {
  const [lastUpdated, setLastUpdated] = React.useState(0);

  const appdata = useAppdata();
  const localDll = useLocalDll(appdata.gameDir || "", lastUpdated);
  const remoteMd5 = useRemoteChecksum();

  const [valid, setValid] = React.useState<boolean | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const pending = localDll.pending || !remoteMd5;
  const localInstalled = !pending && localDll.rawdata != null;
  const checksumFail = !pending && localInstalled && localDll.md5 !== remoteMd5;

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
          <FieldGrid className="info-grid">
            <h4>Game Directory:</h4>
            <FolderSelect
              value={appdata.gameDir || ""}
              onChange={async (gameDir) => {
                appdata.partialUpdate({ gameDir });
                setValid(null);
              }}
              state={valid == null ? "pending" : valid ? "valid" : "invalid"}
            />

            <h4>Local Hash:</h4>
            <p
              style={{
                color: pending
                  ? undefined
                  : checksumFail
                  ? "#ff2929"
                  : "#36e336",
              }}
            >
              {!valid ? (
                <em>Waiting for Game Directory selection...</em>
              ) : localDll.pending ? (
                <em>Calculating MD5 Checksum...</em>
              ) : !localDll.rawdata ? (
                <em>Arcdps is not installed locally</em>
              ) : (
                localDll.md5
              )}
            </p>

            <h4>Remote Hash:</h4>

            <p
              style={{
                color: pending
                  ? undefined
                  : checksumFail
                  ? "#ff2929"
                  : "#36e336",
              }}
            >
              {!remoteMd5 ? <em>Fetching MD5 Checksum...</em> : remoteMd5}
            </p>

            <h4>State:</h4>
            <p>
              {!remoteMd5 ? (
                <em>Fetching Remote MD5 Checksum...</em>
              ) : localDll.pending ? (
                <em>Calculating Local MD5 Checksum...</em>
              ) : !localInstalled ? (
                <>-</>
              ) : localDll.rawdata == null ? (
                <>Arcdps is ready to be installed</>
              ) : localDll.md5 !== remoteMd5 ? (
                <>
                  New update is available!{" "}
                  <img src={DoubleUpIcon} height={16} />
                </>
              ) : (
                <>Arcdps is up to date :)</>
              )}
            </p>
          </FieldGrid>

          <div className="actions">
            {(deleting || localInstalled) && (
              <button
                className="btn-uninstall"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  await localDll.deleteFile();
                  setDeleting(false);
                  setLastUpdated(Date.now());
                }}
              >
                {deleting ? "Uninstalling..." : "Uninstall"}
              </button>
            )}
            {!pending && (
              <button
                className="btn-update"
                disabled={
                  deleting || downloading || (localInstalled && !checksumFail)
                }
                onClick={async () => {
                  setDownloading(true);
                  await localDll.downloadFile();
                  setDownloading(false);
                  setLastUpdated(Date.now());
                }}
              >
                {downloading
                  ? "Downloading..."
                  : !localInstalled
                  ? "Download Arcdps"
                  : checksumFail
                  ? "Update Arcdps"
                  : "No Update Available"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
