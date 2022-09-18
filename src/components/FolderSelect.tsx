import * as TauriDialog from "@tauri-apps/api/dialog";
import FolderIcon from "@/assets/icons/folder.svg";
import VerifiedIcon from "@/assets/icons/verified.svg";
import ErrorIcon from "@/assets/icons/error.svg";
import style from "./FolderSelect.module.scss";

interface Props {
  value: string;
  onChange: (value: string) => void;
  state?: "invalid" | "valid" | "pending";
}

export const FolderSelect = (props: Props) => {
  const selectFolder = async () => {
    const folder = await TauriDialog.open({
      title: "Select Game Folder",
      directory: true,
    });
    if (typeof folder === "string") {
      props.onChange(folder);
    }
  };

  return (
    <div className={style.select}>
      <img className={style.icon} src={FolderIcon} width={25} />
      <input
        className={style.input}
        value={props.value}
        onClick={selectFolder}
        onChange={(ignored) => {}}
      />
      {props.state != null && (
        <img
          height={30}
          src={
            props.state === "invalid"
              ? ErrorIcon
              : props.state === "valid"
              ? VerifiedIcon
              : "..."
          }
          style={{ cursor: "help" }}
          title={
            props.state === "invalid"
              ? "Invalid Game Folder path"
              : props.state === "valid"
              ? "Correct Game Folder path"
              : "Trying to detect Game Folder"
          }
        />
      )}
    </div>
  );
};
