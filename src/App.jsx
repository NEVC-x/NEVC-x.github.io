import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Book, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { LearningProvider, useLearning } from './stores/LearningContext';
import TextDisplay from './components/TextDisplay';
import CharacterPopover from './components/CharacterPopover';
import VocabBook from './components/VocabBook';
import SettingsPanel from './components/SettingsPanel';
import { LearningProgressCard, ProgressStep } from './components/ProgressBar';
import { CHARACTER_DICTIONARY } from './data/dictionary';
import './App.css';

// 内部组件：使用 Context
const AppContent: React.FC = () => {
  const {
    currentView,
    selectedCharacter,
    setSelectedCharacter,
    searchQuery,
    setSearchQuery,
    collectedCharacters,
    masteredCharacters,
  } = useLearning();

  // 获取当前选中的生字数据
  const selectedCharData = selectedCharacter
    ? CHARACTER_DICTIONARY[selectedCharacter]
    : null;

  // 处理生字点击
  const handleCharacterClick = (char: string) => {
    setSelectedCharacter(char);
  };

  // 处理生字弹窗关闭
  const handlePopoverClose = () => {
    setSelectedCharacter(null);
  };

  // 导航选项
  const navItems = [
    { id: 'reader', label: '阅读', icon: <BookOpen size={20} /> },
    { id: 'vocab', label: '生字本', icon: <Book size={20} /> },
    { id: 'stats', label: '统计', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: '设置', icon: <SettingsIcon size={20} /> },
  ];

  // 学习步骤进度
  const learningSteps = [
    { label: '阅读课文', completed: true },
    { label: '学习生字', completed: true, current: true },
    { label: '练习书写', completed: false },
    { label: '掌握巩固', completed: false },
  ];

  return (
    <div className="app-container">
      {/* 导航栏 */}
      <nav className="app-nav">
        <div className="nav-brand">
          <BookOpen className="nav-icon text-primary" size={28} />
          <div>
            <h1 className="nav-title">随文识字</h1>
            <p className="nav-subtitle">智能汉字学习平台</p>
          </div>
        </div>

        <div className="nav-menu">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                // 使用 LearningProvider 中的方法切换视图
                // 这里暂时不实现，因为需要从 Context 获取方法
              }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="app-main">
        <AnimatePresence mode="wait">
          {currentView === 'reader' && (
            <motion.div
              key="reader"
              className="view-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="content-grid">
                <div className="content-main">
                  <TextDisplay
                    text="我学京剧。京剧很好看。我跟老师学唱戏。"
                    dictionary={CHARACTER_DICTIONARY}
                    onTextChange={() => {}}
                    onCharacterClick={handleCharacterClick}
                    showSearch={true}
                  />
                </div>

                <div className="content-sidebar">
                  <LearningProgressCard
                    title="学习进度"
                    total={Object.keys(CHARACTER_DICTIONARY).length}
                    completed={masteredCharacters.size}
                    color="primary"
                  />

                  <ProgressStep steps={learningSteps} />
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'vocab' && (
            <motion.div
              key="vocab"
              className="view-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VocabBook
                dictionary={CHARACTER_DICTIONARY}
                onCharacterClick={handleCharacterClick}
              />
            </motion.div>
          )}

          {currentView === 'stats' && (
            <motion.div
              key="stats"
              className="view-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stats-container">
                <h2 className="page-title">学习统计</h2>
                <div className="stats-grid-full">
                  <LearningProgressCard
                    title="总学习进度"
                    total={Object.keys(CHARACTER_DICTIONARY).length}
                    completed={masteredCharacters.size}
                    color="primary"
                  />
                  <LearningProgressCard
                    title="收藏生字"
                    total={Object.keys(CHARACTER_DICTIONARY).length}
                    completed={collectedCharacters.size}
                    color="warning"
                  />
                  <LearningProgressCard
                    title="已掌握"
                    total={100}
                    completed={masteredCharacters.size}
                    color="success"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div
              key="settings"
              className="view-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 生字详情弹窗 */}
      <AnimatePresence>
        {selectedCharacter && selectedCharData && (
          <CharacterPopover
            character={selectedCharacter}
            data={selectedCharData}
            isOpen={true}
            onClose={handlePopoverClose}
            isCollected={collectedCharacters.has(selectedCharacter)}
            isMastered={masteredCharacters.has(selectedCharacter)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * App - 主应用组件
 * 包含整个应用的布局和路由逻辑
 */
const App: React.FC = () => {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
};

export default App;
