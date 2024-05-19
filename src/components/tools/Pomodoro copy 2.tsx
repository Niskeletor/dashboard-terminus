import { createSignal, onCleanup, onMount } from "solid-js";

const PomodoroComponent = () => {
  const [sessionLength, setSessionLength] = createSignal(25);
  const [breakLength, setBreakLength] = createSignal(5);
  const [sessionSecondsLeft, setSessionSecondsLeft] = createSignal(sessionLength() * 60);
  const [breakSecondsLeft, setBreakSecondsLeft] = createSignal(breakLength() * 60);
  const [isSessionRunning, setIsSessionRunning] = createSignal(false);
  const [isBreakRunning, setIsBreakRunning] = createSignal(false);
  let sessionTimerInterval;
  let breakTimerInterval;
  let sessionEndAudio;
  let breakEndAudio;

  onMount(() => {
    sessionEndAudio = new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3");
    breakEndAudio = new Audio("https://www.soundjay.com/button/sounds/beep-10.mp3");
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const startSessionTimer = () => {
    setIsSessionRunning(true);
    sessionTimerInterval = setInterval(() => {
      setSessionSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(sessionTimerInterval);
          setIsSessionRunning(false);
          sessionEndAudio.play();
          startBreakTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBreakTimer = () => {
    setIsBreakRunning(true);
    breakTimerInterval = setInterval(() => {
      setBreakSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(breakTimerInterval);
          setIsBreakRunning(false);
          breakEndAudio.play();
          resetTimers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseSessionTimer = () => {
    clearInterval(sessionTimerInterval);
    setIsSessionRunning(false);
  };

  const pauseBreakTimer = () => {
    clearInterval(breakTimerInterval);
    setIsBreakRunning(false);
  };

  const resetTimers = () => {
    clearInterval(sessionTimerInterval);
    clearInterval(breakTimerInterval);
    setIsSessionRunning(false);
    setIsBreakRunning(false);
    setSessionSecondsLeft(sessionLength() * 60);
    setBreakSecondsLeft(breakLength() * 60);
  };

  const handleSessionLengthChange = (event) => {
    setSessionLength(event.target.value);
    if (!isSessionRunning()) {
      setSessionSecondsLeft(event.target.value * 60);
    }
  };

  const handleBreakLengthChange = (event) => {
    setBreakLength(event.target.value);
    if (!isBreakRunning()) {
      setBreakSecondsLeft(event.target.value * 60);
    }
  };

  onCleanup(() => {
    clearInterval(sessionTimerInterval);
    clearInterval(breakTimerInterval);
  });

  return (
    <div class={`container ${isSessionRunning() ? "session" : isBreakRunning() ? "break" : ""}`}>
      <div class="row text-center status-box">
        <div id="status">{isSessionRunning() ? "Session" : isBreakRunning() ? "Break" : "Off"}</div>
      </div>
      <div class="row text-center">
        <div id="session-timer">{formatTime(sessionSecondsLeft())}</div>
        <div id="break-timer">{formatTime(breakSecondsLeft())}</div>
      </div>
      <div class="row text-center">
        <div class="slider-box">
          <label for="session-slider">Session: {sessionLength()} min</label>
          <input
            id="session-slider"
            type="range"
            min="1"
            max="60"
            value={sessionLength()}
            onInput={handleSessionLengthChange}
            disabled={isSessionRunning() || isBreakRunning()}
          />
        </div>
        <div class="slider-box">
          <label for="break-slider">Break: {breakLength()} min</label>
          <input
            id="break-slider"
            type="range"
            min="1"
            max="30"
            value={breakLength()}
            onInput={handleBreakLengthChange}
            disabled={isSessionRunning() || isBreakRunning()}
          />
        </div>
      </div>
      <div class="row buttons-row text-center">
        <div class="col-xs-6">
          <button class="btn btn-success" onClick={startSessionTimer} disabled={isSessionRunning() || isBreakRunning()}>Start</button>
          <button class="btn btn-danger" onClick={pauseSessionTimer} disabled={!isSessionRunning()}>Pause</button>
          <button class="btn btn-warning" onClick={resetTimers}>Reset</button>
        </div>
      </div>
      <style>
        {`
          .container {
            font-family: "Roboto Slab", "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: white;
            padding: 10px;
            transition: background-color 0.5s ease;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .container.session {
            background-color: #2c003e;
            background-image: radial-gradient(ellipse closest-side at center, #6a0572 2%, #2c003e 100%);
          }
          .container.break {
            background-color: #004e63;
            background-image: radial-gradient(ellipse closest-side at center, #008b8b 2%, #004e63 100%);
          }
          .text-center {
            text-align: center;
          }
          .status-box {
            margin-top: 10px;
          }
          #status {
            color: #ffffff;
            font-family: 'Raleway', sans-serif;
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 12px;
            text-transform: uppercase;
            text-shadow: 0px 1px 0px #FFF, 0px -1px 0px #000;
          }
          #session-timer, #break-timer {
            margin-bottom: 10px;
            font-size: 20px;
            text-shadow: #fff 0px 1px 0, #000 0 -1px 0;
            letter-spacing: 2px;
          }
          .buttons-row {
            margin-top: 10px;
          }
          .btn {
            padding: 5px 10px;
            margin: 5px;
            font-size: 12px;
          }
          .btn-success {
            background-color: #28a745;
            border-color: #28a745;
            border-radius: 8px;
          }
          .btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
            border-radius: 8px;
          }
          .btn-warning {
            background-color: #ffc107;
            border-color: #ffc107;
            border-radius: 8px;
          }
          .slider-box {
            margin: 10px 0;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
          }
          input[type="range"] {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default PomodoroComponent;

