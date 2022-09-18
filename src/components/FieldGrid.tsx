import { classes } from "@/utils/classes.util";
import style from "./FieldGrid.module.scss";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export const FieldGrid: React.FC<Props> = (props) => {
  return (
    <div className={classes(style.grid, props.className)}>{props.children}</div>
  );
};
