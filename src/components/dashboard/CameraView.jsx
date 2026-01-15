import { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { scanResult } from '../../stores/user';

export default function CameraView() {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Gagal akses kamera");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  const captureAndUpload = async () => {
    if (!videoRef.current) return;
    setLoading(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      try {
        const result = await api.scan(blob);
        if (result.success) {
          scanResult.set(result);
          window.location.href = '/dashboard/result';
        } else {
          alert('Gagal memproses gambar');
        }
      } catch (e) {
        alert('Error koneksi server');
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg', 0.8);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        )}
      </div>

      <button
        onClick={captureAndUpload}
        disabled={loading}
        className="w-20 h-20 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
      >
        <div className="w-16 h-16 bg-slate-900 rounded-full"></div>
      </button>
      <p className="mt-4 text-slate-500 font-medium">Tap tombol untuk scan catatan</p>
    </div>
  );
}
