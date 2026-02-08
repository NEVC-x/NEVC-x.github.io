import React, { useState, useEffect, useRef } from "react";
import HanziStroke from "./HanziStroke";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";

/* =======================
   汉字词典数据
======================= */
const DICTIONARY = {
  "学": {
    pinyin: "xué",
    meaning: "1. 学习，模仿 2. 学问，知识 3. 学校",
    strokes: "点、点、撇、点、横撇/横钩、横、横、竖",
    radical: "子",
    strokeCount: 8,
    structure: "上下",
    examples: ["学生", "学校", "学习"],
    sentence: "我在学校里学习知识。",
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "京": {
    pinyin: "jīng",
    meaning: "1. 国都，首都 2. 大 3. 古代数目名",
    strokes: "点、横、竖、横折、横、横、竖、横折、横、横",
    radical: "亠",
    strokeCount: 10,
    structure: "上中下",
    examples: ["北京", "京剧", "京城"],
    sentence: "北京是中国的首都。",
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "剧": {
    pinyin: "jù",
    meaning: "1. 戏剧，文艺的一种形式 2. 夸大，猛烈",
    strokes: "横、撇、横、竖、竖、横折、横、横、撇、横撇/横钩、捺",
    radical: "刂",
    strokeCount: 11,
    structure: "左右",
    examples: ["京剧", "戏剧", "剧本"],
    sentence: "我们一起去看京剧。",
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "很": {
    pinyin: "hěn",
    meaning: "1. 表示程度深 2. 非常，十分",
    strokes: "撇、撇、横、竖、点、点、点、点",
    radical: "彳",
    strokeCount: 8,
    structure: "左右",
    examples: ["很好", "很多", "很大"],
    sentence: "今天的天气很好。",
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "好": {
    pinyin: "hǎo",
    meaning: "1. 优点多，使人满意 2. 友爱，和睦 3. 易，便于",
    strokes: "撇、撇、横、横、竖、横",
    radical: "女",
    strokeCount: 6,
    structure: "左右",
    examples: ["好人", "好事", "好看"],
    sentence: "他是一个好人。",
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "看": {
    pinyin: "kàn",
    meaning: "1. 使视线接触到人或物 2. 观察，判断 3. 认为，以为",
    strokes: "撇、横、横、撇、横、横、竖、横折、横",
    radical: "目",
    strokeCount: 9,
    structure: "半包围",
    examples: ["看书", "看见", "看戏"],
    sentence: "我喜欢看书。",
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "跟": {
    pinyin: "gēn",
    meaning: "1. 脚的后部 2. 在后面紧接着向同一方向行动 3. 和，同",
    strokes: "竖、横折、横、竖、横、竖、提、横、竖、横撇/横钩、捺",
    radical: "足",
    strokeCount: 13,
    structure: "左右",
    examples: ["跟从", "跟随", "跟上"],
    sentence: "我跟老师学习。",
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "老": {
    pinyin: "lǎo",
    meaning: "1. 年纪大，时间长 2. 陈旧 3. 原来的",
    strokes: "横、竖、横、撇、横撇/横钩、竖、横折、横",
    radical: "耂",
    strokeCount: 6,
    structure: "上下",
    examples: ["老师", "老人", "老大"],
    sentence: "老师教我们知识。",
    level: 1,
    category: "基础汉字",
    difficulty: "简单"
  },
  "师": {
    pinyin: "shī",
    meaning: "1. 教人的人 2. 榜样 3. 擅长某种技术的人",
    strokes: "竖、撇、点、横、撇、横、竖、横折、横",
    radical: "巾",
    strokeCount: 6,
    structure: "左右",
    examples: ["老师", "师父", "教师"],
    sentence: "我的老师很和蔼。",
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "唱": {
    pinyin: "chàng",
    meaning: "1. 发出声音，依照乐律发出声音 2. 高呼，叫",
    strokes: "竖、横折、横、竖、横折、横、横、竖、横折、横、竖钩",
    radical: "口",
    strokeCount: 11,
    structure: "左右",
    examples: ["唱歌", "唱戏", "演唱"],
    sentence: "我喜欢唱歌。",
    level: 2,
    category: "常用字",
    difficulty: "中等"
  },
  "戏": {
    pinyin: "xì",
    meaning: "1. 玩耍，游戏 2. 嘲笑，开玩笑 3. 戏剧，歌舞等表演",
    strokes: "横撇/横钩、点、横、斜钩、撇、点",
    radical: "戈",
    strokeCount: 6,
    structure: "左右",
    examples: ["京剧", "游戏", "戏剧"],
    sentence: "京剧是中国的传统艺术。",
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
  const [activeView, setActiveView] = useState('reader'); // reader, practice, stats, settings, vocabBook
  const [practiceMode, setPracticeMode] = useState('quiz'); // quiz, write, listen
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [charPopup, setCharPopup] = useState(null);
  const [fontSize, setFontSize] = useState('中'); // 小, 中, 大
  const [fontSizeValue, setFontSizeValue] = useState(24); // 字体大小数值，默认24px
  const [eyeProtectionMode, setEyeProtectionMode] = useState(false); // 护眼模式
  const [appVersion, setAppVersion] = useState('学生版'); // 学生版, 教师版, 家长版
  const [showLoginModal, setShowLoginModal] = useState(false); // 登录窗口显示状态
  const [loginUsername, setLoginUsername] = useState(''); // 登录账号
  const [loginPassword, setLoginPassword] = useState(''); // 登录密码
  const [loginMessage, setLoginMessage] = useState(''); // 登录提示信息
  const [targetVersion, setTargetVersion] = useState(''); // 目标版本
  
  // 三端独立状态管理
  const [versionData, setVersionData] = useState({
    '学生版': {
      vocabBook: [], // 学生版生词库
      studyProgress: {}, // 学生版学习进度
      practiceHistory: [], // 学生版练习历史
      settings: {
        fontSize: '中',
        fontSizeValue: 24,
        darkMode: false,
        eyeProtectionMode: false
      }
    },
    '教师版': {
      vocabBook: [], // 教师版生词库
      studyProgress: {}, // 教师版学习进度
      practiceHistory: [], // 教师版练习历史
      settings: {
        fontSize: '中',
        fontSizeValue: 24,
        darkMode: false,
        eyeProtectionMode: false
      },
      classes: [], // 教师版班级管理
      students: [] // 教师版学生管理
    },
    '家长版': {
      vocabBook: [], // 家长版生词库
      studyProgress: {}, // 家长版学习进度
      practiceHistory: [], // 家长版练习历史
      settings: {
        fontSize: '中',
        fontSizeValue: 24,
        darkMode: false,
        eyeProtectionMode: false
      },
      children: [] // 家长版孩子管理
    }
  });
  
  // 当前版本数据
  const [currentVersionData, setCurrentVersionData] = useState(versionData['学生版']);
  
  // 共享数据（未来用于三端联系）
  const [sharedData, setSharedData] = useState({
    connections: [], // 三端连接关系
    sharedVocab: [], // 共享生词库
    sharedPractice: [] // 共享练习
  });
  
  const [hoverPopup, setHoverPopup] = useState(null); // 右键弹出的窗口
  const [vocabSearch, setVocabSearch] = useState(''); // 生词库搜索关键词
  const [fileModalVisible, setFileModalVisible] = useState(false); // 文件操作弹窗显示状态
  const [saveModalVisible, setSaveModalVisible] = useState(false); // 保存设置弹窗显示状态
  const [saveFileName, setSaveFileName] = useState(`随文识字_${new Date().toISOString().split('T')[0]}`); // 保存文件名
  const [saveFileFormat, setSaveFileFormat] = useState('txt'); // 保存文件格式
  const [addCharacterModalVisible, setAddCharacterModalVisible] = useState(false); // 添加汉字弹窗显示状态
  const [newCharacter, setNewCharacter] = useState({ // 新汉字数据
    char: '',
    pinyin: '',
    meaning: '',
    strokes: '',
    examples: '',
    level: '1级',
    category: '基础汉字',
    difficulty: '简单'
  });
  const [userCharacters, setUserCharacters] = useState([]); // 用户添加的汉字列表

  // 引用
  const textInputRef = useRef(null);
  const mainContentRef = useRef(null);
  // const audioRef = useRef(null); // eslint-disable-line no-unused-vars

  // 初始化
  useEffect(() => {
    highlightCharacters(inputText);
  }, []);

  // 监听点击事件，点击外部关闭悬浮窗口
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (charPopup) {
        // 检查是否点击了悬浮窗口本身
        const popupElement = document.querySelector('.char-popup');
        if (popupElement && popupElement.contains(event.target)) {
          return;
        }
        
        // 检查是否点击了高亮的生字
        const highlightedChar = event.target.closest('.highlighted-char');
        if (highlightedChar) {
          return;
        }
        
        // 点击了其他区域，关闭悬浮窗口
        setCharPopup(null);
      }
    };

  // 处理保存文件
  const handleSaveFile = async () => {
    try {
      const fileName = saveFileName;
      const format = saveFileFormat;
      
      if (!fileName) {
        alert('请输入文件名');
        return;
      }

      switch (format) {
        case 'txt':
          // 保存为文本文件
          const txtBlob = new Blob([inputText], { type: 'text/plain' });
          const txtUrl = URL.createObjectURL(txtBlob);
          const txtA = document.createElement('a');
          txtA.href = txtUrl;
          txtA.download = `${fileName}.txt`;
          txtA.click();
          URL.revokeObjectURL(txtUrl);
          break;

        case 'docx':
          // 保存为Word文档
          try {
            // 创建一个包含文本的HTML文件，Word可以打开
            const htmlContent = `
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>${fileName}</title>
                </head>
                <body>
                  <div style="font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5;">
                    ${inputText.split('\n').map(line => `<p>${line}</p>`).join('')}
                  </div>
                </body>
              </html>
            `;
            
            // 创建Blob并下载
            const docxBlob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const docxUrl = URL.createObjectURL(docxBlob);
            const docxA = document.createElement('a');
            docxA.href = docxUrl;
            docxA.download = `${fileName}.docx`;
            docxA.click();
            URL.revokeObjectURL(docxUrl);
          } catch (error) {
            alert('Word文档保存失败，请重试');
          }
          break;

        case 'xlsx':
          // 保存为Excel文档
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.aoa_to_sheet([inputText.split('\n')]);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const excelUrl = URL.createObjectURL(excelBlob);
          const excelA = document.createElement('a');
          excelA.href = excelUrl;
          excelA.download = `${fileName}.xlsx`;
          excelA.click();
          URL.revokeObjectURL(excelUrl);
          break;

        default:
          alert('不支持的文件格式');
          break;
      }

      setSaveModalVisible(false);
      setFileModalVisible(false);
    } catch (error) {
      alert('文件保存失败，请重试');
      setSaveModalVisible(false);
    }
  };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [charPopup]);

  // 高亮显示课文中的生字
  const highlightCharacters = (text) => {
    let highlighted = "";
    for (let char of text) {
      if (DICTIONARY[char]) {
        highlighted += `<span class="highlighted-char" data-char="${char}">${char}<span class="audio-icon" title="播放读音">🔊</span></span>`;
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
    if (e.target.classList.contains('audio-icon')) {
      // 点击喇叭图标，只播放读音
      const char = e.target.parentElement.getAttribute('data-char');
      playCharacterSound(char);
      e.stopPropagation(); // 阻止冒泡，避免触发详情弹窗
    } else if (e.target.classList.contains('highlighted-char')) {
      // 点击生字，弹出悬浮窗口显示组词和例句
      const char = e.target.getAttribute('data-char');
      const rect = e.target.getBoundingClientRect();
      
      setCharPopup({
        char,
        x: rect.right + 10,
        y: rect.top
      });
      
      // 播放读音
      playCharacterSound(char);
    }
  };

  // 处理长按开始
  const handleCharLongPressStart = (e) => {
    if (e.target.classList.contains('highlighted-char')) {
      const char = e.target.getAttribute('data-char');
      const rect = e.target.getBoundingClientRect();
      
      const timer = setTimeout(() => {
        setContextMenu({
          char,
          x: rect.right + 10,
          y: rect.top
        });
      }, 500);
      
      setLongPressTimer(timer);
    }
  };

  // 处理长按结束
  const handleCharLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // 处理长按取消
  const handleCharLongPressCancel = () => {
    handleCharLongPressEnd();
  };

  // 处理菜单项点击
  const handleMenuItemClick = (action) => {
    if (contextMenu) {
      const char = contextMenu.char;
      
      switch (action) {
        case 'showDetails':
          setSelectedChar(char);
          break;
        case 'playSound':
          playCharacterSound(char);
          break;
        case 'toggleProgress':
          toggleCharacterProgress(char);
          break;
        case 'addToVocab':
          addCharToVocab(char);
          break;
        default:
          break;
      }
      
      setContextMenu(null);
    }
  };

  // 处理鼠标右键点击
  const handleCharContextMenu = (e) => {
    // 检查是否是高亮的生字或其子元素
    let highlightedChar = e.target;
    while (highlightedChar && !highlightedChar.classList.contains('highlighted-char')) {
      highlightedChar = highlightedChar.parentElement;
    }
    
    if (highlightedChar) {
      // 阻止默认的上下文菜单
      e.preventDefault();
      
      const char = highlightedChar.getAttribute('data-char');
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // 显示悬浮窗
      setHoverPopup({
        char,
        x: mouseX + 10,
        y: mouseY - 10
      });
    }
  };

  // 处理鼠标离开
  const handleCharMouseLeave = () => {
    // 不立即关闭悬浮窗，让悬浮窗自己管理关闭逻辑
    // 这样当鼠标从文本移动到悬浮窗时，悬浮窗不会消失
  };

  // 添加到生词库
  const addCharToVocab = (char) => {
    if (DICTIONARY[char] && !currentVersionData.vocabBook.some(word => word.char === char)) {
      // 添加生词到当前版本的生词库
      setVersionData(prev => ({
        ...prev,
        [appVersion]: {
          ...prev[appVersion],
          vocabBook: [...prev[appVersion].vocabBook, {
            char,
            pinyin: DICTIONARY[char].pinyin,
            meaning: DICTIONARY[char].meaning
          }]
        }
      }));
      // 更新当前版本数据
      setCurrentVersionData(prev => ({
        ...prev,
        vocabBook: [...prev.vocabBook, {
          char,
          pinyin: DICTIONARY[char].pinyin,
          meaning: DICTIONARY[char].meaning
        }]
      }));
      // 关闭悬浮窗
      setHoverPopup(null);
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
  const playCharacterSound = (char, options = {}) => {
    const { repeat = false, slow = false } = options;
    const u = new SpeechSynthesisUtterance(char);
    u.lang = "zh-CN";
    u.rate = slow ? 0.7 : 1;
    
    if (repeat) {
      u.onend = () => {
        setTimeout(() => {
          speechSynthesis.speak(u);
        }, 1000);
      };
    }
    
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  // 播放完整文本
  const playTextSound = (text) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 1;
    
    speechSynthesis.cancel();
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

  // 处理登录
  const handleLogin = () => {
    // 简单的登录验证逻辑
    // 实际应用中应该调用后端API进行验证
    const validCredentials = {
      '教师版': { username: 'teacher', password: 'teacher123' },
      '家长版': { username: 'parent', password: 'parent123' }
    };

    const expected = validCredentials[targetVersion];
    if (loginUsername === expected.username && loginPassword === expected.password) {
      // 登录成功
      // 保存当前版本数据
      setVersionData(prev => ({
        ...prev,
        [appVersion]: {
          ...currentVersionData,
          settings: {
            fontSize: fontSize,
            fontSizeValue: fontSizeValue,
            darkMode: darkMode,
            eyeProtectionMode: eyeProtectionMode
          }
        }
      }));
      // 切换版本并加载新版本数据
      setAppVersion(targetVersion);
      setCurrentVersionData(versionData[targetVersion]);
      // 应用新版本的设置
      setFontSize(versionData[targetVersion].settings.fontSize);
      setFontSizeValue(versionData[targetVersion].settings.fontSizeValue);
      setDarkMode(versionData[targetVersion].settings.darkMode);
      setEyeProtectionMode(versionData[targetVersion].settings.eyeProtectionMode);
      setLoginMessage('版本切换成功！');
      setTimeout(() => {
        setShowLoginModal(false);
      }, 1500);
    } else {
      // 登录失败
      setLoginMessage('账号或密码错误，请重新输入！');
    }
  };

  // 处理拼音声调输入
  const handlePinyinInput = (e) => {
    // 只在书写练习模式下处理
    if (practiceMode !== 'write') return;

    // 检查是否按下了数字键 1-5
    const keyCode = e.keyCode;
    if (keyCode >= 49 && keyCode <= 53) {
      const tone = keyCode - 48; // 1-5
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = userAnswer;

      // 如果没有选中文本，查找光标前的元音字母
      if (start === end) {
        // 从光标位置向前查找元音字母
        let vowelIndex = -1;
        for (let i = start - 1; i >= 0; i--) {
          const char = text[i];
          if (/[aeiouvüAEIOUVÜ]/.test(char)) {
            vowelIndex = i;
            break;
          }
        }

        if (vowelIndex !== -1) {
          e.preventDefault();
          const vowel = text[vowelIndex];
          const newChar = addToneMark(vowel, tone);
          if (newChar) {
            const newText = text.substring(0, vowelIndex) + newChar + text.substring(vowelIndex + 1);
            setUserAnswer(newText);
            // 设置光标位置
            setTimeout(() => {
              input.selectionStart = input.selectionEnd = vowelIndex + 1;
            }, 0);
          }
        }
      }
    }
  };

  // 添加拼音声调
  const addToneMark = (vowel, tone) => {
    const vowelMap = {
      'a': ['a', 'á', 'ǎ', 'à', 'a'],
      'e': ['e', 'é', 'ě', 'è', 'e'],
      'i': ['i', 'í', 'ǐ', 'ì', 'i'],
      'o': ['o', 'ó', 'ǒ', 'ò', 'o'],
      'u': ['u', 'ú', 'ǔ', 'ù', 'u'],
      'v': ['ü', 'ǘ', 'ǚ', 'ǜ', 'ü'],
      'ü': ['ü', 'ǘ', 'ǚ', 'ǜ', 'ü'],
      'A': ['A', 'Á', 'Ǎ', 'À', 'A'],
      'E': ['E', 'É', 'Ě', 'È', 'E'],
      'I': ['I', 'Í', 'Ǐ', 'Ì', 'I'],
      'O': ['O', 'Ó', 'Ǒ', 'Ò', 'O'],
      'U': ['U', 'Ú', 'Ǔ', 'Ù', 'U'],
      'V': ['Ü', 'Ǘ', 'Ǚ', 'Ǜ', 'Ü'],
      'Ü': ['Ü', 'Ǘ', 'Ǚ', 'Ǜ', 'Ü']
    };

    return vowelMap[vowel] ? vowelMap[vowel][tone - 1] : vowel;
  };

  // 处理添加汉字弹窗中的拼音声调输入
  const handleAddCharacterPinyinInput = (e) => {
    // 检查是否按下了数字键 1-5
    const keyCode = e.keyCode;
    if (keyCode >= 49 && keyCode <= 53) {
      const tone = keyCode - 48; // 1-5
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = newCharacter.pinyin;

      // 如果没有选中文本，查找光标前的元音字母
      if (start === end) {
        // 从光标位置向前查找元音字母
        let vowelIndex = -1;
        for (let i = start - 1; i >= 0; i--) {
          const char = text[i];
          if (/[aeiouvüAEIOUVÜ]/.test(char)) {
            vowelIndex = i;
            break;
          }
        }

        if (vowelIndex !== -1) {
          e.preventDefault();
          const vowel = text[vowelIndex];
          const newChar = addToneMark(vowel, tone);
          if (newChar) {
            const newText = text.substring(0, vowelIndex) + newChar + text.substring(vowelIndex + 1);
            setNewCharacter({ ...newCharacter, pinyin: newText });
            // 设置光标位置
            setTimeout(() => {
              input.selectionStart = input.selectionEnd = vowelIndex + 1;
            }, 0);
          }
        }
      }
    }
  };

  // 处理文件操作
  const handleFileOperation = (action) => {
    switch (action) {
      case 'open':
        // 创建文件输入元素
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,.docx,.xlsx';
        fileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            
            // 根据文件扩展名选择不同的处理方式
            if (fileExtension === 'txt') {
              // 处理文本文件
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  setInputText(event.target.result);
                  setFileModalVisible(false);
                } catch (error) {
                  alert('文件读取失败，请确保文件格式正确');
                }
              };
              reader.readAsText(file);
            } else if (fileExtension === 'docx') {
              // 处理Word文档
              const reader = new FileReader();
              reader.onload = async (event) => {
                try {
                  const arrayBuffer = event.target.result;
                  const result = await mammoth.extractRawText({ arrayBuffer });
                  const text = result.value;
                  setInputText(text);
                  setFileModalVisible(false);
                } catch (error) {
                  alert('Word文档读取失败，请确保文件格式正确');
                  setFileModalVisible(false);
                }
              };
              reader.readAsArrayBuffer(file);
            } else if (fileExtension === 'xlsx') {
              // 处理Excel文档
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const arrayBuffer = event.target.result;
                  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                  const firstSheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[firstSheetName];
                  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                  
                  // 将二维数组转换为文本
                  const text = jsonData.map(row => row.join(' ')).join('\n');
                  setInputText(text);
                  setFileModalVisible(false);
                } catch (error) {
                  alert('Excel文档读取失败，请确保文件格式正确');
                  setFileModalVisible(false);
                }
              };
              reader.readAsArrayBuffer(file);
            } else {
              alert('不支持的文件格式，请使用 .txt、.docx 或 .xlsx 格式');
              setFileModalVisible(false);
            }
          }
        };
        fileInput.click();
        break;

      case 'save':
        // 显示保存设置弹窗
        setSaveFileName(`随文识字_${new Date().toISOString().split('T')[0]}`);
        setSaveFileFormat('txt');
        setSaveModalVisible(true);
        break;

      case 'export':
        // 导出为Excel格式（简化版，实际需要使用库）
        alert('导出功能正在开发中，敬请期待！');
        setFileModalVisible(false);
        break;

      default:
        break;
    }
  };

  // 处理保存文件
  const handleSaveFile = () => {
    try {
      const fileName = saveFileName;
      const format = saveFileFormat;
      
      if (!fileName) {
        alert('请输入文件名');
        return;
      }

      switch (format) {
        case 'txt':
          // 保存为文本文件
          const txtBlob = new Blob([inputText], { type: 'text/plain' });
          const txtUrl = URL.createObjectURL(txtBlob);
          const txtA = document.createElement('a');
          txtA.href = txtUrl;
          txtA.download = `${fileName}.txt`;
          txtA.click();
          URL.revokeObjectURL(txtUrl);
          break;

        case 'docx':
          // 保存为Word文档（简化版）
          alert('Word文档保存功能正在开发中，请先使用文本文件格式');
          break;

        case 'xlsx':
          // 保存为Excel文档
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.aoa_to_sheet([inputText.split('\n')]);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const excelUrl = URL.createObjectURL(excelBlob);
          const excelA = document.createElement('a');
          excelA.href = excelUrl;
          excelA.download = `${fileName}.xlsx`;
          excelA.click();
          URL.revokeObjectURL(excelUrl);
          break;

        default:
          alert('不支持的文件格式');
          break;
      }

      setSaveModalVisible(false);
      setFileModalVisible(false);
    } catch (error) {
      alert('文件保存失败，请重试');
      setSaveModalVisible(false);
    }
  };

  // 关闭登录窗口
  const closeLoginModal = () => {
    setShowLoginModal(false);
    // 恢复到原来的版本
    if (targetVersion !== appVersion) {
      // 重置选择框到原来的版本
      // 注意：这里需要在UI更新后手动处理，因为选择框的值已经改变了
    }
  };

  return (
    <div className={`text-reader-container ${darkMode ? 'dark-mode' : ''} ${eyeProtectionMode ? 'eye-protection-mode' : ''}`}>
      {/* 导航栏 */}
      <nav className="main-nav">
        <div className="nav-brand">
          <h1>📚 随文识字 <span className="version-tag">{appVersion}</span></h1>
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
            className={`nav-btn ${activeView === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveView('stats')}
          >
            📊 统计
          </button>
          <button
            className={`nav-btn ${activeView === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveView('manage')}
          >
            📋 管理
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
      <div className="main-content" ref={mainContentRef}>
        {/* 阅读视图 */}
        {activeView === 'reader' && (
          <div className="content-area">
            <div className="text-section">
              <div className="section-header">
                <h2>📝 课文阅读</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>字体大小</span>
                    <input 
                      type="range" 
                      min="16"
                      max="36"
                      value={fontSizeValue}
                      onChange={(e) => setFontSizeValue(parseInt(e.target.value))}
                      style={{
                        width: '120px',
                        height: '4px',
                        borderRadius: '2px',
                        background: 'var(--bg-light)',
                        outline: 'none',
                        appearance: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '4px',
                        borderRadius: '6px'
                      }}
                    />
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'var(--text-primary)',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}>
                      {fontSizeValue}px
                    </span>
                  </div>
                  <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setFileModalVisible(true)}>
                    📁 打开文件
                  </button>
                  <button className="btn-secondary" onClick={() => setInputText("")}>
                    清空
                  </button>
                </div>
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

              <div className="text-display" style={{ fontSize: `${fontSizeValue}px` }}>
                <button 
                  className="text-audio-icon" 
                  onClick={() => playTextSound(inputText)}
                  title="播放完整文本"
                >
                  🔊
                </button>
                <div
                  className="highlighted-text"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                  onClick={handleCharClick}
                  onMouseDown={handleCharLongPressStart}
                  onMouseUp={handleCharLongPressEnd}
                  onMouseLeave={handleCharMouseLeave}
                  onTouchStart={handleCharLongPressStart}
                  onTouchEnd={handleCharLongPressEnd}
                  onTouchCancel={handleCharLongPressCancel}
                  onContextMenu={handleCharContextMenu}
                />
              </div>

              {/* 悬停悬浮窗 */}
              {hoverPopup && (
                <div 
                  className="hover-popup"
                  style={{
                    position: 'fixed',
                    left: hoverPopup.x,
                    top: hoverPopup.y,
                    zIndex: 1001
                  }}
                  onMouseEnter={() => setHoverPopup(hoverPopup)} // 鼠标进入悬浮窗时保持显示
                  onMouseLeave={() => setHoverPopup(null)} // 鼠标离开悬浮窗时关闭
                >
                  <div className="hover-popup-content">
                    <div className="hover-char">{hoverPopup.char}</div>
                    <button 
                      className="btn-add-to-vocab"
                      onClick={() => addCharToVocab(hoverPopup.char)}
                      title="添加到生词库"
                    >
                      📝 添加到生词库
                    </button>
                  </div>
                </div>
              )}

              {/* 上下文菜单 */}
              {contextMenu && (
                <div 
                  className="context-menu"
                  style={{
                    position: 'fixed',
                    left: contextMenu.x,
                    top: contextMenu.y,
                    zIndex: 1001
                  }}
                >
                  <div className="context-menu-item" onClick={() => handleMenuItemClick('showDetails')}>
                    📖 查看详情
                  </div>
                  <div className="context-menu-item" onClick={() => handleMenuItemClick('playSound')}>
                    🔊 播放读音
                  </div>
                  <div className="context-menu-item" onClick={() => handleMenuItemClick('toggleProgress')}>
                    {studyProgress[contextMenu.char] ? '✓ 标记为未掌握' : '📚 标记为已掌握'}
                  </div>
                  <div className="context-menu-item" onClick={() => handleMenuItemClick('addToVocab')}>
                    📝 添加到生词库
                  </div>
                </div>
              )}

              {/* 生字悬浮窗口 */}
              {charPopup && DICTIONARY[charPopup.char] && (
                <div 
                  className="char-popup"
                  style={{
                    position: 'fixed',
                    left: charPopup.x,
                    top: charPopup.y,
                    zIndex: 1001
                  }}
                >
                  <div className="char-popup-header">
                    <span className="popup-char">{charPopup.char}</span>
                    <span className="popup-pinyin">{DICTIONARY[charPopup.char].pinyin}</span>
                  </div>
                  <div className="char-popup-content">
                    <div className="popup-examples">
                      <span className="popup-label">组词：</span>
                      <div className="popup-words">
                        {DICTIONARY[charPopup.char].examples.map((word, index) => (
                          <span key={index} className="popup-word">{word}</span>
                        ))}
                      </div>
                    </div>
                    <div className="popup-sentence">
                      <span className="popup-label">例句：</span>
                      <span className="popup-sentence-text">{DICTIONARY[charPopup.char].sentence}</span>
                    </div>
                  </div>
                  <div className="char-popup-footer">
                    <button 
                      className="popup-detail-btn"
                      onClick={() => {
                        setSelectedChar(charPopup.char);
                        setCharPopup(null);
                      }}
                    >
                      查看详情
                    </button>
                    <button 
                      className="popup-close-btn"
                      onClick={() => setCharPopup(null)}
                    >
                      关闭
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar">
              {/* 生字表 */}
              <div className="panel">
                <div className="panel-header">
                  <h3>📖 生字表</h3>
                  <div className="header-actions">
                    <div className="level-tabs">
                      <button className="level-tab active" data-level="1">初级</button>
                      <button className="level-tab" data-level="2">中级</button>
                      <button className="level-tab" data-level="3">高级</button>
                    </div>
                    <button className="btn-vocab-book" onClick={() => setActiveView('vocabBook')}>
                      📚 生词库
                    </button>
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
                          onKeyDown={handlePinyinInput}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                  <input 
                    type="range" 
                    className="setting-slider"
                    min="16"
                    max="36"
                    value={fontSizeValue}
                    onChange={(e) => setFontSizeValue(parseInt(e.target.value))}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: 'var(--bg-light)',
                      outline: 'none',
                      appearance: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '4px',
                      borderRadius: '6px'
                    }}
                  />
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: 'var(--text-primary)',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {fontSizeValue}px
                  </span>
                </div>
              </div>
              <div className="setting-item">
                <label>自动播放读音</label>
                <input type="checkbox" className="setting-checkbox" />
              </div>
              <div className="setting-item">
                <label>显示笔顺动画</label>
                <input type="checkbox" className="setting-checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>护眼模式</label>
                <input 
                  type="checkbox" 
                  className="setting-checkbox" 
                  checked={eyeProtectionMode}
                  onChange={(e) => setEyeProtectionMode(e.target.checked)}
                />
              </div>
              <div className="setting-item">
                <label>版本切换</label>
                <select 
                  className="setting-select"
                  value={appVersion}
                  onChange={(e) => {
                    const selectedVersion = e.target.value;
                    if (selectedVersion === '教师版' || selectedVersion === '家长版') {
                      // 弹出登录窗口
                      setTargetVersion(selectedVersion);
                      setLoginUsername('');
                      setLoginPassword('');
                      setLoginMessage('');
                      setShowLoginModal(true);
                    } else {
                      // 学生版不需要登录
                      // 保存当前版本数据
                      setVersionData(prev => ({
                        ...prev,
                        [appVersion]: {
                          ...currentVersionData,
                          settings: {
                            fontSize: fontSize,
                            fontSizeValue: fontSizeValue,
                            darkMode: darkMode,
                            eyeProtectionMode: eyeProtectionMode
                          }
                        }
                      }));
                      // 切换版本并加载新版本数据
                      setAppVersion(selectedVersion);
                      setCurrentVersionData(versionData[selectedVersion]);
                      // 应用新版本的设置
                      setFontSize(versionData[selectedVersion].settings.fontSize);
                      setFontSizeValue(versionData[selectedVersion].settings.fontSizeValue);
                      setDarkMode(versionData[selectedVersion].settings.darkMode);
                      setEyeProtectionMode(versionData[selectedVersion].settings.eyeProtectionMode);
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    border: '2px solid var(--bg-light)',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="学生版">学生版（侧重学习）</option>
                  <option value="教师版">教师版（侧重备课）</option>
                  <option value="家长版">家长版（侧重了解）</option>
                </select>
              </div>
            </div>

            <div className="settings-section">
              <h3>📤 数据管理</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn-primary" onClick={exportData}>
                  导出学习数据
                </button>
                <button className="btn-secondary">
                  清空学习进度
                </button>
              </div>
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

        {/* 管理视图 */}
        {activeView === 'manage' && (
          <div className="settings-container">
            <div className="settings-section" style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--box-shadow)',
              padding: '24px 30px',
              marginBottom: '24px',
              border: '2px solid var(--bg-light)',
              transition: 'var(--transition)'
            }}>
              <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>📝 汉字管理</h3>
              <div className="character-management">
                {/* 操作按钮 */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginBottom: '20px',
                  alignItems: 'center'
                }}>
                  <button style={{ 
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    background: '#4CAF50',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }} onClick={() => setAddCharacterModalVisible(true)}>
                    + 添加汉字
                  </button>
                  <button style={{ 
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    background: '#2196F3',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}>
                    📤 导出
                  </button>
                  <button style={{ 
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    background: '#FF9800',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}>
                    📥 导入
                  </button>
                </div>
                
                {/* 搜索和筛选 */}
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <input 
                    type="text" 
                    placeholder="搜索汉字、拼音或释义..." 
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: '10px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '16px',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-secondary)'
                    }}
                  />
                  <select style={{
                    padding: '10px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer'
                  }}>
                    <option>全部级别</option>
                    <option>一级</option>
                    <option>二级</option>
                    <option>三级</option>
                  </select>
                  <select style={{
                    padding: '10px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer'
                  }}>
                    <option>全部难度</option>
                    <option>简单</option>
                    <option>中等</option>
                    <option>困难</option>
                  </select>
                </div>
                
                {/* 汉字列表或空状态提示 */}
                {userCharacters.length > 0 ? (
                  <>
                    {/* 汉字列表 */}
                    <div style={{
                      marginBottom: '20px',
                      border: '1px solid #ddd',
                      borderRadius: 'var(--border-radius)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 120px 1fr 120px 120px',
                        gap: '12px',
                        padding: '16px',
                        background: '#f5f7fa',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        <span>汉字</span>
                        <span>拼音</span>
                        <span>释义</span>
                        <span>级别</span>
                        <span>难度</span>
                      </div>
                      {userCharacters.map((char, index) => (
                        <div key={index} style={{
                          display: 'grid',
                          gridTemplateColumns: '80px 120px 1fr 120px 120px',
                          gap: '12px',
                          padding: '16px',
                          borderTop: '1px solid #ddd',
                          fontSize: '14px'
                        }}>
                          <span style={{ fontSize: '20px', fontWeight: '500' }}>{char.char}</span>
                          <span>{char.pinyin}</span>
                          <span>{char.meaning || '无'}</span>
                          <span>{char.level}</span>
                          <span>{char.difficulty}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* 统计信息 */}
                    <div style={{
                      padding: '16px',
                      background: '#f5f7fa',
                      borderRadius: 'var(--border-radius)',
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      共{userCharacters.length}个汉字，显示{userCharacters.length}个
                    </div>
                  </>
                ) : (
                  /* 空状态提示 */
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    marginBottom: '20px',
                    color: '#999',
                    fontSize: '16px'
                  }}>
                    还没有汉字，点击"添加汉字"开始添加
                  </div>
                )}
              </div>
            </div>

            <div className="settings-section" style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--box-shadow)',
              padding: '24px 30px',
              marginBottom: '24px',
              border: '2px solid var(--bg-light)',
              transition: 'var(--transition)'
            }}>
              <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>📋 生词库管理</h3>
              <div className="vocab-management">
                <div className="search-box" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <input 
                    type="text" 
                    placeholder="搜索生词..." 
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid var(--bg-light)',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '16px',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-secondary)',
                      transition: 'var(--transition)'
                    }}
                  />
                  <button className="btn-primary" style={{ 
                    padding: '12px 24px',
                    transition: 'var(--transition)'
                  }}>
                    搜索
                  </button>
                  <button className="btn-secondary" style={{ 
                    padding: '12px 24px',
                    transition: 'var(--transition)'
                  }}>
                    清空搜索
                  </button>
                </div>
                <div className="vocab-list" style={{
                  marginTop: '16px',
                  padding: '16px',
                  border: '2px solid var(--bg-light)',
                  borderRadius: 'var(--border-radius)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  background: 'var(--bg-secondary)'
                }}>
                  {currentVersionData.vocabBook.length > 0 ? (
                    <>
                      <div className="vocab-list-header" style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 120px 1fr 120px',
                        gap: '12px',
                        padding: '12px',
                        marginBottom: '12px',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--border-radius)',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        <span>汉字</span>
                        <span>拼音</span>
                        <span>释义</span>
                        <span>操作</span>
                      </div>
                      {currentVersionData.vocabBook.map((item, index) => (
                        <div key={index} className="vocab-item" style={{
                          display: 'grid',
                          gridTemplateColumns: '80px 120px 1fr 120px',
                          gap: '12px',
                          padding: '12px',
                          marginBottom: '8px',
                          background: 'var(--bg-primary)',
                          borderRadius: 'var(--border-radius)',
                          border: '2px solid var(--bg-light)',
                          transition: 'var(--transition)'
                        }} onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary-color)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }} onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--bg-light)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          <span style={{ fontSize: '20px', fontWeight: '500' }}>{item.char}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.pinyin}</span>
                          <span style={{ color: 'var(--text-primary)' }}>{item.meaning}</span>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button className="btn-secondary" style={{ 
                              padding: '6px 12px', 
                              fontSize: '14px',
                              transition: 'var(--transition)'
                            }} onClick={() => playCharacterSound(item.char)}>
                              🔊
                            </button>
                            <button className="btn-secondary" style={{ 
                              padding: '6px 12px', 
                              fontSize: '14px',
                              transition: 'var(--transition)'
                            }} onClick={() => {
                              // 从当前版本的生词库中移除
                              const updatedVocabBook = currentVersionData.vocabBook.filter((_, i) => i !== index);
                              setVersionData(prev => ({
                                ...prev,
                                [appVersion]: {
                                  ...prev[appVersion],
                                  vocabBook: updatedVocabBook
                                }
                              }));
                              setCurrentVersionData(prev => ({
                                ...prev,
                                vocabBook: updatedVocabBook
                              }));
                            }}>
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      color: 'var(--text-secondary)', 
                      padding: '40px 20px',
                      background: 'var(--bg-primary)',
                      borderRadius: 'var(--border-radius)',
                      border: '2px dashed var(--bg-light)'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '18px' }}>生词库为空</p>
                      <p style={{ margin: 0, fontSize: '14px' }}>在阅读时点击生字，然后选择添加到生词库</p>
                    </div>
                  )}
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  marginTop: '20px',
                  justifyContent: 'flex-end'
                }}>
                  <button className="btn-primary" style={{ 
                    padding: '12px 24px',
                    transition: 'var(--transition)'
                  }}>
                    导出生词库
                  </button>
                  <button className="btn-secondary" style={{ 
                    padding: '12px 24px',
                    transition: 'var(--transition)'
                  }}>
                    导入生词库
                  </button>
                  <button className="btn-secondary" style={{ 
                    padding: '12px 24px',
                    transition: 'var(--transition)'
                  }}>
                    清空生词库
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-section" style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--box-shadow)',
              padding: '24px 30px',
              marginBottom: '24px',
              border: '2px solid var(--bg-light)',
              transition: 'var(--transition)'
            }}>
              <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>📊 练习管理</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button className="btn-primary" style={{ 
                  padding: '14px 28px',
                  fontSize: '16px',
                  transition: 'var(--transition)'
                }}>
                  导出练习历史
                </button>
                <button className="btn-secondary" style={{ 
                  padding: '14px 28px',
                  fontSize: '16px',
                  transition: 'var(--transition)'
                }}>
                  清空练习历史
                </button>
                <button className="btn-secondary" style={{ 
                  padding: '14px 28px',
                  fontSize: '16px',
                  transition: 'var(--transition)'
                }}>
                  查看练习统计
                </button>
              </div>
            </div>

            <div className="settings-section" style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--box-shadow)',
              padding: '24px 30px',
              marginBottom: '24px',
              border: '2px solid var(--bg-light)',
              transition: 'var(--transition)'
            }}>
              <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>⚙️ 系统设置</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="setting-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius)',
                  border: '2px solid var(--bg-light)',
                  transition: 'var(--transition)'
                }}>
                  <label style={{ fontSize: '16px' }}>自动保存</label>
                  <input type="checkbox" className="setting-checkbox" defaultChecked />
                </div>
                <div className="setting-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius)',
                  border: '2px solid var(--bg-light)',
                  transition: 'var(--transition)'
                }}>
                  <label style={{ fontSize: '16px' }}>启用通知</label>
                  <input type="checkbox" className="setting-checkbox" defaultChecked />
                </div>
                <div className="setting-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius)',
                  border: '2px solid var(--bg-light)',
                  transition: 'var(--transition)'
                }}>
                  <label style={{ fontSize: '16px' }}>检查更新</label>
                  <button className="btn-secondary" style={{ 
                    padding: '8px 16px',
                    transition: 'var(--transition)'
                  }}>
                    检查
                  </button>
                </div>
                <div className="setting-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius)',
                  border: '2px solid var(--bg-light)',
                  transition: 'var(--transition)'
                }}>
                  <label style={{ fontSize: '16px' }}>数据备份</label>
                  <button className="btn-primary" style={{ 
                    padding: '8px 16px',
                    transition: 'var(--transition)'
                  }}>
                    立即备份
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 生词库视图 */}
        {activeView === 'vocabBook' && (
          <div className="vocab-book-container">
            <div className="vocab-book-header" style={{ 
              background: 'var(--bg-primary)', 
              borderRadius: 'var(--border-radius)', 
              boxShadow: 'var(--box-shadow)', 
              padding: '24px 30px', 
              marginBottom: '24px',
              border: '2px solid var(--bg-light)',
              transition: 'var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, marginRight: '40px', fontSize: '20px', fontWeight: '600' }}>📚 生词库</h2>
                <button className="btn-secondary" onClick={() => setActiveView('reader')}>
                  返回阅读
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="搜索生词..."
                  value={vocabSearch}
                  onChange={(e) => setVocabSearch(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid var(--bg-light)',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-secondary)',
                    transition: 'var(--transition)',
                    minWidth: '0'
                  }}
                />
                <button
                  className="btn-secondary"
                  onClick={() => setVocabSearch('')}
                  style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}
                >
                  清空
                </button>
              </div>
            </div>

            <div className="vocab-book-content">
              {(() => {
                // 过滤生词库
                const filteredVocab = currentVersionData.vocabBook.filter(word => {
                  if (!vocabSearch) return true;
                  const searchTerm = vocabSearch.toLowerCase();
                  return (
                    word.char.includes(vocabSearch) ||
                    word.pinyin.toLowerCase().includes(searchTerm) ||
                    word.meaning.toLowerCase().includes(searchTerm)
                  );
                });
                
                if (filteredVocab.length > 0) {
                  // 调试：检查生词库数据
                  console.log('Filtered vocab:', filteredVocab);
                  
                  return (
                    <div className="vocab-list">
                      <div className="vocab-list-header">
                        <span>汉字</span>
                        <span>拼音</span>
                        <span>释义</span>
                        <span>操作</span>
                      </div>
                      {filteredVocab.map((word, index) => (
                        <div key={index} className="vocab-item">
                          <span className="vocab-char">{word.char}</span>
                          <span className="vocab-pinyin">
                            {/* 直接显示原始拼音数据 */}
                            {word.pinyin}
                          </span>
                          <span className="vocab-meaning">{word.meaning}</span>
                          <div className="vocab-actions">
                            <button 
                              className="btn-small" 
                              onClick={() => playCharacterSound(word.char)}
                              title="播放读音"
                            >
                              🔊
                            </button>
                            <button 
                              className="btn-small delete" 
                              onClick={() => {
                                // 从当前版本的生词库中移除
                                const updatedVocabBook = currentVersionData.vocabBook.filter((_, i) => i !== index);
                                setVersionData(prev => ({
                                  ...prev,
                                  [appVersion]: {
                                    ...prev[appVersion],
                                    vocabBook: updatedVocabBook
                                  }
                                }));
                                setCurrentVersionData(prev => ({
                                  ...prev,
                                  vocabBook: updatedVocabBook
                                }));
                              }}
                              title="从生词库移除"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else if (vocabSearch) {
                  return (
                    <div className="empty-vocab">
                      <p>未找到匹配的生词</p>
                      <p>尝试其他搜索词或清空搜索框</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="empty-vocab">
                      <p>生词库为空</p>
                      <p>在阅读时点击生字，然后选择添加到生词库</p>
                    </div>
                  );
                }
              })()}
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
                <div className="audio-controls">
                  <button
                    className="action-btn"
                    onClick={() => playCharacterSound(selectedChar)}
                    title="播放读音"
                  >
                    🔊
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => playCharacterSound(selectedChar, { repeat: true })}
                    title="重复朗读"
                  >
                    🔁
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => playCharacterSound(selectedChar, { slow: true })}
                    title="慢速朗读"
                  >
                    ⏱️
                  </button>
                </div>
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
                    <span className="pinyin">
                      {/* 直接显示原始拼音数据，包含声调 */}
                      {DICTIONARY[selectedChar].pinyin}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">部首：</span>
                    <span className="radical">{DICTIONARY[selectedChar].radical}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">笔画数：</span>
                    <span className="stroke-count">{DICTIONARY[selectedChar].strokeCount}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">结构：</span>
                    <span className="structure">{DICTIONARY[selectedChar].structure}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">难度：</span>
                    <span className="difficulty">{DICTIONARY[selectedChar].difficulty}</span>
                  </div>
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

                <div className="sentence-section">
                  <span className="section-label">例句：</span>
                  <span className="sentence">{DICTIONARY[selectedChar].sentence}</span>
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

      {/* 登录窗口 */}
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <div className="login-modal-header">
              <h3>登录 {targetVersion}</h3>
              <button className="login-modal-close" onClick={closeLoginModal}>×</button>
            </div>
            <div className="login-modal-content">
              <div className="login-form">
                <div className="form-item">
                  <label>账号</label>
                  <input
                    type="text"
                    className="form-input"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder={`请输入${targetVersion === '教师版' ? '教师' : '家长'}账号`}
                  />
                </div>
                <div className="form-item">
                  <label>密码</label>
                  <input
                    type="password"
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={`请输入${targetVersion === '教师版' ? '教师' : '家长'}密码`}
                  />
                </div>
                {loginMessage && (
                  <div className={`login-message ${loginMessage.includes('成功') ? 'success' : 'error'}`}>
                    {loginMessage}
                  </div>
                )}
                <div className="form-actions">
                  <button className="btn-primary" onClick={handleLogin}>确认登录</button>
                  <button className="btn-secondary" onClick={closeLoginModal}>取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文件操作弹窗 */}
      {fileModalVisible && (
        <div className="file-modal-overlay">
          <div className="file-modal">
            <div className="file-modal-header">
              <h3>📁 文件操作</h3>
              <button className="file-modal-close" onClick={() => setFileModalVisible(false)}>×</button>
            </div>
            <div className="file-modal-content">
              <div className="file-actions">
                <button className="file-action-btn" onClick={() => handleFileOperation('open')}>
                  <span className="file-icon">📄</span>
                  <span className="file-action-text">打开文件</span>
                  <span className="file-action-desc">支持 .txt, .docx, .xlsx</span>
                </button>
                <button className="file-action-btn" onClick={() => handleFileOperation('save')}>
                  <span className="file-icon">💾</span>
                  <span className="file-action-text">保存文件</span>
                  <span className="file-action-desc">保存为 .txt 文件</span>
                </button>
                <button className="file-action-btn" onClick={() => handleFileOperation('export')}>
                  <span className="file-icon">📊</span>
                  <span className="file-action-text">导出数据</span>
                  <span className="file-action-desc">导出为 .xlsx 文件</span>
                </button>
              </div>
              <div className="file-info">
                <h4>支持的文件格式</h4>
                <ul className="file-formats">
                  <li>📄 文本文档 (.txt)</li>
                  <li>📝 Word文档 (.docx)</li>
                  <li>📊 Excel文档 (.xlsx)</li>
                </ul>
                <p className="file-hint">点击上方按钮进行相应的文件操作</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 保存设置弹窗 */}
      {saveModalVisible && (
        <div className="save-modal-overlay">
          <div className="save-modal">
            <div className="save-modal-header">
              <h3>💾 保存文件</h3>
              <button className="save-modal-close" onClick={() => setSaveModalVisible(false)}>×</button>
            </div>
            <div className="save-modal-content">
              <div className="save-form">
                <div className="form-item">
                  <label>文件名</label>
                  <input
                    type="text"
                    className="form-input"
                    value={saveFileName}
                    onChange={(e) => setSaveFileName(e.target.value)}
                    placeholder="请输入文件名"
                  />
                </div>
                <div className="form-item">
                  <label>文件格式</label>
                  <select
                    className="form-select"
                    value={saveFileFormat}
                    onChange={(e) => setSaveFileFormat(e.target.value)}
                  >
                    <option value="txt">文本文档 (.txt)</option>
                    <option value="docx">Word文档 (.docx)</option>
                    <option value="xlsx">Excel文档 (.xlsx)</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button className="btn-primary" onClick={handleSaveFile}>保存</button>
                  <button className="btn-secondary" onClick={() => setSaveModalVisible(false)}>取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* 全局变量 */
        :root {
          --primary-color: #6a5acd;
          --primary-light: #7b68ee;
          --primary-dark: #483d8b;
          --secondary-color: #9370db;
          --accent-color: #8a2be2;
          --success-color: #32cd32;
          --warning-color: #ffd700;
          --error-color: #ff6347;
          --text-primary: #333333;
          --text-secondary: #666666;
          --bg-primary: #ffffff;
          --bg-secondary: #f5f5f5;
          --bg-light: #e8e8e8;
          --border-radius: 8px;
          --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        /* 暗色模式变量 */
        .dark-mode {
          --primary-color: #9370db;
          --primary-light: #b0c4de;
          --primary-dark: #483d8b;
          --secondary-color: #9370db;
          --accent-color: #8a2be2;
          --success-color: #32cd32;
          --warning-color: #ffd700;
          --error-color: #ff6347;
          --text-primary: #f0f0f0;
          --text-secondary: #b0b0b0;
          --bg-primary: #2d2d2d;
          --bg-secondary: #3d3d3d;
          --bg-light: #4d4d4d;
          --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        /* 深色模式主容器背景 */
        .dark-mode {
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        }

        .dark-mode .text-reader-container {
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        }

        /* 深色模式导航栏 */
        .dark-mode .main-nav {
          background: linear-gradient(135deg, #483d8b, #3a3078);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .dark-mode .nav-btn {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #f0f0f0;
        }

        .dark-mode .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .dark-mode .nav-btn.active {
          background: white;
          color: #483d8b;
          border-color: white;
        }

        .dark-mode .theme-toggle {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #f0f0f0;
        }

        .dark-mode .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* 护眼模式变量 */
        .eye-protection-mode {
          --primary-color: #f0ad4e;
          --primary-light: #f5c578;
          --primary-dark: #d68a1c;
          --secondary-color: #f5c578;
          --accent-color: #f0ad4e;
          --success-color: #5cb85c;
          --warning-color: #f0ad4e;
          --error-color: #d9534f;
          --text-primary: #555555;
          --text-secondary: #777777;
          --bg-primary: #fff8e1;
          --bg-secondary: #fff3cd;
          --bg-light: #ffeaa7;
          --border-radius: 10px;
          --box-shadow: 0 2px 12px rgba(240, 173, 78, 0.15);
          --transition: all 0.3s ease;
        }

        /* 护眼模式导航栏 */
        .eye-protection-mode .main-nav {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
        }

        .eye-protection-mode .nav-brand h1 {
          color: var(--primary-color);
        }

        .eye-protection-mode .nav-subtitle {
          color: var(--text-secondary);
        }

        .eye-protection-mode .version-tag {
          color: var(--primary-color);
          background: var(--bg-secondary);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .nav-btn {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .eye-protection-mode .nav-btn:hover {
          background: var(--bg-light);
          border-color: var(--primary-color);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .eye-protection-mode .nav-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          box-shadow: 0 4px 8px rgba(138, 119, 201, 0.3);
        }

        .eye-protection-mode .theme-toggle {
          background: var(--bg-secondary);
          border-color: var(--primary-color);
          color: var(--primary-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .eye-protection-mode .theme-toggle:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(138, 119, 201, 0.3);
        }

        /* 基础样式 */
        .text-reader-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
          min-height: 100vh;
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        }

        /* 护眼模式特殊处理 */
        .eye-protection-mode {
          background: var(--bg-light);
        }

        .eye-protection-mode .text-reader-container {
          background: var(--bg-light);
        }

        .eye-protection-mode .text-display {
          background: var(--bg-secondary);
        }

        .eye-protection-mode .text-section {
          background: var(--bg-primary);
        }

        .eye-protection-mode .panel {
          background: var(--bg-primary);
        }

        .eye-protection-mode .stats-section {
          background: var(--bg-primary);
        }

        .eye-protection-mode .search-section {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
        }

        .eye-protection-mode .search-input {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
        }

        .eye-protection-mode .search-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(138, 119, 201, 0.1);
          background: var(--bg-primary);
        }

        .eye-protection-mode .search-btn {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 8px rgba(138, 119, 201, 0.3);
        }

        .eye-protection-mode .search-btn:hover {
          background: var(--primary-dark);
          box-shadow: 0 6px 12px rgba(138, 119, 201, 0.4);
        }

        .eye-protection-mode .clear-btn {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-secondary);
        }

        .eye-protection-mode .clear-btn:hover {
          background: var(--bg-light);
          color: var(--text-primary);
        }

        .eye-protection-mode .main-nav {
          background: var(--bg-primary);
        }

        .eye-protection-mode .character-card {
          background: var(--bg-primary);
        }

        .eye-protection-mode .context-menu {
          background: var(--bg-primary);
        }

        .eye-protection-mode .char-popup {
          background: var(--bg-primary);
        }

        .eye-protection-mode .practice-card {
          background: var(--bg-primary);
        }

        .eye-protection-mode .practice-history {
          background: var(--bg-primary);
        }

        .eye-protection-mode .stat-card {
          background: var(--bg-primary);
        }

        .eye-protection-mode .settings-section {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
        }

        /* 护眼模式按钮样式 */
        .eye-protection-mode .btn-primary {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 8px rgba(138, 119, 201, 0.3);
        }

        .eye-protection-mode .btn-primary:hover {
          background: var(--primary-dark);
          box-shadow: 0 6px 12px rgba(138, 119, 201, 0.4);
        }

        .eye-protection-mode .btn-secondary {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .eye-protection-mode .btn-secondary:hover {
          background: var(--bg-light);
          border-color: var(--primary-color);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .eye-protection-mode .btn-small {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
        }

        .eye-protection-mode .btn-small:hover {
          background: var(--bg-light);
          border-color: var(--primary-color);
        }

        .eye-protection-mode .btn-small.delete:hover {
          background: var(--error-color);
          color: white;
        }

        /* 护眼模式文本区域 */
        .eye-protection-mode .text-section {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
        }

        .eye-protection-mode .text-input {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
        }

        .eye-protection-mode .text-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(138, 119, 201, 0.1);
          background: var(--bg-primary);
        }

        .eye-protection-mode .text-display {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
        }

        /* 护眼模式面板样式 */
        .eye-protection-mode .panel {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .stats-section {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        /* 护眼模式练习区域 */
        .eye-protection-mode .practice-card {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .practice-history {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .option-btn {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
        }

        .eye-protection-mode .option-btn:hover {
          background: var(--bg-light);
          border-color: var(--primary-color);
        }

        .eye-protection-mode .btn-submit {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 8px rgba(138, 119, 201, 0.3);
        }

        .eye-protection-mode .btn-submit:hover {
          background: var(--primary-dark);
          box-shadow: 0 6px 12px rgba(138, 119, 201, 0.4);
        }

        .eye-protection-mode .btn-skip {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-primary);
        }

        .eye-protection-mode .btn-skip:hover {
          background: var(--bg-light);
          border-color: var(--primary-color);
        }

        /* 护眼模式生词库样式 */
        .eye-protection-mode .vocab-list {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .vocab-list-header {
          background: var(--bg-secondary);
          border-bottom-color: var(--bg-light);
          color: var(--text-primary);
        }

        .eye-protection-mode .vocab-item {
          border-bottom-color: var(--bg-light);
        }

        .eye-protection-mode .vocab-item:hover {
          background: var(--bg-secondary);
        }

        .eye-protection-mode .vocab-char {
          color: var(--primary-color);
        }

        .eye-protection-mode .vocab-pinyin {
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }

        .eye-protection-mode .vocab-meaning {
          color: var(--text-primary);
        }

        /* 护眼模式悬浮窗口 */
        .eye-protection-mode .char-popup {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .char-popup-header {
          border-bottom-color: var(--bg-light);
        }

        .eye-protection-mode .popup-char {
          color: var(--primary-color);
        }

        .eye-protection-mode .popup-pinyin {
          color: var(--accent-color);
        }

        .eye-protection-mode .popup-label {
          color: var(--text-secondary);
        }

        .eye-protection-mode .popup-word {
          background: rgba(138, 119, 201, 0.1);
          color: var(--primary-color);
          border-color: rgba(138, 119, 201, 0.2);
        }

        .eye-protection-mode .popup-sentence-text {
          color: var(--text-primary);
        }

        .eye-protection-mode .popup-detail-btn {
          background: var(--primary-color);
          color: white;
        }

        .eye-protection-mode .popup-detail-btn:hover {
          background: var(--primary-dark);
        }

        .eye-protection-mode .popup-close-btn {
          background: var(--bg-secondary);
          border-color: var(--bg-light);
          color: var(--text-secondary);
        }

        .eye-protection-mode .popup-close-btn:hover {
          background: var(--bg-light);
          color: var(--text-primary);
        }

        /* 护眼模式上下文菜单 */
        .eye-protection-mode .context-menu {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .context-menu-item {
          color: var(--text-primary);
        }

        .eye-protection-mode .context-menu-item:hover {
          background: var(--bg-secondary);
          color: var(--primary-color);
        }

        /* 护眼模式悬停悬浮窗 */
        .eye-protection-mode .hover-popup {
          background: var(--bg-primary);
          box-shadow: var(--box-shadow);
          border-color: var(--bg-light);
        }

        .eye-protection-mode .hover-char {
          color: var(--primary-color);
        }

        .eye-protection-mode .btn-add-to-vocab {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 2px 4px rgba(138, 119, 201, 0.3);
        }

        .eye-protection-mode .btn-add-to-vocab:hover {
          background: var(--primary-dark);
          box-shadow: 0 4px 8px rgba(138, 119, 201, 0.4);
        }

        /* 导航栏 */
        .main-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 24px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: var(--border-radius);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
          transition: var(--transition);
        }

        .nav-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .nav-brand h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .version-tag {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
          background: white;
          padding: 4px 12px;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          white-space: nowrap;
          margin-left: 8px;
        }

        .nav-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          margin: 5px 0 0 0;
          font-weight: 500;
        }

        .nav-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .nav-btn {
          padding: 12px 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--border-radius);
          background: rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
        }

        .nav-btn.active {
          background: white;
          color: #667eea;
          border-color: white;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .theme-toggle {
          padding: 12px 24px;
          border: 2px solid white;
          border-radius: 30px;
          background: white;
          color: #667eea;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        /* 搜索栏 */
        .search-section {
          background: var(--bg-primary);
          padding: 24px 30px;
          border-radius: var(--border-radius);
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
          align-items: center;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
        }

        .search-input {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid var(--bg-light);
          border-radius: var(--border-radius);
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
          background: var(--bg-secondary);
          transition: var(--transition);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.1);
          background: var(--bg-primary);
        }

        .search-btn, .clear-btn {
          padding: 14px 24px;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          border: none;
        }

        .search-btn:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .clear-btn {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 2px solid var(--bg-light);
        }

        .clear-btn:hover {
          background: var(--bg-light);
          color: var(--text-primary);
          transform: translateY(-2px);
        }

        .search-result {
          color: var(--success-color);
          font-weight: 600;
          margin-left: auto;
          font-size: 16px;
        }

        /* 主内容区 */
        .main-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .content-area {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        /* 文本区域 */
        .text-section {
          background: var(--bg-primary);
          padding: 30px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
        }

        .text-section:hover {
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--bg-light);
        }

        .section-header h2 {
          color: var(--text-primary);
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .input-label {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
          font-size: 16px;
          display: block;
        }

        .text-input {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid var(--bg-light);
          border-radius: var(--border-radius);
          font-size: 16px;
          font-weight: 500;
          resize: vertical;
          margin-bottom: 24px;
          color: var(--text-primary);
          background: var(--bg-secondary);
          transition: var(--transition);
        }

        .text-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.1);
          background: var(--bg-primary);
        }

        /* 文本显示区域 */
        .text-display {
          background: var(--bg-secondary);
          border-radius: var(--border-radius);
          padding: 36px;
          font-size: 24px;
          line-height: 1.8;
          min-height: 200px;
          color: var(--text-primary);
          position: relative;
          border: 2px solid var(--bg-light);
          transition: var(--transition);
        }

        .text-display:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        /* 高亮字符样式 */
        .highlighted-char {
          color: var(--primary-color);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: var(--transition);
          display: inline-block;
          margin: 0 2px;
          background: rgba(106, 90, 205, 0.1);
          border: 1px solid rgba(106, 90, 205, 0.2);
        }

        .highlighted-char:hover {
          background: rgba(106, 90, 205, 0.2);
          border-color: var(--primary-color);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(106, 90, 205, 0.3);
        }

        /* 音频图标样式 */
        .audio-icon {
          display: inline-block;
          margin-left: 8px;
          font-size: 14px;
          cursor: pointer;
          opacity: 0.7;
          transition: var(--transition);
          color: var(--text-secondary);
          background: var(--bg-light);
          padding: 2px 6px;
          border-radius: 12px;
        }

        .audio-icon:hover {
          opacity: 1;
          transform: scale(1.2);
          color: var(--primary-color);
          background: rgba(106, 90, 205, 0.1);
        }

        .highlighted-char:hover .audio-icon {
          opacity: 1;
        }

        /* 文本播放图标样式 */
        .text-audio-icon {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid var(--primary-color);
          background: var(--bg-primary);
          color: var(--primary-color);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(106, 90, 205, 0.2);
        }

        .text-audio-icon:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(106, 90, 205, 0.3);
        }

        /* 生字悬浮窗口 */
        .char-popup {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 16px;
          min-width: 250px;
          max-width: 300px;
          border: 2px solid var(--bg-light);
        }

        .char-popup-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--bg-light);
        }

        .popup-char {
          font-size: 32px;
          font-weight: bold;
          color: var(--primary-color);
          margin-right: 12px;
        }

        .popup-pinyin {
          font-size: 16px;
          color: var(--accent-color);
          font-weight: 500;
          font-family: 'Arial', 'Microsoft YaHei', sans-serif;
          word-break: keep-all;
          white-space: nowrap;
        }

        .char-popup-content {
          margin-bottom: 16px;
        }

        .popup-examples {
          margin-bottom: 12px;
        }

        .popup-label {
          font-weight: bold;
          color: var(--text-secondary);
          margin-right: 8px;
        }

        .popup-words {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .popup-word {
          background: rgba(106, 90, 205, 0.1);
          color: var(--primary-color);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 14px;
          border: 1px solid rgba(106, 90, 205, 0.2);
        }

        .dark-mode .popup-word {
          background: rgba(106, 90, 205, 0.2);
          color: var(--primary-light);
        }

        .popup-sentence {
          margin-top: 12px;
        }

        .popup-sentence-text {
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-primary);
          font-style: italic;
        }

        .char-popup-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--bg-light);
        }

        .popup-detail-btn,
        .popup-close-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .popup-detail-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .popup-detail-btn:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }

        .popup-close-btn {
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }

        .popup-close-btn:hover {
          background: var(--bg-light);
        }

        .dark-mode .popup-close-btn {
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }

        .dark-mode .popup-close-btn:hover {
          background: var(--bg-light);
        }

        /* 侧边栏 */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel {
          background: var(--bg-primary);
          padding: 25px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          border: 2px solid var(--bg-light);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panel-header h3 {
          color: var(--primary-color);
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .level-tabs {
          display: flex;
          gap: 5px;
        }

        .btn-vocab-book {
          padding: 8px 16px;
          border: 1px solid var(--primary-color);
          border-radius: 20px;
          background: var(--bg-primary);
          color: var(--primary-color);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-vocab-book:hover {
          background: var(--primary-color);
          color: white;
        }

        .level-tab {
          padding: 5px 10px;
          border: 1px solid var(--bg-light);
          border-radius: 5px;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .level-tab.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
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
          background: var(--bg-secondary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          border: 1px solid var(--bg-light);
        }

        .character-item.learned {
          background: #e8f5e9;
          border: 2px solid var(--success-color);
        }

        .character-item:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        .character-item.learned:hover {
          background: var(--success-color);
        }

        .check-mark {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 12px;
          color: var(--success-color);
          font-weight: bold;
        }

        .progress-hint {
          font-size: 12px;
          color: var(--text-secondary);
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
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 8px;
          background: var(--bg-primary);
          color: #667eea;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-practice:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: rgba(102, 126, 234, 0.5);
        }

        /* 统计区域 */
        .stats-section {
          background: var(--bg-primary);
          padding: 25px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          border: 2px solid var(--bg-light);
        }

        .stats-section h3 {
          color: var(--primary-color);
          margin-bottom: 20px;
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
          color: var(--text-secondary);
        }

        .stat-number {
          color: var(--primary-color);
          font-weight: bold;
        }

        /* 按钮样式 */
        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          border: none;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 2px solid var(--bg-light);
        }

        .btn-secondary:hover {
          background: var(--bg-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* 通用按钮样式 */
        button {
          transition: var(--transition);
          font-family: inherit;
        }

        button:hover {
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }

        /* 生词库样式 */
        .vocab-list {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          border: 2px solid var(--bg-light);
        }

        .vocab-list-header {
          display: grid;
          grid-template-columns: 1fr 1.5fr 3fr 1fr;
          gap: 16px;
          padding: 16px 20px;
          background: var(--bg-secondary);
          border-bottom: 2px solid var(--bg-light);
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
          align-items: center;
          text-align: center;
        }

        .vocab-item {
          display: grid;
          grid-template-columns: 1fr 1.5fr 3fr 1fr;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--bg-light);
          transition: var(--transition);
          align-items: center;
        }

        .vocab-item:hover {
          background: var(--bg-secondary);
          padding-left: 24px;
        }

        .vocab-item:last-child {
          border-bottom: none;
        }

        .vocab-char {
          font-size: 20px;
          font-weight: 600;
          color: var(--primary-color);
          text-align: center;
        }

        .vocab-pinyin {
          font-size: 14px;
          color: var(--text-secondary);
          font-style: italic;
          text-align: center;
          background: var(--bg-light);
          padding: 6px 12px;
          border-radius: 12px;
          font-family: 'Arial', 'Microsoft YaHei', sans-serif;
          word-break: keep-all;
          white-space: nowrap;
        }

        .vocab-meaning {
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.4;
          text-align: center;
        }

        .vocab-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .btn-small {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .btn-small:hover {
          background: var(--bg-light);
          transform: scale(1.1);
        }

        .btn-small.delete:hover {
          background: var(--error-color);
          color: white;
        }

        .empty-vocab {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 48px 32px;
          text-align: center;
          border: 2px solid var(--bg-light);
        }

        .empty-vocab p {
          margin: 8px 0;
          color: var(--text-secondary);
          font-size: 16px;
        }

        .empty-vocab p:first-child {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* 响应式设计 */
        @media (max-width: 1200px) {
          .content-area {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .sidebar {
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .panel {
            flex: 1;
            min-width: 300px;
          }
        }

        @media (max-width: 768px) {
          .text-reader-container {
            padding: 16px;
          }
          
          .main-nav {
            flex-direction: column;
            gap: 16px;
            padding: 20px;
          }
          
          .nav-actions {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .nav-btn {
            padding: 10px 16px;
            font-size: 14px;
          }
          
          .search-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .text-section {
            padding: 20px;
          }
          
          .text-display {
            padding: 24px;
            font-size: 20px;
          }
          
          .sidebar {
            flex-direction: column;
          }
          
          .panel {
            padding: 20px;
          }
          
          .character-grid {
            grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
            gap: 12px;
          }
          
          .character-item {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .nav-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .nav-btn {
            justify-content: center;
          }
          
          .text-display {
            padding: 20px;
            font-size: 18px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .header-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .level-tabs {
            justify-content: space-between;
          }
          
          .character-grid {
            grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
            gap: 10px;
          }
          
          .character-item {
            font-size: 18px;
          }
        }

        /* 动画效果 */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .char-popup, .context-menu, .hover-popup {
          animation: fadeIn 0.3s ease-out;
        }

        .panel, .text-section, .search-section {
          animation: slideIn 0.4s ease-out;
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

        /* 生词库样式 */
        .vocab-book-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .vocab-book-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .vocab-book-header h2 {
          color: #2b7cff;
          margin: 0;
        }

        .dark-mode .vocab-book-header h2 {
          color: #4a9eff;
        }

        .vocab-list {
          background: white;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .dark-mode .vocab-list {
          background: #2a2a2a;
        }

        .vocab-list-header {
          display: grid;
          grid-template-columns: 1fr 2fr 4fr 1fr;
          gap: 20px;
          padding: 15px 20px;
          background: #f8f9fa;
          font-weight: bold;
          border-bottom: 1px solid #e0e0e0;
        }

        .dark-mode .vocab-list-header {
          background: #333;
          border-bottom: 1px solid #444;
          color: #e0e0e0;
        }

        .vocab-item {
          display: grid;
          grid-template-columns: 1fr 2fr 4fr 1fr;
          gap: 20px;
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
          align-items: center;
        }

        .dark-mode .vocab-item {
          border-bottom: 1px solid #444;
          color: #e0e0e0;
        }

        .vocab-item:hover {
          background: #f8f9fa;
        }

        .dark-mode .vocab-item:hover {
          background: #333;
        }

        

        .dark-mode .btn-small {
          background: #2a2a2a;
          border-color: #444;
        }

        .dark-mode .btn-small:hover {
          background: #333;
        }

        .dark-mode .btn-small.delete:hover {
          background: #421a1a;
        }

        /* 悬停悬浮窗 */
        .hover-popup {
          position: fixed;
          z-index: 1001;
        }

        .hover-popup-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 12px;
          min-width: 150px;
        }

        .dark-mode .hover-popup-content {
          background: #2a2a2a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .hover-char {
          font-size: 24px;
          font-weight: bold;
          color: #2b7cff;
          margin-bottom: 8px;
          text-align: center;
        }

        .btn-add-to-vocab {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #2b7cff;
          border-radius: 20px;
          background: white;
          color: #2b7cff;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-add-to-vocab:hover {
          background: #2b7cff;
          color: white;
        }

        .dark-mode .btn-add-to-vocab {
          background: #2a2a2a;
          border-color: #4a9eff;
          color: #4a9eff;
        }

        .dark-mode .btn-add-to-vocab:hover {
          background: #4a9eff;
          color: white;
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
          align-items: center;
        }

        .audio-controls {
          display: flex;
          gap: 5px;
          background: #f0f4f8;
          padding: 5px;
          border-radius: 20px;
        }

        .dark-mode .audio-controls {
          background: #333;
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
          margin-bottom: 8px;
          align-items: center;
        }

        .info-label {
          font-weight: bold;
          color: #666;
          min-width: 80px;
        }

        .dark-mode .info-label {
          color: #bbb;
        }

        .radical {
          color: #4caf50;
          font-weight: bold;
        }

        .stroke-count {
          color: #ff9800;
          font-weight: bold;
        }

        .structure {
          color: #9c27b0;
          font-weight: bold;
        }

        .difficulty {
          color: #f44336;
          font-weight: bold;
        }

        .meaning-section,
        .strokes-section,
        .examples-section,
        .sentence-section {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .dark-mode .meaning-section,
        .dark-mode .strokes-section,
        .dark-mode .examples-section,
        .dark-mode .sentence-section {
          background: #1a1a1a;
        }

        .section-label {
          font-weight: bold;
          color: #666;
          margin-right: 10px;
        }

        .dark-mode .section-label {
          color: #bbb;
        }

        .meaning {
          line-height: 1.5;
        }

        .strokes {
          line-height: 1.5;
        }

        .examples {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }

        .example-word {
          background: #e3f2fd;
          color: #2b7cff;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
        }

        .dark-mode .example-word {
          background: #2a4a8a;
          color: #4a9eff;
        }

        .sentence {
          line-height: 1.5;
          font-style: italic;
        }

        .stroke-animation {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        /* 上下文菜单 */
        .context-menu {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 8px 0;
          min-width: 160px;
        }

        .dark-mode .context-menu {
          background: #2a2a2a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .context-menu-item {
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .context-menu-item:hover {
          background: #f0f4f8;
        }

        .dark-mode .context-menu-item {
          color: #e0e0e0;
        }

        .dark-mode .context-menu-item:hover {
          background: #333;
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
          color: #ff6b6b;
          font-size: 18px;
          font-weight: 500;
          font-family: 'Arial', 'Microsoft YaHei', sans-serif;
          word-break: keep-all;
          white-space: nowrap;
          transition: none !important;
        }

        .dark-mode .pinyin {
          color: #ff8e8e;
        }

        .eye-protection-mode .pinyin {
          color: #d63384;
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

        /* 登录窗口样式 */
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .login-modal {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          max-width: 400px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 2px solid var(--bg-light);
          animation: fadeIn 0.3s ease-out;
        }

        .login-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid var(--bg-light);
        }

        .login-modal-header h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 600;
        }

        .login-modal-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .login-modal-close:hover {
          background: var(--bg-light);
          color: var(--text-primary);
          transform: rotate(90deg);
        }

        .login-modal-content {
          padding: 24px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-item label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid var(--bg-light);
          border-radius: var(--border-radius);
          font-size: 16px;
          color: var(--text-primary);
          background: var(--bg-secondary);
          transition: var(--transition);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
          background: var(--bg-primary);
        }

        .login-message {
          padding: 12px;
          border-radius: var(--border-radius);
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          margin: 8px 0;
        }

        .login-message.success {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .login-message.error {
          background: rgba(244, 67, 54, 0.1);
          color: #f44336;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .form-actions button {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: var(--border-radius);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .form-actions .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .form-actions .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
        }

        .form-actions .btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 2px solid var(--bg-light);
        }

        .form-actions .btn-secondary:hover {
          background: var(--bg-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* 响应式登录窗口 */
        @media (max-width: 480px) {
          .login-modal {
            margin: 20px;
          }

          .login-modal-header,
          .login-modal-content {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        /* 文件操作弹窗样式 */
        .file-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .file-modal {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 2px solid var(--bg-light);
          animation: fadeIn 0.3s ease-out;
        }

        .file-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid var(--bg-light);
        }

        .file-modal-header h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 600;
        }

        .file-modal-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .file-modal-close:hover {
          background: var(--bg-light);
          color: var(--text-primary);
          transform: rotate(90deg);
        }

        .file-modal-content {
          padding: 24px;
        }

        .file-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .file-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border: 2px solid var(--bg-light);
          border-radius: var(--border-radius);
          background: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
        }

        .file-action-btn:hover {
          background: var(--bg-light);
          border-color: var(--primary-color);
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
        }

        .file-icon {
          font-size: 32px;
        }

        .file-action-text {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .file-action-desc {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .file-info {
          background: var(--bg-secondary);
          padding: 20px;
          border-radius: var(--border-radius);
          border: 2px solid var(--bg-light);
        }

        .file-info h4 {
          margin: 0 0 12px 0;
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 600;
        }

        .file-formats {
          margin: 0 0 16px 0;
          padding-left: 20px;
        }

        .file-formats li {
          margin-bottom: 8px;
          color: var(--text-primary);
          font-size: 14px;
        }

        .file-hint {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
          font-style: italic;
          text-align: center;
        }

        /* 响应式文件弹窗 */
        @media (max-width: 768px) {
          .file-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .file-modal {
            margin: 20px;
          }

          .file-modal-header,
          .file-modal-content {
            padding: 20px;
          }

          .file-action-btn {
            padding: 16px;
          }
        }

        /* 保存设置弹窗样式 */
        .save-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2001;
          padding: 20px;
        }

        .save-modal {
          background: var(--bg-primary);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 2px solid var(--bg-light);
          animation: fadeIn 0.3s ease-out;
        }

        .save-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid var(--bg-light);
        }

        .save-modal-header h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 600;
        }

        .save-modal-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .save-modal-close:hover {
          background: var(--bg-light);
          color: var(--text-primary);
          transform: rotate(90deg);
        }

        .save-modal-content {
          padding: 24px;
        }

        .save-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-select {
          padding: 12px 16px;
          border: 2px solid var(--bg-light);
          border-radius: var(--border-radius);
          font-size: 16px;
          color: var(--text-primary);
          background: var(--bg-secondary);
          transition: var(--transition);
        }

        .form-select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
          background: var(--bg-primary);
        }

        /* 响应式保存弹窗 */
        @media (max-width: 480px) {
          .save-modal {
            margin: 20px;
          }

          .save-modal-header,
          .save-modal-content {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        /* 自定义滑块样式 */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: none;
        }

        /* 护眼模式滑块样式 */
        .eye-protection-mode input[type="range"]::-webkit-slider-thumb {
          background: var(--primary-color);
        }

        .eye-protection-mode input[type="range"]::-moz-range-thumb {
          background: var(--primary-color);
        }

        /* 深色模式滑块样式 */
        .dark-mode input[type="range"]::-webkit-slider-thumb {
          background: var(--primary-color);
        }

        .dark-mode input[type="range"]::-moz-range-thumb {
          background: var(--primary-color);
        }
      `}</style>

      {/* 添加汉字弹窗 */}
      {addCharacterModalVisible && (
        <div className="overlay" onClick={() => setAddCharacterModalVisible(false)}>
          <div className="add-character-modal" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--box-shadow)',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            color: '#333'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 汉字输入 */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '16px',
                  fontWeight: '700'
                }}>汉字 *</label>
                <input 
                  type="text" 
                  value={newCharacter.char}
                  onChange={(e) => setNewCharacter({ ...newCharacter, char: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              {/* 拼音输入 */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '16px',
                  fontWeight: '700'
                }}>拼音 *</label>
                <input 
                  type="text" 
                  value={newCharacter.pinyin}
                  onChange={(e) => setNewCharacter({ ...newCharacter, pinyin: e.target.value })}
                  onKeyDown={handleAddCharacterPinyinInput}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              {/* 释义输入 */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '16px',
                  fontWeight: '700'
                }}>释义</label>
                <textarea 
                  value={newCharacter.meaning}
                  onChange={(e) => setNewCharacter({ ...newCharacter, meaning: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              {/* 笔顺输入 */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '16px',
                  fontWeight: '700'
                }}>笔顺</label>
                <input 
                  type="text" 
                  value={newCharacter.strokes}
                  onChange={(e) => setNewCharacter({ ...newCharacter, strokes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              {/* 例词输入 */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '16px',
                  fontWeight: '700'
                }}>例词 (逗号分隔)</label>
                <input 
                  type="text" 
                  placeholder="例如：学生,学校,学习"
                  value={newCharacter.examples}
                  onChange={(e) => setNewCharacter({ ...newCharacter, examples: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '16px',
                    color: '#666'
                  }}
                />
              </div>
              
              {/* 级别、分类、难度 */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {/* 级别 */}
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>级别</label>
                  <select 
                    value={newCharacter.level}
                    onChange={(e) => setNewCharacter({ ...newCharacter, level: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '16px'
                    }}
                  >
                    <option>1级</option>
                    <option>2级</option>
                    <option>3级</option>
                    <option>4级</option>
                    <option>5级</option>
                  </select>
                </div>
                
                {/* 分类 */}
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>分类</label>
                  <select 
                    value={newCharacter.category}
                    onChange={(e) => setNewCharacter({ ...newCharacter, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '16px'
                    }}
                  >
                    <option>基础汉字</option>
                    <option>常用汉字</option>
                    <option>扩展汉字</option>
                    <option>专业汉字</option>
                  </select>
                </div>
                
                {/* 难度 */}
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '16px',
                    fontWeight: '700'
                  }}>难度</label>
                  <select 
                    value={newCharacter.difficulty}
                    onChange={(e) => setNewCharacter({ ...newCharacter, difficulty: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '16px'
                    }}
                  >
                    <option>简单</option>
                    <option>中等</option>
                    <option>困难</option>
                  </select>
                </div>
              </div>
              
              {/* 按钮 */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                marginTop: '8px'
              }}>
                <button 
                  style={{
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#666',
                    background: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onClick={() => {
                    setAddCharacterModalVisible(false);
                    // 重置表单
                    setNewCharacter({
                      char: '',
                      pinyin: '',
                      meaning: '',
                      strokes: '',
                      examples: '',
                      level: '1级',
                      category: '基础汉字',
                      difficulty: '简单'
                    });
                  }}
                >
                  取消
                </button>
                <button 
                  style={{
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'white',
                    background: '#4CAF50',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onClick={() => {
                    // 添加汉字的逻辑
                    console.log('添加汉字:', newCharacter);
                    
                    // 将新汉字添加到用户添加的汉字列表中
                    setUserCharacters(prev => [...prev, newCharacter]);
                    
                    // 关闭弹窗并重置表单
                    setAddCharacterModalVisible(false);
                    setNewCharacter({
                      char: '',
                      pinyin: '',
                      meaning: '',
                      strokes: '',
                      examples: '',
                      level: '1级',
                      category: '基础汉字',
                      difficulty: '简单'
                    });
                    
                    // 添加成功提示
                    alert('汉字添加成功！');
                  }}
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}