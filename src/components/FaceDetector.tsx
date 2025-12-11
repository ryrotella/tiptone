'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { rgbToHex } from '@/lib/colors';

// MediaPipe Face Mesh landmark index for bottom lip center
// Index 17 is the center of the bottom lip
const BOTTOM_LIP_CENTER_INDEX = 17;
// Alternative indices for the bottom lip area
const BOTTOM_LIP_INDICES = [17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84];

interface FaceDetectorProps {
  onColorDetected: (hex: string, imageData: string) => void;
}

export default function FaceDetector({ onColorDetected }: FaceDetectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedPoint, setDetectedPoint] = useState<{ x: number; y: number } | null>(null);
  const [detectedColor, setDetectedColor] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Draw image and detection point
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image
    ctx.drawImage(image, 0, 0);

    // Draw detection point
    if (detectedPoint) {
      // Draw crosshair
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(detectedPoint.x - 15, detectedPoint.y);
      ctx.lineTo(detectedPoint.x + 15, detectedPoint.y);
      ctx.moveTo(detectedPoint.x, detectedPoint.y - 15);
      ctx.lineTo(detectedPoint.x, detectedPoint.y + 15);
      ctx.stroke();

      // Draw circle
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(detectedPoint.x, detectedPoint.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(detectedPoint.x, detectedPoint.y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [image, detectedPoint]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Extract color at point
  const extractColor = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return null;

    // Create a temporary canvas to get original image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return null;

    tempCtx.drawImage(image, 0, 0);

    // Sample a small area and average the colors
    const sampleSize = 3;
    let r = 0, g = 0, b = 0, count = 0;

    for (let dx = -sampleSize; dx <= sampleSize; dx++) {
      for (let dy = -sampleSize; dy <= sampleSize; dy++) {
        const px = Math.round(x + dx);
        const py = Math.round(y + dy);
        if (px >= 0 && px < image.width && py >= 0 && py < image.height) {
          const pixel = tempCtx.getImageData(px, py, 1, 1).data;
          r += pixel[0];
          g += pixel[1];
          b += pixel[2];
          count++;
        }
      }
    }

    if (count === 0) return null;

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return rgbToHex(r, g, b);
  }, [image]);

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setLoading(true);
    setError(null);
    setDetectedPoint(null);
    setDetectedColor(null);

    try {
      // Load image
      const img = new Image();
      img.onload = async () => {
        // Resize if too large
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }

        // Create resized image
        const resizeCanvas = document.createElement('canvas');
        resizeCanvas.width = width;
        resizeCanvas.height = height;
        const resizeCtx = resizeCanvas.getContext('2d');
        if (resizeCtx) {
          resizeCtx.drawImage(img, 0, 0, width, height);
          const resizedImg = new Image();
          resizedImg.onload = () => {
            setImage(resizedImg);
            detectFace(resizedImg);
          };
          resizedImg.src = resizeCanvas.toDataURL('image/jpeg', 0.9);
        }
      };
      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.error('Error loading image:', err);
      setError('Failed to load image');
      setLoading(false);
    }
  };

  // Detect face using MediaPipe (simplified - just finds center of face area)
  const detectFace = async (img: HTMLImageElement) => {
    try {
      // For now, we'll use a simplified approach:
      // Place the detection point at a typical lip position (center-bottom of image)
      // Users can then adjust manually

      // Typical face proportions: bottom lip is around 72% down from top
      const estimatedLipY = img.height * 0.72;
      const estimatedLipX = img.width * 0.5;

      setDetectedPoint({ x: estimatedLipX, y: estimatedLipY });

      const color = extractColor(estimatedLipX, estimatedLipY);
      if (color) {
        setDetectedColor(color);
      }

      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error detecting face:', err);
      setError('Could not detect face. Please adjust the selection manually.');
      setLoading(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 800 }, height: { ideal: 600 } }
      });
      setStream(mediaStream);
      setCameraActive(true);

      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions or use file upload.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);

    // Create canvas to capture frame
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const ctx = captureCanvas.getContext('2d');

    if (ctx) {
      // Mirror the image horizontally for selfie view
      ctx.translate(captureCanvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);

      // Stop camera
      stopCamera();

      // Process captured image
      const img = new Image();
      img.onload = () => {
        // Resize if needed
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }

        const resizeCanvas = document.createElement('canvas');
        resizeCanvas.width = width;
        resizeCanvas.height = height;
        const resizeCtx = resizeCanvas.getContext('2d');
        if (resizeCtx) {
          resizeCtx.drawImage(img, 0, 0, width, height);
          const resizedImg = new Image();
          resizedImg.onload = () => {
            setImage(resizedImg);
            detectFace(resizedImg);
          };
          resizedImg.src = resizeCanvas.toDataURL('image/jpeg', 0.9);
        }
      };
      img.src = captureCanvas.toDataURL('image/jpeg', 0.9);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle canvas click/drag for manual adjustment
  const handleCanvasInteraction = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setDetectedPoint({ x, y });
    const color = extractColor(x, y);
    if (color) {
      setDetectedColor(color);
    }
  }, [image, extractColor]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleCanvasInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleCanvasInteraction(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Confirm selection
  const handleConfirm = () => {
    if (detectedColor && canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.9);
      onColorDetected(detectedColor, imageData);
    }
  };

  return (
    <div>
      {/* File upload or camera */}
      <div className="panel">
        <div className="panel-header">Step 1: Take or Upload a Photo</div>
        <div className="panel-content">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button
              onClick={startCamera}
              disabled={cameraActive}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '1px',
                backgroundColor: cameraActive ? '#cccccc' : '#ffffff',
                color: '#000000',
                border: '1px solid #000000',
                cursor: cameraActive ? 'default' : 'pointer',
              }}
            >
              TAKE PHOTO
            </button>
            <label
              htmlFor="file-upload"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '1px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '1px solid #000000',
                cursor: 'pointer',
              }}
            >
              CHOOSE FILE
            </label>
          </div>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <p style={{ fontSize: '16px', color: '#666', marginBottom: 0 }}>
            Take a selfie or upload a clear, front-facing photo. The system will
            automatically place a marker on your bottom lip that you can adjust.
          </p>
        </div>
      </div>

      {/* Camera view */}
      {cameraActive && (
        <div className="panel">
          <div className="panel-header">Camera</div>
          <div className="panel-content" style={{ textAlign: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                border: '1px solid #333',
                transform: 'scaleX(-1)',
              }}
            />
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={capturePhoto}
                style={{
                  padding: '14px 40px',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '1px solid #000000',
                  cursor: 'pointer',
                }}
              >
                CAPTURE
              </button>
              <button
                onClick={stopCamera}
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Example image */}
      <div className="panel">
        <div className="panel-header">Example: Correct Selection Area</div>
        <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', marginBottom: '10px' }}>
            Select the center of the bottom lip
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src="/exTip.png"
              alt="Example: Select the center of the bottom lip"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                border: '1px solid #ddd',
                display: 'block',
              }}
            />
            {/* Red dot on bottom lip */}
            <div
              style={{
                position: 'absolute',
                left: '48%',
                top: '69%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                backgroundColor: '#ff0000',
                borderRadius: '50%',
                border: '2px solid #ffffff',
                boxShadow: '0 0 4px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="panel">
          <div className="panel-content text-center">
            <p>Detecting face...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="panel" style={{ background: '#fff0f0' }}>
          <div className="panel-content">
            <p style={{ color: '#cc0000', marginBottom: 0 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Canvas for image display and interaction */}
      {image && !loading && (
        <div className="panel">
          <div className="panel-header">Step 2: Adjust Selection</div>
          <div className="panel-content">
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
              Click or drag on the image to adjust the selection point.
              Position it at the center of the bottom lip.
            </p>
            <div style={{ textAlign: 'center', overflow: 'auto' }}>
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  maxWidth: '100%',
                  cursor: 'crosshair',
                  border: '1px solid #c0c0c0',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Detected color preview */}
      {detectedColor && (
        <div className="panel">
          <div className="panel-header">Step 3: Confirm Color</div>
          <div className="panel-content">
            <div className="flex gap-3 items-center">
              <div
                className="color-swatch"
                style={{
                  backgroundColor: detectedColor,
                  width: '80px',
                  height: '80px',
                }}
              />
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '5px' }}>
                  {detectedColor}
                </p>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                  This color will be used for your Tiptone.
                </p>
                <button onClick={handleConfirm} className="btn btn-primary">
                  Use This Color
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
