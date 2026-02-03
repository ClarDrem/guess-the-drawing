// 游戏入口点
window.addEventListener('DOMContentLoaded', () => {
    // 初始化Canvas
    const canvas = new Canvas('drawingCanvas');
    
    // 初始化游戏
    const game = new Game(canvas);
    
    console.log('你画我猜游戏初始化完成！');
    console.log('游戏规则：');
    console.log('1. 查看顶部的目标词语');
    console.log('2. 在画布上画出这个词语');
    console.log('3. 点击"提交画作"按钮');
    console.log('4. AI会尝试猜测你画的内容');
    console.log('5. 如果AI猜对，点击"下一轮"开始新游戏');
    console.log('6. 尽量在短时间内让AI猜对，获得更高分数！');
});