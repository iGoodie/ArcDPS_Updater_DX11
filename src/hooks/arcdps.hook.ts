import React from "react";
import * as TauriFs from "@tauri-apps/api/fs";
import * as TauriHttp from "@tauri-apps/api/http";
import MD5 from "md5";
import axios from "axios";

const DLL_NAME = "d3d11.dll";
const ARCDPS_URL = "https://www.deltaconnected.com/arcdps/x64";
const CHECKSUM_NAME = "d3d11.dll.md5sum";

export function useLocalDll(gameDir: string) {
  const [pending, setPending] = React.useState<boolean>();
  const [rawdata, setRawdata] = React.useState<Uint8Array>();
  const [md5, setMd5] = React.useState<string>();

  const readDll = async () => {
    try {
      setPending(true);
      const path = `${gameDir}/${DLL_NAME}`;
      const data = await TauriFs.readBinaryFile(path);
      setRawdata(data);
      setMd5(MD5(data));
    } catch (error) {
    } finally {
      setPending(false);
    }
  };

  React.useEffect(() => {
    readDll();
  }, [gameDir]);

  return { pending, rawdata, md5 };
}

export function useRemoteChecksum() {
  const [md5, setMd5] = React.useState<string>();

  const fetchChecksum = async () => {
    const response = await TauriHttp.fetch<string>(
      `${ARCDPS_URL}/${CHECKSUM_NAME}`,
      { method: "GET", responseType: TauriHttp.ResponseType.Text }
    );
    setMd5(response.data.split(/\s+/)[0]);
  };

  React.useEffect(() => {
    fetchChecksum();
  }, []);

  return md5;
}
