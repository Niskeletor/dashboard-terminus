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
    sessionEndAudio = new Audio("https://www.freesfx.co.uk/rx2/mp3s/2/13651_1459784563.mp3");
    breakEndAudio = new Audio("https://www.freesfx.co.uk/rx2/mp3s/4/16412_1460641277.mp3");
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
        <div id="session-timer">Session: {formatTime(sessionSecondsLeft())}</div>
        <div id="break-timer">Break: {formatTime(breakSecondsLeft())}</div>
      </div>
      <div class="row text-center">
        <div class="slider-box">
          <label for="session-slider">Session Length: {sessionLength()} minutes</label>
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
          <label for="break-slider">Break Length: {breakLength()} minutes</label>
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
          <button class="btn btn-success" onClick={startSessionTimer} disabled={isSessionRunning() || isBreakRunning()}>Start Session</button>
          <button class="btn btn-danger" onClick={pauseSessionTimer} disabled={!isSessionRunning()}>Pause Session</button>
          <button class="btn btn-warning" onClick={resetTimers}>Reset</button>
        </div>
      </div>
      <style>
        {`
          .container {
            font-family: "Roboto Slab", "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: white;
            margin: 0px;
            padding: 20px;
            transition: background-color 0.5s ease;
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
            margin-top: 20px;
          }
          #status {
            color: #ffffff;
            font-family: 'Raleway', sans-serif;
            font-size: 48px;
            font-weight: 800;
            margin: 0 0 24px;
            text-transform: uppercase;
            text-shadow: 0px 1px 0px #FFF, 0px -1px 0px #000;
          }
          #session-timer, #break-timer {
            margin-bottom: 20px;
            font-size: 40px;
            text-shadow: #fff 0px 1px 0, #000 0 -1px 0;
            letter-spacing: 5px;
          }
          .buttons-row {
            margin-top: 20px;
          }
          .btn {
            padding: 10px 20px;
            margin: 5px;
            font-size: 18px;
          }
          .btn-success {
            background-color: #28a745;
            border-color: #28a745;
          }
          .btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
          }
          .btn-warning {
            background-color: #ffc107;
            border-color: #ffc107;
          }
          .slider-box {
            margin: 20px 0;
          }
          label {
            display: block;
            margin-bottom: 10px;
            font-size: 18px;
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
