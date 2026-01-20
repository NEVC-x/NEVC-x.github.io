import React, { useState } from "react";
import HanziStroke from "./HanziStroke";

/* =======================
   汉字词典数据
======================= */

const DICTIONARY = {
  学: {
    pinyin: "xué",
    meaning: "学习、学问",
    strokes: [
      "M30 25 L70 25",
      "M40 35 L50 45",
      "M60 35 L50 45",
      "M30 55 L70 55",
      "M50 55 L50 85"
    ],
    examples: ["学习", "学校", "学生", "学会", "大学"]
  },
  京: {
    pinyin: "jīng",
    meaning: "首都、城市",
    strokes: [
      "M35 20 L65 20",
      "M30 30 L70 30",
      "M30 30 L30 55",
      "M70 30 L70 55",
      "M30 55 L70 55",
      "M50 60 L50 85",
      "M40 70 L30 85",
      "M60 70 L70 85"
    ],
    examples: ["北京", "京剧", "京城", "南京", "东京"]
  },
  剧: {
    pinyin: "jù",
    meaning: "戏剧、演出",
    strokes: [
      "M25 20 L75 20",
      "M25 20 L25 70",
      "M25 45 L70 45",
      "M40 45 L40 70",
      "M80 30 L80 85"
    ],
    examples: ["京剧", "戏剧", "喜剧", "悲剧", "剧场"]
  },
  唱: {
    pinyin: "chàng",
    meaning: "歌唱、演唱",
    strokes: [
      "M25 30 L55 30",
      "M25 30 L25 55",
      "M55 30 L55 55",
      "M25 55 L55 55",
      "M65 30 L90 30",
      "M65 30 L65 55",
      "M90 30 L90 55",
      "M65 55 L90 55",
      "M65 60 L90 60",
      "M65 60 L65 85",
      "M90 60 L90 85",
      "M65 85 L90 85"
    ],
    examples: ["唱歌", "唱戏", "演唱", "合唱", "独唱"]
  },
  戏: {
    pinyin: "xì",
    meaning: "戏剧、玩耍",
    strokes: [
      "M30 25 L70 25",
      "M55 25 L55 55",
      "M40 55 L70 80",
      "M30 60 L45 80",
      "M45 80 L60 65"
    ],
    examples: ["唱戏", "看戏", "戏剧", "游戏", "戏院"]
  },
  我: {
    pinyin: "wǒ",
    meaning: "自己",
    strokes: [
      "M35 25 L65 25",
      "M50 25 L50 80",
      "M30 40 L70 40",
      "M35 55 L65 55",
      "M40 70 L60 70"
    ],
    examples: ["我们", "我的", "自己", "我要", "我国"]
  },
  很: {
    pinyin: "hěn",
    meaning: "非常",
    strokes: [
      "M30 25 L70 25",
      "M30 25 L30 85",
      "M70 25 L70 85",
      "M50 40 L50 70"
    ],
    examples: ["很好", "很多", "很棒", "很漂亮", "很厉害"]
  },
  好: {
    pinyin: "hǎo",
    meaning: "优秀、美丽",
    strokes: [
      "M30 25 L70 25",
      "M50 25 L50 60",
      "M30 60 L70 60",
      "M40 70 L60 70"
    ],
    examples: ["好看", "好人", "好吃", "好玩", "好天气"]
  },
  跟: {
    pinyin: "gēn",
    meaning: "跟随、和",
    strokes: [
      "M25 25 L75 25",
      "M50 25 L50 85",
      "M30 40 L70 40",
      "M40 55 L60 55"
    ],
    examples: ["跟着", "跟谁", "跟我", "跟随", "跟班"]
  },
  老: {
    pinyin: "lǎo",
    meaning: "年长、陈旧",
    strokes: [
      "M40 20 L60 20",
      "M40 20 L40 70",
      "M60 20 L60 70",
      "M30 35 L70 35",
      "M50 55 L50 85"
    ],
    examples: ["老师", "老人", "老同学", "老板", "老乡"]
  },
  师: {
    pinyin: "shī",
    meaning: "教师、专家",
    strokes: [
      "M30 20 L70 20",
      "M30 20 L30 50",
      "M70 20 L70 50",
      "M50 50 L50 85",
      "M40 60 L60 60"
    ],
    examples: ["老师", "师生", "师父", "师傅", "师范"]
  },
  山: {
    pinyin: "shān",
    meaning: "山峰、山脉",
    strokes: [
      "M50 20 L50 80",
      "M30 50 L70 50",
      "M40 70 L60 70"
    ],
    examples: ["大山", "高山", "山路", "山水", "爬山"]
  },
  水: {
    pinyin: "shuǐ",
    meaning: "水、液体",
    strokes: [
      "M30 40 L70 40",
      "M40 50 L50 70",
      "M60 50 L50 70"
    ],
    examples: ["河水", "水杯", "水果", "喝水", "水平"]
  },
  火: {
    pinyin: "huǒ",
    meaning: "火焰、燃烧",
    strokes: [
      "M40 30 L60 30",
      "M45 45 L55 45",
      "M50 60 L50 75"
    ],
    examples: ["大火", "火车", "火花", "火山", "火苗"]
  },
  木: {
    pinyin: "mù",
    meaning: "树木、木材",
    strokes: [
      "M50 20 L50 80",
      "M30 50 L70 50"
    ],
    examples: ["木头", "树木", "木门", "木匠", "木屋"]
  },
  人: {
    pinyin: "rén",
    meaning: "人类、个人",
    strokes: [
      "M40 30 L40 60",
      "M40 60 L60 40"
    ],
    examples: ["大人", "人民", "人生", "人口", "人工"]
  },
  口: {
    pinyin: "kǒu",
    meaning: "嘴巴、开口",
    strokes: [
      "M30 30 L70 30",
      "M30 30 L30 60",
      "M70 30 L70 60",
      "M30 60 L70 60"
    ],
    examples: ["人口", "门口", "口袋", "口红", "口水"]
  },
  大: {
    pinyin: "dà",
    meaning: "巨大、年长",
    strokes: [
      "M30 30 L70 30",
      "M50 30 L50 70",
      "M30 70 L70 70"
    ],
    examples: ["大家", "大人", "大树", "大海", "大地"]
  },
  小: {
    pinyin: "xiǎo",
    meaning: "细小、年轻",
    strokes: [
      "M50 20 L50 80",
      "M35 45 L65 45",
      "M40 65 L60 65"
    ],
    examples: ["小狗", "小猫", "小心", "小孩", "小鸟"]
  },
  天: {
    pinyin: "tiān",
    meaning: "天空、天体",
    strokes: [
      "M30 30 L70 30",
      "M30 30 L30 60",
      "M70 30 L70 60",
      "M30 60 L70 60",
      "M50 60 L50 80"
    ],
    examples: ["天空", "天气", "天堂", "天生", "今天"]
  },
  地: {
    pinyin: "dì",
    meaning: "土地、地面",
    strokes: [
      "M30 20 L70 20",
      "M50 20 L50 50",
      "M30 50 L70 50",
      "M35 65 L65 65"
    ],
    examples: ["土地", "地球", "地方", "地下", "地址"]
  }
};

/* =======================
   汉字详情卡片组件
======================= */

function CharacterDetailCard({ char, onClose }) {
  const data = DICTIONARY[char];
  if (!data) return null;

  const playSound = () => {
    const u = new SpeechSynthesisUtterance(char);
    u.lang = "zh-CN";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  return (
    <div className="character-card" onClick={playSound}>
      <div className="card-header">
        <div className="character-display">{char}</div>
        <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          ×
        </button>
      </div>

      <div className="pinyin-section">
        <span className="pinyin-label">拼音：</span>
        <span className="pinyin-text">{data.pinyin}</span>
      </div>

      <div className="meaning-section">
        <span className="meaning-label">释义：</span>
        <span className="meaning-text">{data.meaning}</span>
      </div>

      <div className="strokes-section">
        <div className="strokes-title">✍️ 笔顺演示</div>
        <HanziStroke char={char} />
      </div>

      <div className="examples-section">
        <span className="examples-label">例词：</span>
        <div className="examples-grid">
          {data.examples.map((word, index) => (
            <span key={index} className="example-word">{word}</span>
          ))}
        </div>
      </div>

      <div className="card-hint">点击卡片发音，点击背景关闭</div>
    </div>
  );
}

/* =======================
   随文识字阅读器组件
======================= */

export default function TextReader() {
  const [inputText, setInputText] = useState("我学京剧。京剧很好看。我跟老师学唱戏。");
  const [highlightedText, setHighlightedText] = useState("");
  const [selectedChar, setSelectedChar] = useState(null);
  const [searchChar, setSearchChar] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [studyProgress, setStudyProgress] = useState({});
  const [clickEffect, setClickEffect] = useState(null);

  // 处理文本输入
  const handleTextChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    highlightCharacters(text);
  };

  // 高亮显示课文中的生字
  const highlightCharacters = (text) => {
    let highlighted = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (DICTIONARY[char]) {
        highlighted += `<span class="highlighted-char" data-char="${char}">${char}</span>`;
      } else {
        highlighted += char;
      }
    }
    setHighlightedText(highlighted);
  };

  // 处理汉字点击
  const handleCharClick = (e) => {
    if (e.target.classList.contains('highlighted-char')) {
      const char = e.target.getAttribute('data-char');
      setSelectedChar(char);
      handleCharClickEffect(e, char);
    }
  };

  // 处理搜索
  const handleSearch = () => {
    if (searchChar.length === 1 && /[一-龯]/.test(searchChar)) {
      setSearchResult(DICTIONARY[searchChar]);
      setSelectedChar(searchChar);
    } else {
      setSearchResult(null);
    }
  };

  // 清除搜索
  const handleSearchClear = () => {
    setSearchChar("");
    setSearchResult(null);
  };

  // 切换主题
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 切换学习进度
  const toggleCharacterProgress = (char) => {
    setStudyProgress(prev => ({
      ...prev,
      [char]: !prev[char]
    }));
  };

  // 处理生字点击效果
  const handleCharClickEffect = (e, char) => {
    const rect = e.target.getBoundingClientRect();
    setClickEffect({
      char,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      visible: true
    });

    // 播放发音
    const u = new SpeechSynthesisUtterance(char);
    u.lang = "zh-CN";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);

    // 1秒后隐藏效果
    setTimeout(() => {
      setClickEffect(prev => ({...prev, visible: false}));
    }, 1000);
  };

  // 获取课文中出现的所有生字
  const getUniqueChars = () => {
    const chars = new Set();
    for (let char of inputText) {
      if (DICTIONARY[char]) {
        chars.add(char);
      }
    }
    return Array.from(chars);
  };

  return (
    <div className={`text-reader-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="reader-header">
        <div className="header-content">
          <div className="title-section">
            <h1>📚 随文识字</h1>
            <p>在课文中点击生字，查看拼音、释义和笔顺</p>
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ 日间模式' : '🌙 夜间模式'}
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            className="search-input"
            value={searchChar}
            onChange={(e) => setSearchChar(e.target.value)}
            placeholder="输入汉字进行查询..."
            maxLength={1}
          />
          <button className="search-btn" onClick={handleSearch}>查询</button>
          {searchChar && (
            <button className="clear-btn" onClick={handleSearchClear}>×</button>
          )}
          {searchResult && (
            <div className="search-result">
              找到汉字：{searchChar}
            </div>
          )}
          {searchChar && !searchResult && !/[一-龯]/.test(searchChar) && (
            <div className="search-error">
              请输入有效的汉字
            </div>
          )}
          {searchChar && !searchResult && /[一-龯]/.test(searchChar) && (
            <div className="search-not-found">
              字典中暂未收录此字
            </div>
          )}
        </div>
      </div>

      <div className="reader-content">
        {/* 左侧：课文输入和显示 */}
        <div className="text-input-section">
          <div className="input-label">输入课文：</div>
          <textarea
            className="text-input"
            value={inputText}
            onChange={handleTextChange}
            placeholder="请输入要学习的课文..."
            rows={6}
          />

          <div className="text-display">
            <div
              className="highlighted-text"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
              onClick={handleCharClick}
            />
          </div>
        </div>

        {/* 右侧：生字表和学习卡片 */}
        <div className="sidebar">
          <div className="character-list">
            <h3>📖 生字表</h3>
            <div className="character-grid">
              {getUniqueChars().map((char) => (
                <div
                  key={char}
                  className={`character-item ${studyProgress[char] ? 'learned' : ''}`}
                  onClick={() => setSelectedChar(char)}
                  onDoubleClick={() => toggleCharacterProgress(char)}
                >
                  {char}
                  {studyProgress[char] && <span className="check-mark">✓</span>}
                </div>
              ))}
            </div>
            <p className="progress-hint">单击查看详情，双击标记已掌握</p>
          </div>

          <div className="learning-stats">
            <h3>📊 学习统计</h3>
            <div className="stats-content">
              <p>课文字数：<span className="stat-number">{inputText.length}</span></p>
              <p>生字数量：<span className="stat-number">{getUniqueChars().length}</span></p>
              <p>已掌握：<span className="stat-number">
                {Object.keys(studyProgress).filter(k => studyProgress[k]).length}
              </span></p>
              <p>掌握率：<span className="stat-number">
                {getUniqueChars().length > 0 ?
                  Math.round((Object.keys(studyProgress).filter(k => studyProgress[k]).length / getUniqueChars().length) * 100) :
                  0}%
              </span></p>
              <p>生字占比：<span className="stat-number">
                {inputText.length > 0 ?
                  Math.round((getUniqueChars().length / inputText.length) * 100) :
                  0}%
              </span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 汉字详情卡片弹出层 */}
      {selectedChar && (
        <div className="overlay" onClick={() => setSelectedChar(null)}>
          <CharacterDetailCard
            char={selectedChar}
            onClose={() => setSelectedChar(null)}
          />
        </div>
      )}

      {/* 点击效果 */}
      {clickEffect && clickEffect.visible && (
        <div
          className="click-effect"
          style={{
            left: clickEffect.x,
            top: clickEffect.y,
          }}
        >
          <div className="effect-char">{clickEffect.char}</div>
          <div className="effect-ring"></div>
          <div className="effect-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="particle" style={{'--i': i}}></div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .text-reader-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .reader-header {
          margin-bottom: 30px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .title-section {
          flex: 1;
        }

        .reader-header h1 {
          color: #2b7cff;
          margin-bottom: 10px;
          text-align: left;
        }

        .progress-hint {
          font-size: 12px;
          color: #666;
          text-align: center;
          margin-top: 10px;
          font-style: italic;
        }

        .theme-toggle {
          padding: 10px 20px;
          border: 2px solid #2b7cff;
          border-radius: 25px;
          background: white;
          color: #2b7cff;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
          font-weight: 500;
          white-space: nowrap;
        }

        .theme-toggle:hover {
          background: #2b7cff;
          color: white;
          transform: scale(1.05);
        }

        .theme-toggle:active {
          transform: scale(0.95);
        }

        .reader-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .text-input-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .input-label {
          font-size: 16px;
          color: #333;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .text-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 20px;
          resize: vertical;
          transition: border-color 0.3s;
        }

        .text-input:focus {
          outline: none;
          border-color: #2b7cff;
        }

        .text-display {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          min-height: 100px;
          font-size: 24px;
          line-height: 1.8;
        }

        .highlighted-char {
          color: #2b7cff;
          cursor: pointer;
          padding: 0 2px;
          border-radius: 3px;
          transition: all 0.2s;
        }

        .highlighted-char:hover {
          background-color: #e3f2fd;
          transform: scale(1.1);
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .character-list,
        .learning-stats {
          background: white;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .character-list h3,
        .learning-stats h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .character-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 10px;
        }

        .character-item {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: #f0f4f8;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .character-item {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: #f0f4f8;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .character-item.learned {
          background: #e8f5e9;
          border: 2px solid #4caf50;
        }

        .character-item:hover {
          background: #2b7cff;
          color: white;
          transform: translateY(-2px);
        }

        .character-item.learned:hover {
          background: #4caf50;
        }

        .check-mark {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 12px;
          color: #4caf50;
          font-weight: bold;
        }

        .stats-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stats-content p {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-number {
          font-weight: bold;
          color: #2b7cff;
          font-size: 18px;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .character-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          cursor: pointer;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .character-display {
          font-size: 72px;
          color: #2b7cff;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f0f0f0;
          color: #666;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e0e0e0;
          color: #333;
        }

        .pinyin-section,
        .meaning-section,
        .strokes-section,
        .examples-section {
          margin-bottom: 20px;
        }

        .pinyin-label,
        .meaning-label,
        .examples-label {
          font-weight: bold;
          color: #666;
          margin-right: 10px;
        }

        .pinyin-text {
          color: #2b7cff;
          font-size: 18px;
        }

        .meaning-text {
          color: #333;
        }

        .strokes-title {
          margin-bottom: 10px;
          color: #666;
        }

        .examples-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
        }

        .example-word {
          background: #f0f4f8;
          padding: 6px 12px;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
          transition: all 0.2s;
        }

        .example-word:hover {
          background: #e3f2fd;
        }

        .card-hint {
          text-align: center;
          color: #999;
          font-size: 14px;
          margin-top: 15px;
        }

        .search-section {
          margin-top: 25px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 10px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2b7cff;
        }

        .search-btn, .clear-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-btn {
          background: #2b7cff;
          color: white;
        }

        .search-btn:hover {
          background: #1a5eff;
        }

        .clear-btn {
          background: #f0f0f0;
          color: #666;
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-btn:hover {
          background: #e0e0e0;
        }

        .clear-btn:active,
        .search-btn:active {
          transform: scale(0.95);
        }

        /* 输入框聚焦动画 */
        .text-input:focus,
        .search-input:focus {
          animation: inputGlow 0.3s ease-out;
        }

        @keyframes inputGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(43, 124, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(43, 124, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(43, 124, 255, 0);
          }
        }

        .search-result {
          color: #4caf50;
          font-weight: bold;
          margin-left: 10px;
        }

        .search-error {
          color: #f44336;
          font-size: 14px;
          margin-left: 10px;
        }

        .search-not-found {
          color: #ff9800;
          font-size: 14px;
          margin-left: 10px;
        }

        /* 夜间模式样式 */
        .dark-mode {
          background: #1a1a1a;
          color: #e0e0e0;
        }

        .dark-mode .text-reader-container {
          background: #0d0d0d;
        }

        .dark-mode .text-input-section,
        .dark-mode .character-list,
        .dark-mode .learning-stats,
        .dark-mode .search-section {
          background: #1e1e1e;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .dark-mode .text-input {
          background: #2a2a2a;
          border-color: #444;
          color: #e0e0e0;
        }

        .dark-mode .text-input:focus {
          border-color: #4a9eff;
        }

        .dark-mode .text-display {
          background: #1a1a1a;
          color: #e0e0e0;
        }

        .dark-mode .highlighted-char {
          color: #4a9eff;
        }

        .dark-mode .highlighted-char:hover {
          background-color: #2a2a2a;
        }

        .dark-mode .character-item {
          background: #2a2a2a;
          color: #e0e0e0;
        }

        .dark-mode .character-item.learned {
          background: #1b3b1b;
          border-color: #66bb6a;
        }

        .dark-mode .character-item:hover {
          background: #4a9eff;
        }

        .dark-mode .character-item.learned:hover {
          background: #66bb6a;
        }

        .dark-mode .stat-number {
          color: #4a9eff;
        }

        .dark-mode .theme-toggle {
          background: #2a2a2a;
          border-color: #4a9eff;
          color: #4a9eff;
        }

        .dark-mode .theme-toggle:hover {
          background: #4a9eff;
          color: white;
        }

        .dark-mode .search-input {
          background: #2a2a2a;
          border-color: #444;
          color: #e0e0e0;
        }

        .dark-mode .search-input:focus {
          border-color: #4a9eff;
        }

        .dark-mode .example-word {
          background: #2a2a2a;
          color: #e0e0e0;
        }

        .dark-mode .example-word:hover {
          background: #2a2a2a;
        }

        /* 点击效果样式 */
        .click-effect {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
        }

        .effect-char {
          font-size: 48px;
          color: #2b7cff;
          font-weight: bold;
          animation: charFloat 1s ease-out forwards;
          text-shadow: 0 0 20px rgba(43, 124, 255, 0.5);
        }

        .effect-ring {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 3px solid #2b7cff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: ringExpand 1s ease-out forwards;
        }

        .effect-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #2b7cff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: particleFly 1s ease-out forwards;
        }

        @keyframes charFloat {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -70%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -90%) scale(1);
          }
        }

        @keyframes ringExpand {
          0% {
            width: 20px;
            height: 20px;
            opacity: 1;
          }
          100% {
            width: 80px;
            height: 80px;
            opacity: 0;
          }
        }

        @keyframes particleFly {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(-50% + 40px * cos(var(--i) * 45deg)),
              calc(-50% + 40px * sin(var(--i) * 45deg))
            );
          }
        }

        @media (max-width: 768px) {
          .text-reader-container {
            padding: 15px;
          }

          .header-content {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .reader-header h1 {
            text-align: center;
          }

          .reader-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .text-input-section,
          .character-list,
          .learning-stats {
            padding: 20px;
          }

          .text-input {
            margin-bottom: 15px;
          }

          .text-display {
            padding: 20px;
            font-size: 20px;
            line-height: 1.6;
          }

          .character-grid {
            grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
            gap: 8px;
          }

          .character-item {
            font-size: 22px;
            padding: 10px;
          }

          .example-word {
            font-size: 12px;
            padding: 4px 8px;
          }

          .search-section {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }

          .search-input {
            width: 100%;
          }

          .search-btn, .clear-btn {
            width: 100%;
            justify-content: center;
          }

          .character-display {
            font-size: 60px;
          }

          .card-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .stats-content p {
            font-size: 14px;
          }

          .stat-number {
            font-size: 16px;
          }

          /* 移动端触摸优化 */
          .highlighted-char,
          .character-item,
          .theme-toggle,
          .search-btn,
          .clear-btn {
            -webkit-tap-highlight-color: rgba(43, 124, 255, 0.3);
            touch-action: manipulation;
          }

          .highlighted-char:active,
          .character-item:active,
          .theme-toggle:active,
          .search-btn:active,
          .clear-btn:active {
            transform: scale(0.95);
          }
        }

        @media (max-width: 480px) {
          .text-reader-container {
            padding: 10px;
          }

          .text-input-section,
          .character-list,
          .learning-stats,
          .search-section {
            padding: 15px;
          }

          .text-display {
            font-size: 18px;
            padding: 15px;
          }

          .character-grid {
            grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          }

          .character-item {
            font-size: 20px;
          }

          .effect-char {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
}