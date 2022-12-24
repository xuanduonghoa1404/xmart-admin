import { useState } from "react";

export default function ColorCircle({ color }) {
  const [style, setStyle] = useState({
    background: color,
  });
  return <div style={style} className="color-circle"></div>;
}
