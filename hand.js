const video = document.getElementById('input');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');
var all = [];
//関連ファイルの読み込み
const config = {
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
};
const hands = new Hands(config);

//カメラからの映像をhands.jsで使えるようにする
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({
      image: video
    });
  },
  width: 600,
  height: 400
});

hands.setOptions({
  maxNumHands: 2, //検出する手の最大数
  modelComplexity: 1, //ランドマーク検出精度(0か1)
  minDetectionConfidence: 0.5, //手を検出するための信頼値(0.0~1.0)
  minTrackingConfidence: 0.5 //ランドマーク追跡の信頼度(0.0~1.0)
});

//形状認識した結果の取得
hands.onResults(results => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  console.log(results.multiHandedness[0]);
  if (results.multiHandedness[0] == undefined) {
    console.log("手が検出されていません");
  } else {
    if (results.multiHandedness[0].index == 1) {
      console.log("左手です");
    } else {
      console.log("右手です");
    }
  }

  if (results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach(marks => {
      // 緑色の線で骨組みを可視化
      all.push(marks);
      drawConnectors(ctx, marks, HAND_CONNECTIONS, {
        color: '#0f0'
      });

      // 赤色でランドマークを可視化
      drawLandmarks(ctx, marks, {
        color: '#f00'
      });
    })
  }
  console.log(all);
});


//認識開始・終了ボタン
document.getElementById('start')
  .addEventListener('click', () => camera.start());
document.getElementById('stop')
  .addEventListener('click', () => camera.stop());
