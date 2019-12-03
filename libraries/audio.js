let context;

function startAudio() {
  if (!context) {
    let AudioContext = window.AudioContext   // Default
              || window.webkitAudioContext;  // Safari and old versions of Chrome
    context = new AudioContext();
  }

}

startAudio();

let epsilon = 1e-6;

function fade(osc, T, fadeTime, peakGain) {
    let tau = fadeTime * Math.log(peakGain/epsilon);

    let attackTime = 0.1;

    let gain = context.createGain();
    osc.connect(gain);

    gain.gain.setValueAtTime(peakGain, T);
    gain.gain.linearRampToValueAtTime(peakGain, T + attackTime);
    gain.connect(context.destination);

    osc.start(T);
    setTimeout((fadeOut(gain, T, tau)), attackTime * 1000);
    osc.stop(T + attackTime + tau);

}

function play(osc, T, playTime, peakGain) {

    let attackTime = 0.1;

    let gain = context.createGain();
    osc.connect(gain);

    gain.gain.setValueAtTime(peakGain, T);
    gain.gain.linearRampToValueAtTime(peakGain, T + attackTime);
    gain.connect(context.destination);

    osc.start(T);
    osc.stop(T + attackTime + playTime);

}

function fadeOut(gain, T, fadeTime) {
  gain.gain.exponentialRampToValueAtTime(epsilon, T + 0.1 + fadeTime);
}