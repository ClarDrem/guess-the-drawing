class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.score = 0;
        this.time = 0;
        this.combo = 0;
        this.startTime = 0;
        this.currentWord = '';
        this.isGameActive = false;
        this.words = [
            '苹果', '香蕉', '橙子', '葡萄', '西瓜',
            '猫', '狗', '兔子', '大象', '长颈鹿',
            '汽车', '飞机', '火车', '轮船', '自行车',
            '房子', '树', '花', '太阳', '月亮',
            '星星', '雨伞', '手表', '手机', '电脑',
            '书本', '铅笔', '书包', '足球', '篮球',
            '飞机', '火箭', '飞船', '卫星', '宇航员',
            '鱼', '鸟', '蝴蝶', '蜜蜂', '蚂蚁',
            '雪人', '雨伞', '帽子', '鞋子', '衣服',
            '眼镜', '钥匙', '钱包', '杯子', '盘子'
        ];
        this.setupEventListeners();
        this.startNewRound();
    }

    setupEventListeners() {
        document.getElementById('submitBtn').addEventListener('click', () => this.submitDrawing());
        document.getElementById('nextBtn').addEventListener('click', () => this.startNewRound());
    }

    startNewRound() {
        this.currentWord = this.getRandomWord();
        document.getElementById('targetWord').textContent = this.currentWord;
        this.canvas.clearCanvas();
        this.startTime = Date.now();
        this.isGameActive = true;
        document.getElementById('aiGuess').textContent = '等待提交...';
        document.getElementById('nextBtn').disabled = true;
        this.updateTimer();
    }

    getRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.words.length);
        return this.words[randomIndex];
    }

    submitDrawing() {
        if (!this.isGameActive) return;

        const imageData = this.canvas.getImageData();
        this.simulateAIGuess(imageData);
    }

    simulateAIGuess(imageData) {
        // 模拟AI猜测（实际项目中会调用后端API）
        setTimeout(() => {
            const guesses = this.generateRandomGuesses();
            const formattedGuesses = guesses.map((guess, index) => `${index + 1}. ${guess}`).join('\n');
            document.getElementById('aiGuess').textContent = formattedGuesses;

            // 检查是否猜对
            const isCorrect = guesses.includes(this.currentWord);
            if (isCorrect) {
                this.handleCorrectGuess();
            } else {
                this.handleIncorrectGuess();
            }
        }, 1000);
    }

    generateRandomGuesses() {
        // 生成随机猜测结果，包含当前词语的概率为70%
        const includeCorrect = Math.random() < 0.7;
        const guesses = [];
        
        if (includeCorrect) {
            guesses.push(this.currentWord);
        }

        // 生成其他随机猜测
        while (guesses.length < 5) {
            const randomWord = this.getRandomWord();
            if (!guesses.includes(randomWord)) {
                guesses.push(randomWord);
            }
        }

        // 打乱顺序
        return guesses.sort(() => Math.random() - 0.5);
    }

    handleCorrectGuess() {
        this.isGameActive = false;
        this.combo++;
        
        // 计算得分（基础分 + 时间奖励 + 连击奖励）
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, 10 - Math.floor(elapsedTime / 2));
        const comboBonus = Math.max(0, this.combo - 1) * 2;
        const roundScore = 1 + timeBonus + comboBonus;
        
        this.score += roundScore;
        this.time += elapsedTime;

        // 更新UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('time').textContent = `${Math.round(this.time)}s`;
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('nextBtn').disabled = false;

        // 显示猜对的消息
        const aiGuessElement = document.getElementById('aiGuess');
        aiGuessElement.innerHTML += '<br><br><span style="color: green; font-weight: bold;">猜对了！</span>';
    }

    handleIncorrectGuess() {
        // 猜错了，重置连击
        this.combo = 0;
        document.getElementById('combo').textContent = '0';

        // 显示猜错的消息
        const aiGuessElement = document.getElementById('aiGuess');
        aiGuessElement.innerHTML += '<br><br><span style="color: red; font-weight: bold;">猜错了，再试一次！</span>';
    }

    updateTimer() {
        if (!this.isGameActive) return;

        const elapsedTime = (Date.now() - this.startTime) / 1000;
        document.getElementById('time').textContent = `${Math.round(elapsedTime)}s`;
        requestAnimationFrame(() => this.updateTimer());
    }

    getScore() {
        return this.score;
    }

    getTime() {
        return this.time;
    }

    getCombo() {
        return this.combo;
    }
}