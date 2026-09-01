import { RoomId } from '../types';

class SoundService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play personalized chimes for each room
  playRoomChime(roomId: RoomId, volume: number = 0.8): Promise<void> {
    return new Promise((resolve) => {
      try {
        const ctx = this.getAudioContext();
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), now);
        masterGain.connect(ctx.destination);

        const playTone = (
          freq: number,
          startTime: number,
          duration: number,
          type: OscillatorType = 'sine',
          gainValue: number = 0.5
        ) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, startTime);

          // Envelope (Attack -> Decay)
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + duration);
        };

        switch (roomId) {
          case 'consultorio_01': {
            // Clínico: Clássico Hospitalar Ding-Dong refinado (Do5 -> Mi5)
            playTone(523.25, now, 0.9, 'sine', 0.5);
            playTone(1046.5, now, 0.8, 'triangle', 0.15); // harmônico suave
            playTone(659.25, now + 0.35, 1.2, 'sine', 0.55);
            playTone(1318.5, now + 0.35, 1.0, 'triangle', 0.2);
            setTimeout(resolve, 1500);
            break;
          }

          case 'consultorio_02': {
            // Especialidades: Tríade elegante e cristalina (Re5 -> Fa#5 -> La5)
            playTone(587.33, now, 0.7, 'sine', 0.45);
            playTone(739.99, now + 0.25, 0.7, 'sine', 0.5);
            playTone(880.00, now + 0.50, 1.4, 'sine', 0.55);
            playTone(1760.00, now + 0.50, 1.0, 'triangle', 0.15);
            setTimeout(resolve, 1800);
            break;
          }

          case 'medicacao': {
            // Sala de Medicação: Acorde suave e acolhedor (La4 -> Do#5 -> Mi5)
            playTone(440.00, now, 0.8, 'sine', 0.4);
            playTone(554.37, now + 0.2, 0.8, 'sine', 0.45);
            playTone(659.25, now + 0.4, 1.3, 'sine', 0.5);
            setTimeout(resolve, 1600);
            break;
          }

          case 'odonto_01': {
            // Odontológico 01: Tom melódico vivo e claro (Mi5 -> Sol5 -> Si5)
            playTone(659.25, now, 0.6, 'sine', 0.45);
            playTone(783.99, now + 0.22, 0.6, 'sine', 0.5);
            playTone(987.77, now + 0.44, 1.3, 'sine', 0.55);
            setTimeout(resolve, 1600);
            break;
          }

          case 'odonto_02': {
            // Odontológico 02: Harmonia dupla com eco suave (Fa5 -> Do6)
            playTone(698.46, now, 0.7, 'sine', 0.45);
            playTone(1046.50, now + 0.28, 1.4, 'sine', 0.55);
            playTone(1396.91, now + 0.28, 1.0, 'triangle', 0.18);
            setTimeout(resolve, 1600);
            break;
          }

          default: {
            playTone(523.25, now, 0.8, 'sine', 0.5);
            playTone(659.25, now + 0.3, 1.0, 'sine', 0.5);
            setTimeout(resolve, 1200);
            break;
          }
        }
      } catch (err) {
        console.warn('Audio playback error (browser user interaction required):', err);
        resolve();
      }
    });
  }

  // Voice announcement in Brazilian Portuguese
  speakCall(
    ticketNumber: string,
    patientName: string,
    roomName: string,
    subname?: string,
    volume: number = 0.9,
    speed: number = 0.95
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // clear previous

      // Format ticket for natural reading: e.g. "CLI-012" -> "C L I, 12"
      const formattedTicket = ticketNumber
        .replace(/([A-Z0-9]{2,3})-0*([0-9]+)/i, '$1, $2')
        .split('')
        .join(' ');

      const roomText = subname ? `${roomName}, ${subname}` : roomName;
      const textToSpeak = `Atenção. Senha ${ticketNumber.replace('-', ' ')}. ${patientName}. Dirigir-se ao ${roomText}.`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-BR';
      utterance.rate = speed;
      utterance.pitch = 1.05;
      utterance.volume = Math.max(0.1, Math.min(1, volume));

      // Try to find a nice PT-BR voice
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.includes('pt'));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      // Timeout safety
      setTimeout(() => resolve(), 7000);

      window.speechSynthesis.speak(utterance);
    });
  }

  async announcePatient(
    roomId: RoomId,
    ticketNumber: string,
    patientName: string,
    roomName: string,
    subname?: string,
    chimeVolume: number = 0.8,
    voiceEnabled: boolean = true,
    voiceVolume: number = 0.9
  ) {
    // 1. Play specific room chime
    await this.playRoomChime(roomId, chimeVolume);
    // 2. Speak patient call if voice is enabled
    if (voiceEnabled) {
      // Small pause between chime and speech
      await new Promise(r => setTimeout(r, 200));
      await this.speakCall(ticketNumber, patientName, roomName, subname, voiceVolume);
    }
  }
}

export const soundService = new SoundService();
