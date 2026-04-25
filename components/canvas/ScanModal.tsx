"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCanvasStore } from "@/store/canvasStore";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScanModal({ isOpen, onClose }: ScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<"init" | "preview" | "captured">("init");
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setSketchImageBase64 = useCanvasStore((s) => s.setSketchImageBase64);
  const setScanState = useCanvasStore((s) => s.setScanState);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("preview");
    } catch (err) {
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access and try again."
          : "Could not access camera. Make sure no other app is using it."
      );
    }
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCapturedDataUrl(canvas.toDataURL("image/png", 0.95));
    setPhase("captured");
    stopStream();
  }, [stopStream]);

  const confirmCapture = useCallback(() => {
    if (!capturedDataUrl) return;
    setSketchImageBase64(capturedDataUrl.split(",")[1]);
    setScanState("captured");
    onClose();
  }, [capturedDataUrl, setSketchImageBase64, setScanState, onClose]);

  const retake = useCallback(async () => {
    setCapturedDataUrl(null);
    setPhase("init");
    await startCamera();
  }, [startCamera]);

  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setPhase("init");
      setCapturedDataUrl(null);
      setError(null);
    }
  }, [isOpen, stopStream]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSketchImageBase64(result.split(",")[1]);
      setScanState("captured");
      onClose();
    };
    reader.readAsDataURL(file);
  }, [setSketchImageBase64, setScanState, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card w-full max-w-lg pointer-events-auto border border-[rgba(255,255,255,0.10)] shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.07)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(0,212,255,0.15)] flex items-center justify-center text-[#67e8f9]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#f0f4ff] text-sm font-semibold">Scan Physical Sketch</p>
                    <p className="text-[#4b5563] text-xs">Use webcam or upload a photo</p>
                  </div>
                </div>
                <button onClick={onClose} className="btn-icon" aria-label="Close">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-[#ef4444] text-sm">{error}</div>
                )}

                {phase === "init" && !error && (
                  <div className="flex flex-col gap-3">
                    <button id="scan-modal-webcam-btn" onClick={startCamera} className="btn-brand w-full justify-center py-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                      Open Webcam
                    </button>
                    <div className="relative flex items-center">
                      <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
                      <span className="mx-3 text-[#4b5563] text-xs">or</span>
                      <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
                    </div>
                    <label htmlFor="scan-modal-file-input" className="btn-ghost w-full justify-center py-3 cursor-pointer">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                      Upload Photo
                      <input id="scan-modal-file-input" type="file" accept="image/*" className="sr-only" onChange={handleFileUpload} />
                    </label>
                    <p className="text-[#4b5563] text-xs text-center leading-relaxed">Hold your sketch up to the camera or upload a photo of your notebook.</p>
                  </div>
                )}

                {phase === "preview" && (
                  <div className="flex flex-col gap-3">
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-[rgba(255,255,255,0.08)]">
                      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                      <div className="absolute inset-4 border-2 border-[rgba(108,99,255,0.4)] rounded-lg pointer-events-none">
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#6c63ff] rounded-tl" />
                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#6c63ff] rounded-tr" />
                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#6c63ff] rounded-bl" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#6c63ff] rounded-br" />
                      </div>
                    </div>
                    <button id="scan-modal-capture-btn" onClick={captureFrame} className="btn-brand w-full justify-center py-3">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></svg>
                      Capture
                    </button>
                  </div>
                )}

                {phase === "captured" && capturedDataUrl && (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={capturedDataUrl} alt="Captured sketch" className="w-full h-full object-contain bg-black" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={retake} className="btn-ghost flex-1 justify-center">Retake</button>
                      <button id="scan-modal-confirm-btn" onClick={confirmCapture} className="btn-brand flex-1 justify-center">Use This Image</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </AnimatePresence>
  );
}
