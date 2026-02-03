# 你画我猜网页游戏 (Guess the Drawing Game)

这是一个基于网页的你画我猜游戏，玩家可以在画布上作画，系统会尝试识别并猜测玩家画的内容。

## 项目功能

- **绘画功能**：支持在Canvas上自由绘画，可调节画笔颜色和大小
- **橡皮擦功能**：可以擦除画布上的内容
- **AI猜画**：系统会尝试识别玩家的绘画内容并返回猜测结果
- **计分系统**：记录得分、用时和连击数
- **多轮游戏**：支持多轮游戏，每轮随机生成新的词语

## 技术栈

### 前端
- HTML5 Canvas
- CSS3
- JavaScript

### 后端
- Node.js
- Express
- CORS

## 项目结构

```
guess-the-drawing/
├── frontend/
│   ├── index.html          # 游戏主页面
│   ├── css/
│   │   └── style.css       # 样式文件
│   ├── js/
│   │   ├── main.js         # 主逻辑
│   │   ├── canvas.js       # 画布操作
│   │   └── game.js         # 游戏逻辑
│   └── assets/
│       └── words.json      # 词语库
├── backend/
│   ├── server.js           # Express服务器
│   ├── package.json        # 后端依赖
│   └── models/
│       └── ai-model.js     # AI模型集成
└── README.md               # 项目说明
```

## 快速开始

### 前端
1. 进入 `frontend` 目录
2. 直接在浏览器中打开 `index.html` 文件

### 后端
1. 进入 `backend` 目录
2. 安装依赖：`npm install`
3. 启动服务器：`npm start`
4. 服务器将运行在 `http://localhost:3001`

## API接口

- **GET /api/word**：获取随机词语
- **POST /api/guess**：提交画作并获取AI猜测结果
- **GET /api/health**：健康检查

## 游戏规则

1. 系统会随机生成一个词语
2. 玩家在画布上画出这个词语
3. 点击"提交画作"按钮
4. 系统会返回AI的猜测结果
5. 如果AI猜对了，点击"下一轮"开始新游戏
6. 尽量在短时间内让AI猜对，获得更高的分数！

## 注意事项

- 本项目使用模拟的AI猜测功能，实际项目中可以集成真实的AI模型（如TensorFlow.js）
- 前端默认使用本地模拟数据，如需使用后端API，请修改 `game.js` 文件中的相关代码

## 未来计划

- 集成真实的AI绘画识别模型
- 添加多人对战功能
- 实现游戏记录和排行榜
- 优化移动端体验
- 添加更多绘画工具和效果

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License