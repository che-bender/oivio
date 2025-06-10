// 随机，随机范围：比如将随机颜色控制在红色系。

class cell {
    constructor(x,y,radius=3) {
        this.x = x;
        this.y = y;
        this.type = 'living'
        this.radius = radius;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    setArea(area) {
        this.area = area;
    }
    random() {
        //this.radius = Math.floor(Math.random() * 3);
        this.radius = Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 0;
    }
    growUp() {
        this.radius = this.radius + 1;
        if (this.radius > 5) {
            this.radius = Math.floor(Math.random() * 2) ;
        }
    }
    growDown() {
        this.radius = this.radius - 1;
        if (this.radius < 1) {
            this.radius = Math.random() < 0.15 ? Math.floor(Math.random() * 2) : 0;
        }
    } 
    growAround() {
        let x = this.x;
        let y = this.y;
        let value = 0;
        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                if (i == y && j == x) {
                    continue;
                }
                if (i >= 0 && i < this.area.height && j >= 0 && j < this.area.width) {
                    //this.area.matrix[i][j].growUp();
                    value = value + this.area.matrix[i][j].radius;
                }
            }
        }
        if (value < 10) {
            this.growDown();
        } else if (value >= 10 && value <=18) {
            this.growUp();
        } else {
            this.growDown();
        }
    }
}

class Area {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    init() {
        let x = this.width;
        let y = this.height;
        let arr = new Array(y);
        for (let i = 0; i < y; i++) {
            //arr[i] = new Array(x).fill(new cell());
            arr[i] = Array.from({length: x}, (_, j) => new cell(j, i));
            for (let j = 0; j < x; j++) {
                arr[i][j].setArea(this);
            }
        }
        this.matrix = arr; 
        console.log(">>>>>>>>>>matrix",this.matrix);       
    }
    forEachCell(func) {
        const flattenedMatrix = this.matrix.flat();
        const shuffledMatrix = flattenedMatrix;
        //const shuffledMatrix = flattenedMatrix.sort(() => Math.random() - 0.5);
        shuffledMatrix.forEach(cell => func(cell));
    }    

    action(canvas){
        console.log("action");
        this.forEachCell((c) => {
            c.growAround();
        });

        this.draw(canvas);
    }

    draw(canvas) {
        let alphaArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
        // cell 的间距为10
        let spacing = 10;
        // 设置canvas的背景颜色为#041334
        canvas.style.backgroundColor = '#041334';
        // 获取canvas的上下文
        const context = canvas.getContext('2d');
        // 设置圆的填充颜色
        context.fillStyle = '#00EE00';
    
        // 清除画布
        context.clearRect(0, 0, canvas.width, canvas.height);
        //console.log("matrix",this.matrix);
        // 绘制N行，M列个圆
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let c = this.matrix[i][j];
                // 设置圆的透明度为一个随机值
                context.globalAlpha = alphaArray[c.radius];
                // 绘制圆
                context.beginPath();
                // 圆心的x坐标为15 * (j + 1)，y坐标为15 * (i + 1)，因为圆心间距为15
                // 设置圆的半径为5到10之间的随机数
                let r = c.radius;
                let w = spacing;
                //console.log("r",r);
                context.arc(w * (j + 1), w * (i + 1), r, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
        }
    }
}
function drawCircle(N, M) {
    let area = new Area(10, 10, N, M);
    area.init();
    area.forEachCell((c) => {
        c.random();
    });

    // 获取canvas元素
    const canvas = document.getElementById('canvassample');

    // 设置定时器，实现呼吸灯效果
    var a = setInterval(() => {
        area.action(canvas);
    }, 300);

    return a;   
}
function RecordA() {
    const canvas = document.getElementById('canvassample');
    const stream = canvas.captureStream();
    const options = { mimeType: 'video/webm; codecs=vp9', bitsPerSecond: 510000 }; // 增加bitsPerSecond属性
    const mediaRecorder = new MediaRecorder(stream, options);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            chunks.push(e.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'canvas_animation.mp4';
        a.click();
        URL.revokeObjectURL(url);
        console.log("stop");
        console.log("url",url);
    };

    mediaRecorder.start();

    return mediaRecorder;
}

var stop_flg = false;
var a,r;
$(function(){
    
    $("#stop").click(function(){
        stop_flg = true;
        console.log("stop_flg",stop_flg);
        clearInterval(a);
        return false;
    });    
    $("#clear").click(function(){
        clear_ctx();

        $("#r1").html(draw_loop_flg);

        return false;
    });
    $("#draw").click(function(){
        stop_flg = false;
        //drawBlock(100);
        a = drawCircle(150,80);
        return false;
    });
    $("#record").click(function(){
        r = RecordA();
        return false;
    });
    $("#stopRec").click(function(){
        r.stop();
        console.log("stop click");
        return false;
    });
    
    $("#save").click(function(){
        var can = $("#canvassample");
        var dataURL = can.get(0).toDataURL();
        var img = $("<img></img>");
        img.attr("src",dataURL);

        can.replaceWith(img);
        return false;
    });

})
