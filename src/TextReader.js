import React, { useState } from "react";

/* =======================
   汉字词典数据
======================= */
const DICTIONARY = {
  "学": {
    pinyin: "xué",
    meaning: "1. 学习，模仿 2. 学问，知识 3. 学校",
    strokes: "点、点、撇、点、横撇/横钩、横、横、竖",
    examples: ["学生", "学校", "学习", "数学", "化学"]
  },
  "京": {
    pinyin: "jīng",
    meaning: "1. 国都，首都 2. 大 3. 古代数目名",
    strokes: "点、横、竖、横折、横、横、竖、横折、横、横",
    examples: ["北京", "京剧", "京城", "京沪"]
  },
  "剧": {
    pinyin: "jù",
    meaning: "1. 戏剧，文艺的一种形式 2. 夸大，猛烈",
    strokes: "横、撇、横、竖、竖、横折、横、横、撇、横撇/横钩、捺",
    examples: ["京剧", "戏剧", "剧本", "剧毒"]
  },
  "很": {
    pinyin: "hěn",
    meaning: "1. 表示程度深 2. 非常，十分",
    strokes: "撇、撇、横、竖、点、点、点、点",
    examples: ["很好", "很多", "很大", "很快"]
  },
  "好": {
    pinyin: "hǎo",
    meaning: "1. 优点多，使人满意 2. 友爱，和睦 3. 易，便于",
    strokes: "撇、撇、横、横、竖、横",
    examples: ["好人", "好事", "好学", "好看"]
  },
  "看": {
    pinyin: "kàn",
    meaning: "1. 使视线接触到人或物 2. 观察，判断 3. 认为，以为",
    strokes: "撇、横、横、撇、横、横、竖、横折、横",
    examples: ["看书", "看见", "看戏", "看台"]
  },
  "跟": {
    pinyin: "gēn",
    meaning: "1. 脚的后部 2. 在后面紧接着向同一方向行动 3. 和，同",
    strokes: "足字旁、艮（横、竖、横、撇、捺）",
    examples: ["跟车", "跟从", "跟随", "跟上"]
  },
  "老": {
    pinyin: "lǎo",
    meaning: "1. 年纪大，时间长 2. 陈旧 3. 原来的",
    strokes: "横、竖、横、撇、横撇/横钩、竖、横折、横",
    examples: ["老师", "老人", "老大", "老张"]
  },
  "师": {
    pinyin: "shī",
    meaning: "1. 教人的人 2. 榜样 3. 擅长某种技术的人",
    strokes: "竖、撇、点、横、撇、横、竖、横折、横",
    examples: ["老师", "师父", "教师", "师范"]
  },
  "唱": {
    pinyin: "chàng",
    meaning: "1. 发出声音，依照乐律发出声音 2. 高呼，叫",
    strokes: "口字旁、昌（日、日）",
    examples: ["唱歌", "唱戏", "演唱", "独唱"]
  },
  "戏": {
    pinyin: "xì",
    meaning: "1. 玩耍，游戏 2. 嘲笑，开玩笑 3. 戏剧，歌舞等表演",
    strokes: "又、戈",
    examples: ["京剧", "游戏", "戏剧", "戏曲"]
  }
};

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

  // 高亮显示课文中的生字
  const highlightCharacters = (text) => {
    let highlighted = "";
    for (let char of text) {
      if (DICTIONARY[char]) {
        highlighted += `<span class="highlighted-char" data-char="${char}">${char}</span>`;
      } else {
        highlighted += char;
      }
    }
    setHighlightedText(highlighted);
  };

  // 处理文本输入
  const handleTextChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    highlightCharacters(text);
  };

  // 处理汉字点击
  const handleCharClick = (e) => {
    if (e.target.classList.contains('highlighted-char')) {
      const char = e.target.getAttribute('data-char');
      setSelectedChar(char);

      // 播放发音
      const u = new SpeechSynthesisUtterance(char);
      u.lang = "zh-CN";
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
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

  // 切换学习进度
  const toggleCharacterProgress = (char) => {
    setStudyProgress(prev => ({
      ...prev,
      [char]: !prev[char]
    }));
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
      <div className="header">
        <h1>📚 随文识字</h1>
        <p>在课文中点击生字，查看拼音、释义和笔顺</p>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
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
      </div>

      <div className="main-content">
        <div className="text-section">
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

          <div className="stats-section">
            <h3>📊 学习统计</h3>
            <p>课文字数：<span className="stat-number">{inputText.length}</span></p>
            <p>生字数量：<span className="stat-number">{getUniqueChars().length}</span></p>
            <p>已掌握：<span className="stat-number">
              {Object.keys(studyProgress).filter(k => studyProgress[k]).length}
            </span></p>
          </div>
        </div>
      </div>

      {/* 汉字详情卡片 */}
      {selectedChar && (
        <div className="overlay" onClick={() => setSelectedChar(null)}>
          <div className="character-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div className="character-display">{selectedChar}</div>
              <button className="close-btn" onClick={() => setSelectedChar(null)}>
                ×
              </button>
            </div>

            {DICTIONARY[selectedChar] && (
              <>
                <div className="pinyin-section">
                  <span className="pinyin-label">拼音：</span>
                  <span className="pinyin">{DICTIONARY[selectedChar].pinyin}</span>
                </div>

                <div className="meaning-section">
                  <span className="meaning-label">释义：</span>
                  <span className="meaning">{DICTIONARY[selectedChar].meaning}</span>
                </div>

                <div className="strokes-section">
                  <span className="strokes-label">笔顺：</span>
                  <span className="strokes">{DICTIONARY[selectedChar].strokes}</span>
                </div>

                <div className="examples-section">
                  <span className="examples-label">例词：</span>
                  <div className="examples">
                    {DICTIONARY[selectedChar].examples.map((word, index) => (
                      <span key={index} className="example-word">{word}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
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

        .dark-mode {
          background: #1a1a1a;
          color: #e0e0e0;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          color: #2b7cff;
          margin-bottom: 10px;
        }

        .dark-mode .header h1 {
          color: #4a9eff;
        }

        .theme-toggle {
          padding: 10px 20px;
          border: 2px solid #2b7cff;
          border-radius: 25px;
          background: white;
          color: #2b7cff;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
          transition: all 0.3s;
        }

        .theme-toggle:hover {
          background: #2b7cff;
          color: white;
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

        .search-section {
          background: white;
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .search-section {
          background: #2a2a2a;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .search-input {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
        }

        .search-input:focus {
          outline: none;
          border-color: #2b7cff;
        }

        .dark-mode .search-input {
          background: #1a1a1a;
          border-color: #444;
          color: #e0e0e0;
        }

        .search-btn, .clear-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
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
        }

        .clear-btn:hover {
          background: #e0e0e0;
        }

        .search-result {
          color: #4caf50;
          font-weight: bold;
          margin-left: auto;
        }

        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .text-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .text-section {
          background: #2a2a2a;
        }

        .input-label {
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .dark-mode .input-label {
          color: #e0e0e0;
        }

        .text-input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 16px;
          resize: vertical;
          margin-bottom: 20px;
        }

        .text-input:focus {
          outline: none;
          border-color: #2b7cff;
        }

        .dark-mode .text-input {
          background: #1a1a1a;
          border-color: #444;
          color: #e0e0e0;
        }

        .text-display {
          background: #f8f9fa;
          border-radius: 10px;
          padding: 30px;
          font-size: 24px;
          line-height: 1.8;
          min-height: 200px;
        }

        .dark-mode .text-display {
          background: #1a1a1a;
          color: #e0e0e0;
        }

        .highlighted-char {
          color: #2b7cff;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .highlighted-char:hover {
          background: #e3f2fd;
          transform: scale(1.1);
        }

        .dark-mode .highlighted-char:hover {
          background: #2a4a8a;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .character-list, .stats-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .character-list, .dark-mode .stats-section {
          background: #2a2a2a;
        }

        .character-list h3, .stats-section h3 {
          color: #2b7cff;
          margin-bottom: 20px;
        }

        .dark-mode .character-list h3, .dark-mode .stats-section h3 {
          color: #4a9eff;
        }

        .character-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
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

        .progress-hint {
          font-size: 12px;
          color: #666;
          text-align: center;
          font-style: italic;
        }

        .stats-section p {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .stat-number {
          color: #2b7cff;
          font-weight: bold;
        }

        .dark-mode .stat-number {
          color: #4a9eff;
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
        }

        .character-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          max-width: 500px;
          margin: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .character-card {
          background: #2a2a2a;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .character-display {
          font-size: 72px;
          font-weight: bold;
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
        }

        .close-btn:hover {
          background: #e0e0e0;
          color: #333;
        }

        .dark-mode .close-btn {
          background: #333;
          color: #bbb;
        }

        .dark-mode .close-btn:hover {
          background: #444;
          color: #fff;
        }

        .pinyin-section, .meaning-section, .strokes-section, .examples-section {
          margin-bottom: 20px;
        }

        .pinyin-label, .meaning-label, .strokes-label, .examples-label {
          font-weight: bold;
          color: #333;
          margin-right: 10px;
        }

        .dark-mode .pinyin-label, .dark-mode .meaning-label,
        .dark-mode .strokes-label, .dark-mode .examples-label {
          color: #e0e0e0;
        }

        .pinyin {
          color: #2b7cff;
          font-weight: 500;
        }

        .dark-mode .pinyin {
          color: #4a9eff;
        }

        .meaning {
          color: #666;
          line-height: 1.6;
        }

        .dark-mode .meaning {
          color: #bbb;
        }

        .strokes {
          color: #ff9800;
          font-size: 14px;
        }

        .dark-mode .strokes {
          color: #ffa726;
        }

        .examples {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .example-word {
          background: #f0f4f8;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          color: #666;
          transition: all 0.2s;
        }

        .example-word:hover {
          background: #e3f2fd;
          transform: scale(1.05);
        }

        .dark-mode .example-word {
          background: #2a2a2a;
          color: #bbb;
        }

        .dark-mode .example-word:hover {
          background: #2a4a8a;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .character-grid {
            grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}