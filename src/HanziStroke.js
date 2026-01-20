import { useEffect, useRef } from "react";
import HanziWriter from "hanzi-writer";

export default function HanziStroke({ char }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!char) return;

    ref.current.innerHTML = "";

    HanziWriter.create(ref.current, char, {
      width: 200,
      height: 200,
      padding: 10,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 300,
      showOutline: true,
      showCharacter: false,
      strokeColor: "#2b7cff",
      radicalColor: "#ff6b6b"
    }).animateCharacter();
  }, [char]);

  return <div ref={ref} />;
}
