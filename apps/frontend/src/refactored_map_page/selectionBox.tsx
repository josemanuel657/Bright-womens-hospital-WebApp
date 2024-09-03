import { CSSProperties } from "react";
import { Scaling } from "common/src/types/map_page_types.ts";

export interface SelectionBoxProps {
  startMousePosition: { x: number; y: number };
  dimensions: { width: number; height: number };
  scaling: Scaling;
}

export default SelectionBox;

function SelectionBox(props: SelectionBoxProps) {
  const { x, y } = props.startMousePosition;
  //const {width, height} = props.dimensions;
  const { widthScaling, heightScaling } = props.scaling;

  const divStyle: CSSProperties = {
    position: "absolute",
    color: "blue",
    backgroundColor: "blue",
    left: `${x * widthScaling}px`,
    right: `${y * heightScaling}px`,
    width: "50%",
    height: "50%",
    zIndex: 4000,
  };

  return <div style={divStyle}></div>;
}
