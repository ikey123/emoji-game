class EmojiGame {
  constructor(gameType) {
    this.gameType = gameType;
    this.currentPuzzleIndex = 0;
    this.score = 0;
  }

  start() {
    const gameArea = document.getElementById('gameArea');
    
    // 保存游戏卡片以便返回
    this.originalContent = gameArea.innerHTML;
    
    // 根据游戏类型显示不同的游戏界面
    switch(this.gameType.title) {
      case "Christmas Emoji Game":
        this.showQuizGame(gameArea);
        break;
      case "Movie Emoji Quiz":
        this.showQuizGame(gameArea);
        break;
      case "Emoji Kitchen":
        this.showKitchenGame(gameArea);
        break;
    }
  }

  showQuizGame(gameArea) {
    gameArea.innerHTML = `
      <div class="game-interface">
        <div class="game-header">
          <h2>${this.gameType.title}</h2>
          <button class="back-button" onclick="backToGames()">Back to Games</button>
        </div>
        <div class="emoji-display">${this.gameType.puzzles[this.currentPuzzleIndex].emoji}</div>
        <div class="game-controls">
          <input type="text" class="answer-input" id="answerInput" 
                 placeholder="Type your answer..." autocomplete="off">
          <button class="submit-answer" onclick="checkAnswer()">Submit</button>
        </div>
        <div class="score-display">
          Score: ${this.score} | Question ${this.currentPuzzleIndex + 1}/${this.gameType.puzzles.length}
        </div>
      </div>
    `;
    document.getElementById('answerInput').focus();
  }

  showKitchenGame(gameArea) {
    gameArea.innerHTML = `
      <div class="game-interface">
        <div class="game-header">
          <h2>Emoji Kitchen</h2>
          <button class="back-button" onclick="backToGames()">Back to Games</button>
        </div>
        <div class="emoji-mixer">
          <select id="emoji1" onchange="mixEmojis()">
            ${this.getEmojiOptions()}
          </select>
          <span class="plus">+</span>
          <select id="emoji2" onchange="mixEmojis()">
            ${this.getEmojiOptions()}
          </select>
        </div>
        <div class="mix-result" id="mixResult">
          Choose emojis to mix!
        </div>
      </div>
    `;
  }

  getEmojiOptions() {
    return this.gameType.emojis.map(e => 
      `<option value="${e}">${e}</option>`
    ).join('');
  }

  checkAnswer(userAnswer) {
    const currentPuzzle = this.gameType.puzzles[this.currentPuzzleIndex];
    const isCorrect = userAnswer.toLowerCase().trim() === currentPuzzle.answer.toLowerCase();
    
    if (isCorrect) {
      this.score++;
      alert('Correct! 🎉');
    } else {
      alert(`Wrong! The answer was: ${currentPuzzle.answer}`);
    }

    this.currentPuzzleIndex++;
    if (this.currentPuzzleIndex < this.gameType.puzzles.length) {
      this.showQuizGame(document.getElementById('gameArea'));
    } else {
      alert(`Game Over! Final Score: ${this.score}/${this.gameType.puzzles.length}`);
      this.backToGames();
    }
  }

  mixEmojis() {
    const emoji1 = document.getElementById('emoji1').value;
    const emoji2 = document.getElementById('emoji2').value;
    const result = this.gameType.getMixResult(emoji1, emoji2);
    document.getElementById('mixResult').textContent = result || "These emojis can't be mixed!";
  }

  backToGames() {
    document.getElementById('gameArea').innerHTML = this.originalContent;
  }
}

// 游戏数据
const games = {
  christmas: {
    title: "Christmas Emoji Game",
    puzzles: [
      {emoji: "🎅🏠🎄", answer: "home alone"},
      {emoji: "❄️👸🎵", answer: "frozen"},
      {emoji: "🎄👻🎁", answer: "nightmare before christmas"}
    ]
  },
  movie: {
    title: "Movie Emoji Quiz",
    puzzles: [
      {emoji: "🦁👑", answer: "lion king"},
      {emoji: "🚢💘💔", answer: "titanic"},
      {emoji: "🧙‍♂️💍", answer: "lord of the rings"}
    ]
  },
  kitchen: {
    title: "Emoji Kitchen",
    emojis: ["😀", "😢", "❤️", "🔥", "🌞", "🌙", "🐱", "🐶"],
    getMixResult: function(emoji1, emoji2) {
      const combinations = {
        "😀😢": "🤣",
        "❤️🔥": "💝",
        "🌞🌙": "🌓",
        "🐱🐶": "🐩"
      };
      return combinations[emoji1 + emoji2] || combinations[emoji2 + emoji1];
    }
  }
};

// 在 games 对象后添加分类数据
const categories = {
    christmas: {
        title: "Christmas Games",
        puzzles: [
            {emoji: "🎅🎁", answer: "santa gifts"},
            {emoji: "🦌🔴", answer: "rudolph"},
            {emoji: "🎄⭐", answer: "christmas tree"}
        ]
    },
    movie: {
        title: "Movie Games",
        puzzles: [
            {emoji: "🧙‍♂️⚡👓", answer: "harry potter"},
            {emoji: "🦖🏃‍♂️", answer: "jurassic park"},
            {emoji: "👻👻🚫", answer: "ghostbusters"}
        ]
    },
    quiz: {
        title: "Quiz Games",
        puzzles: [
            {emoji: "🎵🎹", answer: "music quiz"},
            {emoji: "🌍🗺️", answer: "geography quiz"},
            {emoji: "🎬🎭", answer: "movie quiz"}
        ]
    },
    party: {
        title: "Party Games",
        puzzles: [
            {emoji: "🎲🎯", answer: "board games"},
            {emoji: "🎤🎵", answer: "karaoke"},
            {emoji: "🎨🖼️", answer: "pictionary"}
        ]
    }
};

let currentGame = null;

function startGame(type) {
  currentGame = new EmojiGame(games[type]);
  currentGame.start();
}

function checkAnswer() {
  const userAnswer = document.getElementById('answerInput').value;
  currentGame.checkAnswer(userAnswer);
}

function mixEmojis() {
  currentGame.mixEmojis();
}

function backToGames() {
  currentGame.backToGames();
}

// 添加键盘事件处理
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && currentGame) {
    const answerInput = document.getElementById('answerInput');
    if (answerInput && document.activeElement === answerInput) {
      checkAnswer();
    }
  }
});

// 修改 navigateToCategory 函数
function navigateToCategory(category) {
    const gameArea = document.getElementById('gameArea');
    const categoriesSection = document.querySelector('.categories');
    
    // 保存原始内容
    const originalContent = {
        gameArea: gameArea.innerHTML,
        categories: categoriesSection.innerHTML
    };

    // 显示分类游戏
    gameArea.innerHTML = `
        <div class="category-games">
            <div class="game-interface">
                <div class="game-header">
                    <h2>${categories[category].title}</h2>
                    <button class="back-button" onclick="restoreCategories('${category}')">Back</button>
                </div>
                <div class="category-games-grid">
                    ${getCategoryGames(category)}
                </div>
            </div>
        </div>
    `;

    // 隐藏分类部分
    categoriesSection.style.display = 'none';

    // 保存状态
    window.categoryState = {
        originalContent,
        currentCategory: category
    };
}

// 添加辅助函数
function getCategoryGames(category) {
    const games = categories[category].puzzles;
    return games.map(game => `
        <div class="category-game-card" onclick="playPuzzle('${category}', '${game.emoji}', '${game.answer}')">
            <div class="emoji-preview">${game.emoji}</div>
            <button class="play-button">Play Now</button>
        </div>
    `).join('');
}

function playPuzzle(category, emoji, answer) {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="game-interface">
            <div class="game-header">
                <h2>${categories[category].title}</h2>
                <button class="back-button" onclick="backToCategory('${category}')">Back to Games</button>
            </div>
            <div class="emoji-display">${emoji}</div>
            <div class="game-controls">
                <input type="text" class="answer-input" id="answerInput" 
                       placeholder="Type your answer..." autocomplete="off">
                <button class="submit-answer" onclick="checkCategoryAnswer('${answer}')">Submit</button>
            </div>
        </div>
    `;
    document.getElementById('answerInput').focus();
}

function checkCategoryAnswer(correctAnswer) {
    const userAnswer = document.getElementById('answerInput').value.toLowerCase().trim();
    if (userAnswer === correctAnswer.toLowerCase()) {
        alert('Correct! 🎉');
    } else {
        alert(`Wrong! The answer was: ${correctAnswer}`);
    }
    backToCategory(window.categoryState.currentCategory);
}

function backToCategory(category) {
    navigateToCategory(category);
}

function restoreCategories(category) {
    if (window.categoryState) {
        const gameArea = document.getElementById('gameArea');
        const categoriesSection = document.querySelector('.categories');
        
        gameArea.innerHTML = window.categoryState.originalContent.gameArea;
        categoriesSection.innerHTML = window.categoryState.originalContent.categories;
        categoriesSection.style.display = 'block';
        
        window.categoryState = null;
    }
}
