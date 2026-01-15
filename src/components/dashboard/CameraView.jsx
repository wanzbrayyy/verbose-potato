import { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';

export default function CameraView() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
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
      console.warn("Camera access denied or unavailable", err);
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  const processApiResponse = (result) => {
    if (result && result.success) {
      // LANGSUNG SIMPAN KE SESSION STORAGE
      sessionStorage.setItem('scanResult', JSON.stringify(result));
      window.location.href = '/dashboard/result';
    } else {
      alert('Gagal memproses gambar: ' + (result.error || 'Unknown error'));
      setLoading(false);
    }
  };

  const captureAndUpload = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
        alert("Kamera tidak aktif. Coba muat ulang halaman atau izinkan akses kamera.");
        return;
    }
    setLoading(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      try {
        const result = await api.scan(blob);
        processApiResponse(result);
      } catch (e) {
        alert('Error koneksi server');
        setLoading(false);
      }
    }, 'image/jpeg', 0.8);
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
        const result = await api.scan(file);
        processApiResponse(result);
    } catch (err) {
        alert('Error saat upload dari galeri');
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl mb-6 flex items-center justify-center text-slate-500">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />
        {loading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
            <p className="font-bold animate-pulse">Sedang Menganalisa...</p>
          </div>
        )}
      </div>

      <div className="flex gap-6 items-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl hover:bg-slate-200 transition-colors"
          title="Upload Galeri"
        >
          🖼️
        </button>

        <button
          onClick={captureAndUpload}
          disabled={loading}
          className="w-24 h-24 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
        >
          <div className="w-20 h-20 bg-slate-900 rounded-full"></div>
        </button>

        <div className="w-16 h-16"></div> 
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleGalleryUpload}
      />
      
      <p className="mt-6 text-slate-500 font-medium text-center">
        Tap tombol tengah untuk foto<br/>atau tombol kiri untuk galeri
      </p>
    </div>
  );
}
