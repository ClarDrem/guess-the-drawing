const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

// Kimi API配置
const KIMI_API_KEY = 'sk-U01vHX3koKchyJP1KBYZdjxJpr9hYA8wAirxpwwe2kV1OPGj';
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 词语库
const words = [
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

// API接口

// 获取随机词语
app.get('/api/word', (req, res) => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    res.json({ word: randomWord });
});

// 处理画作提交和AI猜测
app.post('/api/guess', async (req, res) => {
    const { imageData, word } = req.body;
    
    try {
        // 使用Kimi API进行图像识别
        const guesses = await getKimiGuess(imageData);
        const isCorrect = guesses.some(guess => 
            guess.toLowerCase().includes(word.toLowerCase()) || 
            word.toLowerCase().includes(guess.toLowerCase())
        );
        
        res.json({ 
            guesses, 
            isCorrect 
        });
    } catch (error) {
        console.error('Kimi API调用失败:', error);
        // 失败时回退到模拟猜测
        const guesses = generateRandomGuesses(word);
        const isCorrect = guesses.includes(word);
        
        res.json({ 
            guesses, 
            isCorrect 
        });
    }
});

// 使用Kimi API进行图像识别
async function getKimiGuess(imageData) {
    const response = await fetch(KIMI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KIMI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'moonshot-v1-8k',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: '请识别这张图片画的是什么物体，用中文回答，只需要说出物体名称，不要有其他描述。'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageData
                            }
                        }
                    ]
                }
            ],
            temperature: 0.3,
            max_tokens: 50
        })
    });
    
    const data = await response.json();
    const guess = data.choices[0].message.content.trim();
    // 返回猜测结果，确保至少有一个结果
    return [guess];
}

// 生成随机猜测结果（备用）
function generateRandomGuesses(targetWord) {
    // 70%的概率包含正确答案
    const includeCorrect = Math.random() < 0.7;
    const guesses = [];
    
    if (includeCorrect) {
        guesses.push(targetWord);
    }
    
    // 生成其他随机猜测
    while (guesses.length < 5) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        if (!guesses.includes(randomWord)) {
            guesses.push(randomWord);
        }
    }
    
    // 打乱顺序
    return guesses.sort(() => Math.random() - 0.5);
}

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('API endpoints:');
    console.log('GET  /api/word         - Get a random word');
    console.log('POST /api/guess        - Submit drawing for AI guess');
    console.log('GET  /api/health       - Health check');
});