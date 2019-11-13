let context;

function startAudio() {
  if (!context) {
    context = new AudioContext();
  }

}

startAudio();

function tone(freq, amp, T, fadeTime=1) {
    //var T = context.currentTime;

    var osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    var gain = context.createGain();
    osc.connect(gain);

    gain.gain.setValueAtTime(0, T);
    gain.gain.linearRampToValueAtTime(amp, T + 0.1);
    gain.connect(context.destination);

    osc.start(T);
    setTimeout((fadeOut(gain, T, fadeTime)), 100);
    osc.stop(T + 2);
}

function fadeOut(gain, T, fadeTime) {
  gain.gain.exponentialRampToValueAtTime(0.01, T + 0.1 + fadeTime);
}