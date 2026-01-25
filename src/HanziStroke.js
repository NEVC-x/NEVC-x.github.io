import { useEffect, useRef, useState, useCallback } from "react";
import HanziWriter from "hanzi-writer";

/**
 * 精准笔顺动画组件
 * 使用 hanzi-writer 库提供准确的汉字笔顺演示
 */
export default function HanziStroke({ char, config = {} }) {
  const ref = useRef(null);
  const writerRef = useRef(null);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const defaultConfig = {
    width: 240,
    height: 240,
    padding: 15,
    strokeAnimationSpeed: 1,
    delayBetweenStrokes: 400,
    showOutline: true,
    showCharacter: false,
    strokeColor: "#FF4444",
    radicalColor: "#33B5E5",
    outlineColor: "#DDDDDD",
    strokeAnimationDuration: 500,
    strokeFadeDuration: 300,
    drawStartAnimationDuration: 300,
    drawCompleteAnimationDuration: 300,
  };

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!char || !ref.current) return;

    ref.current.innerHTML = "";

    try {
      const writer = HanziWriter.create(ref.current, char, finalConfig);
      writerRef.current = writer;

      const charData = writer.character;
      if (charData && charData.strokes) {
        setTotalStrokes(charData.strokes.length);
      }

      playAnimation();

      return () => {
        if (writerRef.current) {
          writerRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing HanziWriter:", error);
    }
  }, [char, config]);

  const playAnimation = useCallback(() => {
    if (!writerRef.current) return;

    setIsPlaying(true);
    setCurrentStroke(0);

    writerRef.current.animateCharacter({
      onStrokeComplete: (strokeIndex) => {
        setCurrentStroke(strokeIndex + 1);
      },
      onComplete: () => {
        setIsPlaying(false);
        if (isLooping) {
          setTimeout(() => {
            playAnimation();
          }, 1500);
        }
      },
    });
  }, [isLooping]);

  const pauseAnimation = useCallback(() => {
    if (writerRef.current) {
      writerRef.current.hideCharacter();
      setIsPlaying(false);
      setCurrentStroke(0);
    }
  }, []);

  const resetAnimation = useCallback(() => {
    if (writerRef.current) {
      writerRef.current.hideCharacter();
      setCurrentStroke(0);
      setIsPlaying(false);
    }
  }, []);

  const playStroke = useCallback((strokeIndex) => {
    if (!writerRef.current || strokeIndex >= totalStrokes) return;

    writerRef.current.animateStroke(strokeIndex, {
      onComplete: () => {
        setCurrentStroke(strokeIndex + 1);
      },
    });
  }, [totalStrokes]);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => !prev);
  }, []);

  const progressPercentage = totalStrokes > 0
    ? Math.round((currentStroke / totalStrokes) * 100)
    : 0;

  const getStrokeStatusClass = (index) => {
    if (index < currentStroke) return "completed";
    if (index === currentStroke - 1) return "current";
    return "pending";
  };

  return (
    <div className="hanzi-stroke-container">
      <div
        ref={ref}
        className="hanzi-stroke-canvas"
        style={{
          width: finalConfig.width,
          height: finalConfig.height,
        }}
      />

      <div className="stroke-progress-section">
        <div className="stroke-count">
          <span className="count-label">笔画进度</span>
          <span className="count-numbers">
            {currentStroke} <span className="divider">/</span> {totalStrokes}
          </span>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: progressPercentage + "%" }}
            />
          </div>
          <span className="progress-percentage">{progressPercentage}%</span>
        </div>
      </div>

      <div className="stroke-controls">
        <div className="control-group">
          <button
            className={"control-btn" + (isPlaying ? " playing" : "")}
            onClick={isPlaying ? pauseAnimation : playAnimation}
            disabled={!char}
            title={isPlaying ? "暂停" : "播放"}
          >
            <span className="btn-icon">{isPlaying ? "||" : "▶"}</span>
            <span className="btn-text">{isPlaying ? "暂停" : "播放"}</span>
          </button>

          <button
            className="control-btn"
            onClick={resetAnimation}
            disabled={!char}
            title="重置"
          >
            <span className="btn-icon">⟳</span>
            <span className="btn-text">重置</span>
          </button>

          <button
            className={"control-btn loop-btn" + (isLooping ? " active" : "")}
            onClick={toggleLoop}
            title="循环播放"
          >
            <span className="btn-icon">↺</span>
            <span className="btn-text">{isLooping ? "循环中" : "循环"}</span>
          </button>
        </div>

        <div className="step-controls">
          <span className="step-label">分步演示：</span>
          <div className="step-buttons">
            {Array.from({ length: totalStrokes }).map((_, index) => (
              <button
                key={index}
                className={"step-btn " + getStrokeStatusClass(index)}
                onClick={() => playStroke(index)}
                disabled={index >= currentStroke}
                title={"第 " + (index + 1) + " 笔：" + getStrokeName(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="stroke-info">
        <span className="info-label">💡 提示</span>
        <span className="info-text">
          点击"播放"观看完整笔顺，或点击下方数字单独播放每一笔
        </span>
      </div>
    </div>
  );
}

function getStrokeName(index) {
  const strokeNames = [
    "点", "横", "竖", "撇", "捺", "提", "折", "钩", "弯",
  ];
  return strokeNames[index % strokeNames.length];
}
