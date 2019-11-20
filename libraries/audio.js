let context;

function startAudio() {
  if (!context) {
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

function tone(freq, amp, T, fadeTime) {
    var osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    var gain = context.createGain();
    osc.connect(gain);

    let tau = fadeTime * Math.log(amp/epsilon);
    let attackTime = 0.1;

    gain.gain.setValueAtTime(0, T);
    gain.gain.linearRampToValueAtTime(amp, T + 0.1);
    gain.connect(context.destination);

    osc.start(T);
    setTimeout((fadeOut(gain,T, tau)), attackTime * 1000);
    osc.stop(T + attackTime + tau);
}

function fadeOut(gain, T, fadeTime) {
  gain.gain.exponentialRampToValueAtTime(epsilon, T + 0.1 + fadeTime);
}