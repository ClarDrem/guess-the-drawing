class Canvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.currentColor = '#000000';
        this.currentSize = 5;
        this.currentTool = 'brush';
        this.setupEventListeners();
        this.clearCanvas();
    }

    setupEventListeners() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });

        // 工具按钮事件
        document.getElementById('brushBtn').addEventListener('click', () => this.setTool('brush'));
        document.getElementById('eraserBtn').addEventListener('click', () => this.setTool('eraser'));
        document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());

        // 颜色选择事件
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.style.backgroundColor;
                this.setColor(color);
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 画笔大小事件
        document.getElementById('brushSize').addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            this.setSize(size);
            document.getElementById('sizeValue').textContent = size;
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(currentX, currentY);
        
        if (this.currentTool === 'eraser') {
            this.ctx.strokeStyle = '#fafafa';
            this.ctx.lineWidth = this.currentSize * 2;
        } else {
            this.ctx.strokeStyle = this.currentColor;
            this.ctx.lineWidth = this.currentSize;
        }

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();

        this.lastX = currentX;
        this.lastY = currentY;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    setTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${tool}Btn`).classList.add('active');
    }

    setColor(color) {
        this.currentColor = color;
        this.currentTool = 'brush';
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('brushBtn').classList.add('active');
    }

    setSize(size) {
        this.currentSize = size;
    }

    clearCanvas() {
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getImageData() {
        return this.canvas.toDataURL('image/png');
    }

    setImageData(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
                resolve();
            };
            img.src = dataUrl;
        });
    }
}