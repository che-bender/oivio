function clear_ctx(){
    var canvas = document.getElementById('canvassample');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function generateSpherePoints(centerX, centerY, centerZ, R, N) {
    const points = [];
    const dTheta = Math.PI / N; // 仰角的增量
    const dPhi = 2 * Math.PI / N; // 方位角的增量

    for (let i = 0; i <= N; i++) {
        const theta = i * dTheta; // 仰角

        for (let j = 0; j < N; j++) {
            const phi = j * dPhi; // 方位角

            // 将球坐标转换为笛卡尔坐标
            const x = centerX + R * Math.sin(theta) * Math.cos(phi);
            const y = centerY + R * Math.sin(theta) * Math.sin(phi);
            const z = centerZ + R * Math.cos(theta);

            points.push({ x, y, z });
        }
    }
    //console.log("points",points);
    return points;
    
}

function rotate3D(x, y, z, angleX, angleY, angleZ) {
    // 将角度转换为弧度
    const radX = angleX * Math.PI / 180;
    const radY = angleY * Math.PI / 180;
    const radZ = angleZ * Math.PI / 180;

    // 计算旋转矩阵
    const cosX = Math.cos(radX), sinX = Math.sin(radX);
    const cosY = Math.cos(radY), sinY = Math.sin(radY);
    const cosZ = Math.cos(radZ), sinZ = Math.sin(radZ);

    const rotX = [
        1, 0, 0,
        0, cosX, -sinX,
        0, sinX, cosX
    ];

    const rotY = [
        cosY, 0, sinY,
        0, 1, 0,
        -sinY, 0, cosY
    ];

    const rotZ = [
        cosZ, -sinZ, 0,
        sinZ, cosZ, 0,
        0, 0, 1
    ];

    // 将旋转矩阵应用于3D坐标
    let [rx, ry, rz] = multiplyMatrixAndPoint(rotX, [x, y, z]);
    [rx, ry, rz] = multiplyMatrixAndPoint(rotY, [rx, ry, rz]);
    [rx, ry, rz] = multiplyMatrixAndPoint(rotZ, [rx, ry, rz]);

    return { x: rx, y: ry, z: rz };
}

function multiplyMatrixAndPoint(matrix, point) {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = matrix;
    const [p0, p1, p2] = point;

    return [
        m0 * p0 + m1 * p1 + m2 * p2,
        m3 * p0 + m4 * p1 + m5 * p2,
        m6 * p0 + m7 * p1 + m8 * p2
    ];
}

function translate3D(x, y, z, dx, dy, dz) {
    const translatedX = x + dx;
    const translatedY = y + dy;
    const translatedZ = z + dz;
    return { x: translatedX, y: translatedY, z: translatedZ };
}
function translate2D(x, y,  dx, dy) {
    const translatedX = x + dx;
    const translatedY = y + dy;
    return { x: translatedX, y: translatedY };
}

function project3DTo2D(x, y, z, focalLengthX, focalLengthY) {
    const factorX = focalLengthX / (focalLengthX + z);
    const factorY = focalLengthY / (focalLengthY + z);
    const projectedX = x * factorX;
    const projectedY = y * factorY;
    return { x: projectedX, y: projectedY };
}

function drawSphere(context, centerX, centerY, centerZ, R, N, focalLengthX, focalLengthY,tx=500,ty=500,tz=500) {
    // 生成球体上的所有点的3D坐标
    const points3D = generateSpherePoints(centerX, centerY, centerZ, R, N);

    // 将3D坐标转换为2D坐标，并绘制这些点
    for (const point3D of points3D) {
        point3D_rotated = rotate3D(point3D.x, point3D.y, point3D.z, RX, RY, RZ);
        //point3D_translated = translate3D(point3D_rotated.x, point3D_rotated.y, point3D_rotated.z, tx, ty, tz);
        point3D_translated = point3D_rotated;
        const point2D = project3DTo2D(point3D_translated.x, point3D_translated.y, point3D_translated.z, focalLengthX, focalLengthY);
        const point2D_translated = translate2D(point2D.x, point2D.y, tx, ty);
        //console.log("point2D_translated",point2D_translated);
        context.fillRect(point2D_translated.x, point2D_translated.y, 1, 1);
    }
}

function drawBall(fx, fy,radius=200,tx=500,ty=500,tz=500) {
 
    // 获取canvas元素
    const canvas = document.getElementById('canvassample');
    const context = canvas.getContext('2d');
    drawSphere(context, 0, 0, 0, radius, 24, fx, fy,tx,ty,tz);
    //drawSphere(context, 400, 400, 360);
}

var RX=30;
var RY=0;
var RZ=0;
var focalLength = 6000;

function drawAni() {
    //let focalLength = 10;
    const intervalId = setInterval(() => {
        // 清除上一次的绘制
        clear_ctx();

        RY += 5;
        //rx += 5;
        //rz += 5;
        // 增加焦距
        //focalLength += 10;
        fx = focalLength;
        fy = fx ;
        // 绘制球体
        drawBall(fx,fy);

        //console.log("focalLength",fx,fy);

        // 如果焦距超过一定值，停止动画
        if (focalLength > 6000) {
            clearInterval(intervalId);
        }
    }, 100); // 每隔0.1秒执行一次
    return intervalId;
}
function drawBallWithRotation() {
    // 获取输入框的值
    const rotateX = parseFloat(document.getElementById('rotateX').value);
    const rotateY = parseFloat(document.getElementById('rotateY').value);
    const rotateZ = parseFloat(document.getElementById('rotateZ').value);

    // 检查输入的值是否是数字
    if (isNaN(rotateX) || isNaN(rotateY) || isNaN(rotateZ)) {
        alert('Please enter valid rotation angles.');
        return;
    }

    // 设置全局旋转角度
    RX = rotateX;
    RY = rotateY;
    RZ = rotateZ;

    fx = focalLength;
    fy = fx ;
    let N = 18;
    for(let i=1;i<=N;i++){
        //RX += -5;
        RY += 360/N;
        //RZ += 10;
        //RY += 10;
        drawBall(fx,fy,100,150+250*(i%8),-100+250*(Math.ceil(i/8)),0);
        //break;
    }
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
$(function(){
    
    $("#stop").click(function(){
        stop_flg = true;
        console.log("stop_flg",stop_flg);
        clearInterval(a);
        return false;
    });    
    $("#clear").click(function(){
        clear_ctx();
        return false;
    });

    $("#draw").click(function(){
        drawBallWithRotation();
        return false;
    });
    $("#ani").click(function(){
        stop_flg = false;
        a=drawAni();
        //clear_ctx();
        //drawBall(focalLength);
        //focalLength += 10;
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