import React from "react";
import * as TauriFs from "@tauri-apps/api/fs";
import * as TauriHttp from "@tauri-apps/api/http";
import MD5 from "md5";

const DLL_NAME = "d3d11.dll";
const CHECKSUM_NAME = "d3d11.dll.md5sum";
const ARCDPS_URL = "https://www.deltaconnected.com/arcdps/x64";

export function useLocalDll(gameDir: string, lastUpdated: number) {
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

  const deleteFile = async () => {
    const path = `${gameDir}/${DLL_NAME}`;
    await TauriFs.removeFile(path);
    setRawdata(undefined);
    setMd5(undefined);
  };

  const downloadFile = async () => {
    const urlpath = `${ARCDPS_URL}/${DLL_NAME}`;
    const fspath = `${gameDir}/${DLL_NAME}`;
    const response = await TauriHttp.fetch<Uint8Array>(urlpath, {
      method: "GET",
      responseType: TauriHttp.ResponseType.Binary,
    });
    setRawdata(undefined);
    setMd5(undefined);
    await TauriFs.writeBinaryFile(fspath, response.data);
  };

  React.useEffect(() => {
    readDll();
  }, [gameDir, lastUpdated]);

  return { pending, rawdata, md5, deleteFile, downloadFile };
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
