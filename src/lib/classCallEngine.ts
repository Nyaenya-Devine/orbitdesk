/**
 * © 2026 Devine Nyaenya Ngorwe — OrbitDesk Proprietary Flagship
 * Source-available Noncommercial — No competing use — See LICENSE
 * Trademark: OrbitDesk name and logo are trademarks of Devine Nyaenya
 * Commercial licensing: devinenyaenya@gmail.com
 */
/**
 * Class Call Engine — Team Lead ↔ Agent voice calls within same class/workforce
 * 
 * Architecture:
 * - BroadcastChannel for signaling between tabs (same origin, same class code)
 * - WebRTC for peer-to-peer audio (getUserMedia + RTCPeerConnection)
 * - LocalStorage for call history
 * - Falls back to simulated calls for mock students
 */

export type CallStatus = 'idle' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'missed' | 'declined';
export type CallDirection = 'outgoing' | 'incoming';
export type CallType = 'team-internal' | 'coaching' | 'escalation';

export interface ClassCall {
  id: string;
  classCode: string;
  from: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  to: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  status: CallStatus;
  direction: CallDirection;
  type: CallType;
  startedAt: number;
  connectedAt?: number;
  endedAt?: number;
  duration?: number;
  isMuted: boolean;
  isOnHold: boolean;
  notes?: string;
}

export interface CallSignal {
  type: 'call-offer' | 'call-answer' | 'call-decline' | 'call-end' | 'call-ice-candidate' | 'presence';
  callId: string;
  classCode: string;
  from: { id: string; name: string; role: string };
  to: { id: string; name: string };
  payload?: any;
  timestamp: number;
}

class ClassCallEngine {
  private channel: BroadcastChannel | null = null;
  private calls: Map<string, ClassCall> = new Map();
  private listeners: Set<(calls: ClassCall[]) => void> = new Set();
  private signalListeners: Set<(signal: CallSignal) => void> = new Set();
  private classCode: string = 'ORBIT-2026-A';
  private currentUserId: string = 'me';
  private currentUserProfile: any = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initChannel();
      this.loadHistory();
    }
  }

  private initChannel() {
    try {
      this.channel = new BroadcastChannel('orbitdesk-class-calls');
      this.channel.onmessage = (event) => {
        const signal = event.data as CallSignal;
        if (signal.classCode !== this.classCode) return;
        if (signal.to.id !== this.currentUserId && signal.from.id !== this.currentUserId) return;
        this.handleSignal(signal);
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported, using localStorage fallback');
    }
  }

  private loadHistory() {
    try {
      const saved = localStorage.getItem(`orbitdesk_class_calls_${this.classCode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((call: ClassCall) => this.calls.set(call.id, call));
      }
    } catch {}
  }

  private saveHistory() {
    try {
      const arr = Array.from(this.calls.values()).slice(-50);
      localStorage.setItem(`orbitdesk_class_calls_${this.classCode}`, JSON.stringify(arr));
    } catch {}
  }

  private notifyListeners() {
    const arr = Array.from(this.calls.values()).sort((a, b) => b.startedAt - a.startedAt);
    this.listeners.forEach(l => l(arr));
    this.saveHistory();
  }

  private handleSignal(signal: CallSignal) {
    this.signalListeners.forEach(l => l(signal));

    switch (signal.type) {
      case 'call-offer':
        this.handleIncomingCall(signal);
        break;
      case 'call-answer':
        this.handleCallAnswered(signal);
        break;
      case 'call-decline':
        this.handleCallDeclined(signal);
        break;
      case 'call-end':
        this.handleCallEnded(signal);
        break;
      case 'call-ice-candidate':
        this.handleIceCandidate(signal);
        break;
    }
  }

  private handleIncomingCall(signal: CallSignal) {
    const call: ClassCall = {
      id: signal.callId,
      classCode: signal.classCode,
      from: {
        id: signal.from.id,
        name: signal.from.name,
        role: signal.from.role,
        avatar: signal.from.name[0].toUpperCase(),
      },
      to: {
        id: signal.to.id,
        name: signal.to.name,
        role: '',
        avatar: signal.to.name[0].toUpperCase(),
      },
      status: 'ringing',
      direction: 'incoming',
      type: signal.payload?.type || 'team-internal',
      startedAt: signal.timestamp,
      isMuted: false,
      isOnHold: false,
    };
    this.calls.set(call.id, call);
    this.notifyListeners();

    // Auto-play ringtone and show notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`Incoming call from ${signal.from.name}`, {
        body: `${signal.from.role} • Class ${signal.classCode}`,
        icon: '/icon-512.png',
      });
    }
  }

  private handleCallAnswered(signal: CallSignal) {
    const call = this.calls.get(signal.callId);
    if (call) {
      call.status = 'connected';
      call.connectedAt = Date.now();
      this.calls.set(call.id, call);
      this.notifyListeners();
    }
  }

  private handleCallDeclined(signal: CallSignal) {
    const call = this.calls.get(signal.callId);
    if (call) {
      call.status = 'declined';
      call.endedAt = Date.now();
      this.calls.set(call.id, call);
      this.notifyListeners();
      setTimeout(() => {
        this.calls.delete(call.id);
        this.notifyListeners();
      }, 3000);
    }
  }

  private handleCallEnded(signal: CallSignal) {
    const call = this.calls.get(signal.callId);
    if (call) {
      call.status = 'ended';
      call.endedAt = Date.now();
      if (call.connectedAt) {
        call.duration = Math.floor((call.endedAt - call.connectedAt) / 1000);
      }
      this.calls.set(call.id, call);
      this.notifyListeners();
      this.cleanupPeerConnection(call.id);
      setTimeout(() => {
        if (this.calls.get(call.id)?.status === 'ended') {
          this.calls.delete(call.id);
          this.notifyListeners();
        }
      }, 5000);
    }
  }

  private handleIceCandidate(signal: CallSignal) {
    const pc = this.peerConnections.get(signal.callId);
    if (pc && signal.payload?.candidate) {
      pc.addIceCandidate(new RTCIceCandidate(signal.payload.candidate)).catch(() => {});
    }
  }

  private cleanupPeerConnection(callId: string) {
    const pc = this.peerConnections.get(callId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(callId);
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
      this.localStream = null;
    }
  }

  setClassCode(code: string) {
    this.classCode = code;
    this.loadHistory();
    this.notifyListeners();
  }

  setCurrentUser(id: string, profile: any) {
    this.currentUserId = id;
    this.currentUserProfile = profile;
  }

  subscribe(listener: (calls: ClassCall[]) => void) {
    this.listeners.add(listener);
    listener(Array.from(this.calls.values()).sort((a, b) => b.startedAt - a.startedAt));
    return () => { this.listeners.delete(listener); };
  }

  subscribeSignals(listener: (signal: CallSignal) => void) {
    this.signalListeners.add(listener);
    return () => { this.signalListeners.delete(listener); };
  }

  async initiateCall(to: { id: string; name: string; role: string }, type: CallType = 'team-internal'): Promise<ClassCall> {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const from = {
      id: this.currentUserId,
      name: this.currentUserProfile?.name || 'You',
      role: this.currentUserProfile?.role || 'student',
      avatar: (this.currentUserProfile?.name?.[0] || 'Y').toUpperCase(),
    };

    const call: ClassCall = {
      id: callId,
      classCode: this.classCode,
      from,
      to: {
        id: to.id,
        name: to.name,
        role: to.role,
        avatar: to.name[0].toUpperCase(),
      },
      status: 'ringing',
      direction: 'outgoing',
      type,
      startedAt: Date.now(),
      isMuted: false,
      isOnHold: false,
    };

    this.calls.set(callId, call);
    this.notifyListeners();

    // Send signal via BroadcastChannel
    const signal: CallSignal = {
      type: 'call-offer',
      callId,
      classCode: this.classCode,
      from: { id: from.id, name: from.name, role: from.role },
      to: { id: to.id, name: to.name },
      payload: { type },
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage(signal);
    } else {
      // Fallback to localStorage event
      localStorage.setItem('orbitdesk_call_signal', JSON.stringify(signal));
      setTimeout(() => localStorage.removeItem('orbitdesk_call_signal'), 1000);
    }

    // For mock students, auto-answer after 2-4s to simulate real workforce
    if (to.id.startsWith('s') || to.id !== 'me') {
      const isMock = ['s1', 's2', 's3', 's4'].includes(to.id);
      if (isMock) {
        setTimeout(() => {
          // Simulate answer or decline based on status
          const shouldAnswer = Math.random() > 0.2; // 80% answer rate
          if (shouldAnswer) {
            this.answerCall(callId);
            // Simulate sending answer signal back
            const answerSignal: CallSignal = {
              type: 'call-answer',
              callId,
              classCode: this.classCode,
              from: { id: to.id, name: to.name, role: to.role },
              to: { id: from.id, name: from.name },
              timestamp: Date.now(),
            };
            if (this.channel) this.channel.postMessage(answerSignal);
          } else {
            this.declineCall(callId);
          }
        }, 1500 + Math.random() * 2000);
      }
    }

    return call;
  }

  async answerCall(callId: string) {
    const call = this.calls.get(callId);
    if (!call) return;

    call.status = 'connecting';
    this.calls.set(callId, call);
    this.notifyListeners();

    try {
      // Request microphone for WebRTC
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      this.localStream.getTracks().forEach(track => pc.addTrack(track, this.localStream!));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const signal: CallSignal = {
            type: 'call-ice-candidate',
            callId,
            classCode: this.classCode,
            from: { id: this.currentUserId, name: this.currentUserProfile?.name || 'You', role: this.currentUserProfile?.role || '' },
            to: { id: call.from.id, name: call.from.name },
            payload: { candidate: event.candidate },
            timestamp: Date.now(),
          };
          if (this.channel) this.channel.postMessage(signal);
        }
      };

      this.peerConnections.set(callId, pc);

      // Simulate connection after 1s for demo
      setTimeout(() => {
        call.status = 'connected';
        call.connectedAt = Date.now();
        this.calls.set(callId, call);
        this.notifyListeners();

        const signal: CallSignal = {
          type: 'call-answer',
          callId,
          classCode: this.classCode,
          from: { id: this.currentUserId, name: this.currentUserProfile?.name || 'You', role: this.currentUserProfile?.role || '' },
          to: { id: call.from.id, name: call.from.name },
          timestamp: Date.now(),
        };
        if (this.channel) this.channel.postMessage(signal);
      }, 800);

    } catch (e) {
      console.warn('Microphone access denied, using simulated audio', e);
      // Fallback to simulated connection without WebRTC
      setTimeout(() => {
        call.status = 'connected';
        call.connectedAt = Date.now();
        this.calls.set(callId, call);
        this.notifyListeners();
      }, 500);
    }
  }

  declineCall(callId: string) {
    const call = this.calls.get(callId);
    if (!call) return;

    call.status = 'declined';
    call.endedAt = Date.now();
    this.calls.set(callId, call);
    this.notifyListeners();

    const signal: CallSignal = {
      type: 'call-decline',
      callId,
      classCode: this.classCode,
      from: { id: this.currentUserId, name: this.currentUserProfile?.name || 'You', role: this.currentUserProfile?.role || '' },
      to: { id: call.direction === 'outgoing' ? call.to.id : call.from.id, name: call.direction === 'outgoing' ? call.to.name : call.from.name },
      timestamp: Date.now(),
    };
    if (this.channel) this.channel.postMessage(signal);

    setTimeout(() => {
      this.calls.delete(callId);
      this.notifyListeners();
    }, 2000);
  }

  endCall(callId: string) {
    const call = this.calls.get(callId);
    if (!call) return;

    call.status = 'ended';
    call.endedAt = Date.now();
    if (call.connectedAt) {
      call.duration = Math.floor((call.endedAt - call.connectedAt) / 1000);
    }
    this.calls.set(callId, call);
    this.notifyListeners();
    this.cleanupPeerConnection(callId);

    const signal: CallSignal = {
      type: 'call-end',
      callId,
      classCode: this.classCode,
      from: { id: this.currentUserId, name: this.currentUserProfile?.name || 'You', role: this.currentUserProfile?.role || '' },
      to: { id: call.direction === 'outgoing' ? call.to.id : call.from.id, name: call.direction === 'outgoing' ? call.to.name : call.from.name },
      timestamp: Date.now(),
    };
    if (this.channel) this.channel.postMessage(signal);

    setTimeout(() => {
      if (this.calls.get(callId)?.status === 'ended') {
        this.calls.delete(callId);
        this.notifyListeners();
      }
    }, 4000);
  }

  toggleMute(callId: string) {
    const call = this.calls.get(callId);
    if (!call) return;
    call.isMuted = !call.isMuted;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(t => t.enabled = !call.isMuted);
    }
    this.calls.set(callId, call);
    this.notifyListeners();
  }

  toggleHold(callId: string) {
    const call = this.calls.get(callId);
    if (!call) return;
    call.isOnHold = !call.isOnHold;
    this.calls.set(callId, call);
    this.notifyListeners();
  }

  getActiveCalls() {
    return Array.from(this.calls.values()).filter(c => ['ringing', 'connecting', 'connected'].includes(c.status));
  }

  getCallHistory() {
    return Array.from(this.calls.values()).sort((a, b) => b.startedAt - a.startedAt);
  }

  clearHistory() {
    this.calls.clear();
    this.notifyListeners();
    localStorage.removeItem(`orbitdesk_class_calls_${this.classCode}`);
  }
}

export const classCallEngine = new ClassCallEngine();
