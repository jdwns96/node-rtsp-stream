const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Stream = require("node-rtsp-stream");

const path = require("path"); // 경로 설정

const app = express();

app.use(cors());
app.use(express.json()); // body 정보 처리
app.use(express.static(path.join(__dirname, "/public")));

const stream_configs = [
  {
    key: "1",
    port: "9000",
    url: "rtsp://admin:intflow3121@edgefarm.ai:11009/cam/realmonitor?channel=1&subtype=0",
    // url: "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov",
  },
  {
    key: "2",
    port: "9001",
    url: "rtsp://admin:intflow3121@edgefarm.ai:11009/cam/realmonitor?channel=2&subtype=0",
    // url: "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov",
  },
  {
    key: "3",
    port: "9002",
    url: "rtsp://admin:intflow3121@edgefarm.ai:11009/cam/realmonitor?channel=3&subtype=0",
    // url: "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov",
  },
];

// function
const startStream = (name, streamUrl, wsPort) => {
  // 비동기 에어리어
  const stream = new Stream({
    name, // key
    streamUrl, // url
    wsPort, // port
    ffmpegOptions: {
      // options ffmpeg flags
      "-stats": "", // an option with no neccessary value uses a blank string
      "-r": 30, // options with required values specify the value after the key
    },
  });

  Stream.prototype.streams[wsPort] = stream;
};

// stop
const stopStream = (port) => {
  if (Stream.prototype.streams[port]) {
    Stream.prototype.streams[port].stop();
    Stream.prototype.streams[port] = null;
  }
};

// 스트리밍 시작 버튼
app.post("/start-stream", (req, res) => {
  const { url, port, key = "stream" } = req.body;
  if (!url && !port) {
    return res.json({
      message: "Bad Input",
    });
  }
  if (Stream.prototype.streams[port]) {
    return res.json({
      message: "Port is in use",
    });
  }
  console.log(url, port, key);
  startStream(key, url, port);

  res.json({
    url: `ws://192.168.0.30:${port}`,
  });
});

// steams
// 수정 필요함
app.post("/start-streams", (req, res) => {
  const { videos } = req.body;

  videos.forEach((v, i) => {
    const { key, url, port } = v;
    if (!((!url && !port) || Stream.prototype.streams[port])) {
      console.log("start stream");
      startStream(key, url, port);
    } else {
      console.log("can't create stream");
    }
  });
  // 각각의 리스너에 인터벌 달고 관리?
  res.json({
    message: "Start all Stream",
  });
});

// stop stream
app.get("/stop-stream", (req, res) => {
  console.log("stop stream");
  const { port } = req.query;

  if (!Stream.prototype.streams[port]) {
    return res.json({
      message: "Port is not in use",
    });
  }

  stopStream(port);

  return res.json({
    message: "Stop",
  });
});

// stop all
app.get("/stop-streams", (req, res) => {
  const ports = Object.keys(Stream.prototype.streams);

  ports.forEach((port) => {
    stopStream(port);
  });
});

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/public/pages/index.html");
});

// stream sever port
// 자체 서버가 가지고있는 포트
app.listen(8081, async () => {
  // stream_configs.forEach((v, i) => {
  //   const { key, url, port } = v;
  //   startStream(key, url, port);
  // });
  console.log("server running 8081");
});
