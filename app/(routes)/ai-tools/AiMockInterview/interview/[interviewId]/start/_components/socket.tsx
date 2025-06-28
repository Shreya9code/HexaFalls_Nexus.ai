import React, { useRef, useState } from "react";

type Callback = (data: any) => void;

export default class AssemblyAITranscriber {
  private socket: WebSocket | null = null;
  private listeners: { [event: string]: Callback[] } = {};
  
  constructor(private token: string) {}
  
  async connect() {
    return new Promise<void>((resolve, reject) => {
      if (!this.token) return reject("No AssemblyAI token provided");
      this.socket = new WebSocket(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${this.token}`
      );
      console.log("Connecting to AssemblyAI...");
      this.socket.onopen = () => {
        console.log("✅ Connected to AssemblyAI");
        resolve();
      };

      this.socket.onerror = (e) => {
        this.emit("error", e);
        reject(e);
      };

      this.socket.onmessage = (msg) => {
        console.log("📝Message received:",msg);
        const data = JSON.parse(msg.data);
        console.log("📝Transcript received:",data);
        if (data.text) {
          this.emit("transcript", data.text);
        } else if (data.error) {
          this.emit("error", data.error);
        }      };
      this.socket.onclose = (event) => {
        console.log("❌ WebSocket closed");
        console.log("Code:", event.code);
        console.log("Reason:", event.reason);
        this.emit("close", null);
      };      
    });
  }

  sendAudio(buffer: ArrayBuffer) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(buffer);
    }
  }

  async close() {
    this.socket?.close();
  }

  on(event: string, callback: Callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      for (const cb of this.listeners[event]) cb(data);
    }
  }
}
