import React, { useState, useEffect, useRef } from "react";
import HanziStroke from "./HanziStroke";

/* =======================
   汉字词典数据
======================= */
const DICTIONARY = {
  "学": {
    pinyin: "xué",
    meaning: "1. 学习，模仿 2. 学问，知识 3. 学校",
    strokes: "点、点、撇、点、横撇/横钩、横、横、竖",
    examples: ["学生", "学校", "学习", "数学", "化学"],
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "京": {
    pinyin: "jīng",
    meaning: "1. 国都，首都 2. 大 3. 古代数目名",
    strokes: "点、横、竖、横折、横、横、竖、横折、横、横",
    examples: ["北京", "京剧", "京城", "京沪"],
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "剧": {
    pinyin: "jù",
    meaning: "1. 戏剧，文艺的一种形式 2. 夸大，猛烈",
    strokes: "横、撇、横、竖、竖、横折、横、横、撇、横撇/横钩、捺",
    examples: ["京剧", "戏剧", "剧本", "剧毒"],
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "很": {
    pinyin: "hěn",
    meaning: "1. 表示程度深 2. 非常，十分",
    strokes: "撇、撇、横、竖、点、点、点、点",
    examples: ["很好", "很多", "很大", "很快"],
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "好": {
    pinyin: "hǎo",
    meaning: "1. 优点多，使人满意 2. 友爱，和睦 3. 易，便于",
    strokes: "撇、撇、横、横、竖、横",
    examples: ["好人", "好事", "好学", "好看"],
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "看": {
    pinyin: "kàn",
    meaning: "1. 使视线接触到人或物 2. 观察，判断 3. 认为，以为",
    strokes: "撇、横、横、撇、横、横、竖、横折、横",
    examples: ["看书", "看见", "看戏", "看台"],
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "跟": {
    pinyin: "gēn",
    meaning: "1. 脚的后部 2. 在后面紧接着向同一方向行动 3. 和，同",
    strokes: "足字旁、艮（横、竖、横、撇、捺）",
    examples: ["跟车", "跟从", "跟随", "跟上"],
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "老": {
    pinyin: "lǎo",
    meaning: "1. 年纪大，时间长 2. 陈旧 3. 原来的",
    strokes: "横、竖、横、撇、横撇/横钩、竖、横折、横",
    examples: ["老师", "老人", "老大", "老张"],
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "师": {
    pinyin: "shī",
    meaning: "1. 教人的人 2. 榜样 3. 擅长某种技术的人",
    strokes: "竖、撇、点、横、撇、横、竖、横折、横",
    examples: ["老师", "师父", "教师", "师范"],
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "唱": {
    pinyin: "chàng",
    meaning: "1. 发出声音，依照乐律发出声音 2. 高呼，叫",
    strokes: "口字旁、昌（日、日）",
    examples: ["唱歌", "唱戏", "演唱", "独唱"],
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "戏": {
    pinyin: "xì",
    meaning: "1. 玩耍，游戏 2. 嘲笑，开玩笑 3. 戏剧，歌舞等表演",
    strokes: "又、戈",
    examples: ["京剧", "游戏", "戏剧", "戏曲"],
    level: 3,
    category: "扩展字",
    difficulty: "困难"
  }
};

/* =======================
   增强版随文识字阅读器组件
======================= */
export default function TextReaderEnhanced() {
  // 状态管理
  const [inputText, setInputText] = useState("我学京剧。京剧很好看。我跟老师学唱戏。");
  const [highlightedText, setHighlightedText] = useState("");
  const [selectedChar, setSelectedChar] = useState(null);
  const [searchChar, setSearchChar] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [studyProgress, setStudyProgress] = useState({});
  const [activeView, setActiveView] = useState('reader'); // reader, practice, stats, settings
  const [practiceMode, setPracticeMode] = useState('quiz'); // quiz, write, listen
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState([]);

  // 引用
  const textInputRef = useRef(null);
  // const audioRef = useRef(null); // eslint-disable-line no-unused-vars

  // 初始化
  useEffect(() => {
    highlightCharacters(inputText);
  }, []);

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

  // 按难度分组生字
  const getCharsByLevel = () => {
    const levels = { 1: [], 2: [], 3: [] };
    getUniqueChars().forEach(char => {
      if (DICTIONARY[char]) {
        levels[DICTIONARY[char].level].push(char);
      }
    });
    return levels;
  };

  // 开始练习
  const startPractice = (mode) => {
    setPracticeMode(mode);
    setScore(0);
    setPracticeHistory([]);
    generateQuestion(mode);
    setActiveView('practice');
  };

  // 生成练习题目
  const generateQuestion = (mode) => {
    const chars = getUniqueChars();
    if (chars.length === 0) return;

    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    setCurrentQuestion({ char: randomChar, mode });
    setUserAnswer("");
  };

  // 提交答案
  const submitAnswer = () => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer === currentQuestion.char;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const newRecord = {
      char: currentQuestion.char,
      userAnswer: userAnswer,
      isCorrect: isCorrect,
      timestamp: new Date().toLocaleString()
    };

    setPracticeHistory(prev => [newRecord, ...prev.slice(0, 9)]);
    generateQuestion(practiceMode);
  };

  // 播放汉字读音
  const playCharacterSound = (char) => {
    const u = new SpeechSynthesisUtterance(char);
    u.lang = "zh-CN";
    speechSynthesis.speak(u);
  };

  // 导出学习数据
  const exportData = () => {
    const data = {
      studyProgress,
      practiceHistory,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `识字学习数据_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`text-reader-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* 导航栏 */}
      <nav className="main-nav">
        <div className="nav-brand">
          <h1>📚 随文识字</h1>
          <p className="nav-subtitle">智能汉字学习平台</p>
        </div>
        <div className="nav-actions">
          <button
            className={`nav-btn ${activeView === 'reader' ? 'active' : ''}`}
            onClick={() => setActiveView('reader')}
          >
            📖 阅读
          </button>
          <button
            className={`nav-btn ${activeView === 'practice' ? 'active' : ''}`}
            onClick={() => startPractice('quiz')}
          >
            🎯 练习
          </button>
          <button
            className={`nav-btn ${activeView === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveView('stats')}
          >
            📊 统计
          </button>
          <button
            className={`nav-btn ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            ⚙️ 设置
          </button>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ 日间模式' : '🌙 夜间模式'}
          </button>
        </div>
      </nav>

      {/* 搜索栏 */}
      {activeView === 'reader' && (
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
      )}

      {/* 主内容区 */}
      <div className="main-content">
        {/* 阅读视图 */}
        {activeView === 'reader' && (
          <div className="content-area">
            <div className="text-section">
              <div className="section-header">
                <h2>📝 课文阅读</h2>
                <button className="btn-secondary" onClick={() => setInputText("")}>
                  清空
                </button>
              </div>
              <div className="input-label">输入课文：</div>
              <textarea
                ref={textInputRef}
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
              {/* 生字表 */}
              <div className="panel">
                <div className="panel-header">
                  <h3>📖 生字表</h3>
                  <div className="level-tabs">
                    <button className="level-tab active" data-level="1">初级</button>
                    <button className="level-tab" data-level="2">中级</button>
                    <button className="level-tab" data-level="3">高级</button>
                  </div>
                </div>
                <div className="character-grid">
                  {getCharsByLevel()[1].map((char) => (
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
                <div className="panel-footer">
                  <p className="progress-hint">单击查看详情，双击标记已掌握</p>
                  <div className="quick-practice">
                    <button
                      className="btn-practice"
                      onClick={() => startPractice('quiz')}
                    >
                      🎯 快速练习
                    </button>
                    <button
                      className="btn-practice"
                      onClick={() => startPractice('write')}
                    >
                      ✍️ 书写练习
                    </button>
                  </div>
                </div>
              </div>

              {/* 学习统计 */}
              <div className="panel stats-section">
                <h3>📊 学习统计</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">课文字数</span>
                    <span className="stat-number">{inputText.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">生字数量</span>
                    <span className="stat-number">{getUniqueChars().length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">已掌握</span>
                    <span className="stat-number">
                      {Object.keys(studyProgress).filter(k => studyProgress[k]).length}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">掌握率</span>
                    <span className="stat-number">
                      {getUniqueChars().length > 0
                        ? Math.round(Object.keys(studyProgress).filter(k => studyProgress[k]).length / getUniqueChars().length * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 练习视图 */}
        {activeView === 'practice' && (
          <div className="practice-container">
            <div className="practice-header">
              <h2>🎯 {practiceMode === 'quiz' ? '选择题练习' : practiceMode === 'write' ? '书写练习' : '听力练习'}</h2>
              <div className="score-display">
                得分: <span className="score-number">{score}</span>
              </div>
            </div>

            <div className="practice-content">
              {currentQuestion ? (
                <div className="practice-card">
                  <div className="question-section">
                    {practiceMode === 'quiz' && (
                      <>
                        <div className="question-char">{currentQuestion.char}</div>
                        <p>请选择正确的汉字：</p>
                        <div className="options-grid">
                          {getUniqueChars()
                            .filter((_, i) => i < 4)
                            .map((char) => (
                              <button
                                key={char}
                                className="option-btn"
                                onClick={() => setUserAnswer(char)}
                              >
                                {char}
                              </button>
                            ))}
                        </div>
                      </>
                    )}

                    {practiceMode === 'write' && (
                      <>
                        <div className="question-char">{currentQuestion.char}</div>
                        <p>请输入这个字的拼音：</p>
                        <input
                          type="text"
                          className="answer-input"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="输入拼音..."
                        />
                        <div className="pronunciation">
                          发音：{DICTIONARY[currentQuestion.char]?.pinyin}
                        </div>
                      </>
                    )}

                    {practiceMode === 'listen' && (
                      <>
                        <div className="question-hint">🔊 听读音，选出对应的汉字</div>
                        <button
                          className="play-sound-btn"
                          onClick={() => playCharacterSound(currentQuestion.char)}
                        >
                          🔊 播放读音
                        </button>
                        <div className="options-grid">
                          {getUniqueChars()
                            .filter((_, i) => i < 4)
                            .map((char) => (
                              <button
                                key={char}
                                className="option-btn"
                                onClick={() => setUserAnswer(char)}
                              >
                                {char}
                              </button>
                            ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="practice-actions">
                    <button
                      className="btn-submit"
                      onClick={submitAnswer}
                      disabled={!userAnswer}
                    >
                      提交答案
                    </button>
                    <button
                      className="btn-skip"
                      onClick={() => generateQuestion(practiceMode)}
                    >
                      跳过
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-questions">
                  <p>课文中没有生字，请先输入包含生字的课文</p>
                  <button
                    className="btn-back"
                    onClick={() => setActiveView('reader')}
                  >
                    返回阅读
                  </button>
                </div>
              )}
            </div>

            {/* 练习历史 */}
            {practiceHistory.length > 0 && (
              <div className="practice-history">
                <h3>最近练习</h3>
                <div className="history-list">
                  {practiceHistory.map((record, index) => (
                    <div
                      key={index}
                      className={`history-item ${record.isCorrect ? 'correct' : 'incorrect'}`}
                    >
                      <span className="history-char">{record.char}</span>
                      <span className="history-result">
                        {record.isCorrect ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 统计视图 */}
        {activeView === 'stats' && (
          <div className="stats-container">
            <div className="stats-grid-full">
              <div className="stat-card">
                <h3>📚 学习总览</h3>
                <div className="stat-item">
                  <span className="stat-label">总学习字数</span>
                  <span className="stat-number">{Object.keys(DICTIONARY).length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">已掌握字数</span>
                  <span className="stat-number">
                    {Object.keys(studyProgress).filter(k => studyProgress[k]).length}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Object.keys(DICTIONARY).length > 0
                        ? Object.keys(studyProgress).filter(k => studyProgress[k]).length / Object.keys(DICTIONARY).length * 100
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="stat-card">
                <h3>🎯 练习统计</h3>
                <div className="stat-item">
                  <span className="stat-label">总练习次数</span>
                  <span className="stat-number">{practiceHistory.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">正确率</span>
                  <span className="stat-number">
                    {practiceHistory.length > 0
                      ? Math.round(practiceHistory.filter(r => r.isCorrect).length / practiceHistory.length * 100)
                      : 0}%
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <h3>📊 难度分布</h3>
                <div className="difficulty-stats">
                  <div className="difficulty-item">
                    <span>简单 (1级)</span>
                    <span>{getCharsByLevel()[1].length} 字</span>
                  </div>
                  <div className="difficulty-item">
                    <span>中等 (2级)</span>
                    <span>{getCharsByLevel()[2].length} 字</span>
                  </div>
                  <div className="difficulty-item">
                    <span>困难 (3级)</span>
                    <span>{getCharsByLevel()[3].length} 字</span>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <h3>🏆 学习成就</h3>
                <div className="achievements">
                  {Object.keys(studyProgress).filter(k => studyProgress[k]).length >= 5 && (
                    <div className="achievement">
                      <span>🌟 初学者</span>
                      <span>掌握5个汉字</span>
                    </div>
                  )}
                  {Object.keys(studyProgress).filter(k => studyProgress[k]).length >= 10 && (
                    <div className="achievement">
                      <span>🚀 进阶者</span>
                      <span>掌握10个汉字</span>
                    </div>
                  )}
                  {practiceHistory.filter(r => r.isCorrect).length >= 20 && (
                    <div className="achievement">
                      <span>💪 练习达人</span>
                      <span>答对20题</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 设置视图 */}
        {activeView === 'settings' && (
          <div className="settings-container">
            <div className="settings-section">
              <h3>🎨 界面设置</h3>
              <div className="setting-item">
                <label>字体大小</label>
                <select className="setting-select">
                  <option>小</option>
                  <option selected>中</option>
                  <option>大</option>
                </select>
              </div>
              <div className="setting-item">
                <label>自动播放读音</label>
                <input type="checkbox" className="setting-checkbox" />
              </div>
              <div className="setting-item">
                <label>显示笔顺动画</label>
                <input type="checkbox" className="setting-checkbox" defaultChecked />
              </div>
            </div>

            <div className="settings-section">
              <h3>📤 数据管理</h3>
              <button className="btn-primary" onClick={exportData}>
                导出学习数据
              </button>
              <button className="btn-secondary">
                清空学习进度
              </button>
            </div>

            <div className="settings-section">
              <h3>📚 教材管理</h3>
              <div className="text-area">
                <label>预设课文</label>
                <textarea
                  className="text-input"
                  placeholder="输入预设课文..."
                  rows={4}
                />
                <button className="btn-secondary">保存</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 汉字详情卡片 */}
      {selectedChar && (
        <div className="overlay" onClick={() => setSelectedChar(null)}>
          <div className="character-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div className="character-display">{selectedChar}</div>
              <div className="card-actions">
                <button
                  className="action-btn"
                  onClick={() => playCharacterSound(selectedChar)}
                  title="播放读音"
                >
                  🔊
                </button>
                <button
                  className="action-btn"
                  onClick={() => toggleCharacterProgress(selectedChar)}
                  title={studyProgress[selectedChar] ? "标记为未掌握" : "标记为已掌握"}
                >
                  {studyProgress[selectedChar] ? "✓" : "+"}
                </button>
                <button className="close-btn" onClick={() => setSelectedChar(null)}>
                  ×
                </button>
              </div>
            </div>

            {DICTIONARY[selectedChar] && (
              <>
                <div className="character-info">
                  <div className="info-row">
                    <span className="info-label">拼音：</span>
                    <span className="pinyin">{DICTIONARY[selectedChar].pinyin}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">难度：</span>
                    <span className="difficulty">{DICTIONARY[selectedChar].difficulty}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">类别：</span>
                    <span className="category">{DICTIONARY[selectedChar].category}</span>
                  </div>
                </div>

                <div className="pinyin-section">
                  <span className="section-label">拼音：</span>
                  <span className="pinyin">{DICTIONARY[selectedChar].pinyin}</span>
                </div>

                <div className="meaning-section">
                  <span className="section-label">释义：</span>
                  <span className="meaning">{DICTIONARY[selectedChar].meaning}</span>
                </div>

                <div className="strokes-section">
                  <span className="section-label">笔顺：</span>
                  <span className="strokes">{DICTIONARY[selectedChar].strokes}</span>
                </div>

                <div className="examples-section">
                  <span className="section-label">例词：</span>
                  <div className="examples">
                    {DICTIONARY[selectedChar].examples.map((word, index) => (
                      <span key={index} className="example-word">{word}</span>
                    ))}
                  </div>
                </div>

                <div className="stroke-animation">
                  <HanziStroke char={selectedChar} config={{
                    strokeColor: "#FF4444",
                    radicalColor: "#33B5E5",
                    delayBetweenStrokes: 400,
                    strokeAnimationDuration: 500,
                    strokeAnimationSpeed: 1,
                  }} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .text-reader-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .dark-mode {
          background: #1a1a1a;
          color: #e0e0e0;
        }

        /* 导航栏 */
        .main-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .main-nav {
          background: #2a2a2a;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .nav-brand h1 {
          color: #2b7cff;
          margin: 0;
          font-size: 28px;
        }

        .nav-subtitle {
          color: #666;
          font-size: 14px;
          margin: 5px 0 0 0;
        }

        .dark-mode .nav-subtitle {
          color: #bbb;
        }

        .nav-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .nav-btn {
          padding: 10px 20px;
          border: 2px solid transparent;
          border-radius: 8px;
          background: #f0f4f8;
          color: #333;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s;
        }

        .nav-btn:hover {
          background: #e3f2fd;
        }

        .nav-btn.active {
          background: #2b7cff;
          color: white;
          border-color: #2b7cff;
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

        /* 搜索栏 */
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

        /* 主内容区 */
        .main-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        .content-area {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        /* 文本区域 */
        .text-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .text-section {
          background: #2a2a2a;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
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
          display: inline-block;
        }

        .highlighted-char:hover {
          background: #e3f2fd;
          transform: scale(1.1);
        }

        .dark-mode .highlighted-char:hover {
          background: #2a4a8a;
        }

        /* 侧边栏 */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .panel {
          background: #2a2a2a;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panel-header h3 {
          color: #2b7cff;
          margin: 0;
        }

        .dark-mode .panel-header h3 {
          color: #4a9eff;
        }

        .level-tabs {
          display: flex;
          gap: 5px;
        }

        .level-tab {
          padding: 5px 10px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          background: white;
          color: #666;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .level-tab.active {
          background: #2b7cff;
          color: white;
          border-color: #2b7cff;
        }

        .dark-mode .level-tab {
          background: #2a2a2a;
          border-color: #444;
          color: #bbb;
        }

        .dark-mode .level-tab.active {
          background: #4a9eff;
          border-color: #4a9eff;
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
          margin-bottom: 15px;
        }

        .quick-practice {
          display: flex;
          gap: 10px;
        }

        .btn-practice {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #2b7cff;
          border-radius: 8px;
          background: white;
          color: #2b7cff;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-practice:hover {
          background: #2b7cff;
          color: white;
        }

        .dark-mode .btn-practice {
          background: #2a2a2a;
          border-color: #4a9eff;
          color: #4a9eff;
        }

        .dark-mode .btn-practice:hover {
          background: #4a9eff;
          color: white;
        }

        /* 统计区域 */
        .stats-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .stats-section {
          background: #2a2a2a;
        }

        .stats-section h3 {
          color: #2b7cff;
          margin-bottom: 20px;
        }

        .dark-mode .stats-section h3 {
          color: #4a9eff;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .stat-label {
          color: #666;
        }

        .stat-number {
          color: #2b7cff;
          font-weight: bold;
        }

        .dark-mode .stat-number {
          color: #4a9eff;
        }

        /* 按钮样式 */
        .btn-primary, .btn-secondary {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #2b7cff;
          color: white;
        }

        .btn-primary:hover {
          background: #1a5eff;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #666;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        .dark-mode .btn-secondary {
          background: #2a2a2a;
          color: #bbb;
        }

        .dark-mode .btn-secondary:hover {
          background: #333;
        }

        /* 练习区域 */
        .practice-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .practice-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .score-display {
          font-size: 20px;
          margin-top: 10px;
        }

        .score-number {
          color: #2b7cff;
          font-weight: bold;
          font-size: 24px;
        }

        .practice-card {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .dark-mode .practice-card {
          background: #2a2a2a;
        }

        .question-char {
          font-size: 72px;
          font-weight: bold;
          color: #2b7cff;
          margin: 20px 0;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }

        .option-btn {
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          color: #333;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover {
          border-color: #2b7cff;
          background: #e3f2fd;
        }

        .option-btn.selected {
          background: #2b7cff;
          color: white;
          border-color: #2b7cff;
        }

        .dark-mode .option-btn {
          background: #1a1a1a;
          border-color: #444;
          color: #e0e0e0;
        }

        .dark-mode .option-btn:hover {
          background: #2a4a8a;
          border-color: #4a9eff;
        }

        .answer-input {
          width: 200px;
          padding: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 18px;
          text-align: center;
          margin: 20px 0;
        }

        .answer-input:focus {
          outline: none;
          border-color: #2b7cff;
        }

        .dark-mode .answer-input {
          background: #1a1a1a;
          border-color: #444;
          color: #e0e0e0;
        }

        .pronunciation {
          color: #666;
          font-size: 14px;
          margin-top: 10px;
        }

        .dark-mode .pronunciation {
          color: #bbb;
        }

        .play-sound-btn {
          padding: 10px 20px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
          margin: 20px 0;
        }

        .play-sound-btn:hover {
          background: #45a049;
        }

        .practice-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .btn-submit {
          padding: 12px 30px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-submit:hover {
          background: #45a049;
        }

        .btn-submit:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-skip {
          padding: 12px 30px;
          background: #f0f0f0;
          color: #666;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-skip:hover {
          background: #e0e0e0;
        }

        .dark-mode .btn-skip {
          background: #2a2a2a;
          color: #bbb;
        }

        .dark-mode .btn-skip:hover {
          background: #333;
        }

        .no-questions {
          text-align: center;
          padding: 40px;
        }

        .btn-back {
          margin-top: 20px;
          padding: 10px 20px;
          background: #2b7cff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: #1a5eff;
        }

        .practice-history {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 15px;
        }

        .dark-mode .practice-history {
          background: #2a2a2a;
        }

        .practice-history h3 {
          margin-bottom: 15px;
          color: #2b7cff;
        }

        .dark-mode .practice-history h3 {
          color: #4a9eff;
        }

        .history-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .history-item {
          padding: 8px 15px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dark-mode .history-item {
          background: #2a2a2a;
        }

        .history-item.correct {
          border: 2px solid #4caf50;
        }

        .history-item.incorrect {
          border: 2px solid #f44336;
        }

        .history-char {
          font-size: 20px;
          font-weight: bold;
        }

        .history-result {
          font-size: 18px;
        }

        /* 统计页面 */
        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-grid-full {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .stat-card {
          background: #2a2a2a;
        }

        .stat-card h3 {
          color: #2b7cff;
          margin-bottom: 20px;
        }

        .dark-mode .stat-card h3 {
          color: #4a9eff;
        }

        .stat-grid {
          display: grid;
          gap: 15px;
        }

        .progress-bar {
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 10px;
        }

        .progress-fill {
          height: 100%;
          background: #4caf50;
          transition: width 0.3s ease;
        }

        .difficulty-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .difficulty-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #f0f4f8;
          border-radius: 8px;
        }

        .dark-mode .difficulty-item {
          background: #2a2a2a;
        }

        .achievements {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .achievement {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #e8f5e9;
          border-radius: 8px;
        }

        .achievement span:first-child {
          font-size: 20px;
        }

        /* 设置页面 */
        .settings-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode .settings-section {
          background: #2a2a2a;
        }

        .settings-section h3 {
          color: #2b7cff;
          margin-bottom: 20px;
        }

        .dark-mode .settings-section h3 {
          color: #4a9eff;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .setting-item label {
          color: #333;
          font-weight: 500;
        }

        .dark-mode .setting-item label {
          color: #e0e0e0;
        }

        .setting-select, .setting-checkbox {
          cursor: pointer;
        }

        .setting-select {
          padding: 5px 10px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          background: white;
        }

        .dark-mode .setting-select {
          background: #1a1a1a;
          border-color: #444;
          color: #e0e0e0;
        }

        .text-area {
          margin-bottom: 20px;
        }

        .text-area label {
          display: block;
          margin-bottom: 10px;
          color: #333;
          font-weight: 500;
        }

        .dark-mode .text-area label {
          color: #e0e0e0;
        }

        /* 汉字详情卡片 */
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
          border-radius: 15px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          max-height: 90vh;
          overflow-y: auto;
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

        .card-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e0e0e0;
          background: white;
          color: #666;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #e3f2fd;
          border-color: #2b7cff;
        }

        .dark-mode .action-btn {
          background: #2a2a2a;
          border-color: #444;
          color: #bbb;
        }

        .dark-mode .action-btn:hover {
          background: #2a4a8a;
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

        .character-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .dark-mode .character-info {
          background: #1a1a1a;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-weight: bold;
          color: #333;
        }

        .dark-mode .info-label {
          color: #e0e0e0;
        }

        .difficulty {
          color: #ff9800;
        }

        .category {
          color: #4caf50;
        }

        .pinyin-section, .meaning-section, .strokes-section, .examples-section {
          margin-bottom: 20px;
        }

        .section-label {
          font-weight: bold;
          color: #333;
          margin-right: 10px;
        }

        .dark-mode .section-label {
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

        .stroke-animation {
          margin-top: 20px;
          text-align: center;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .main-nav {
            flex-direction: column;
            gap: 15px;
          }

          .nav-actions {
            flex-wrap: wrap;
            justify-content: center;
          }

          .content-area {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid-full {
            grid-template-columns: 1fr;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .character-grid {
            grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .practice-actions {
            flex-direction: column;
          }

          .quick-practice {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}