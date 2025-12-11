'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FaceDetector from '@/components/FaceDetector';
import { validateTiptoneName } from '@/lib/validation';
import { getAllColorFormats } from '@/lib/colors';

type Step = 'upload' | 'name' | 'confirm' | 'success';

export default function AddTiptonePage() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [step, setStep] = useState<Step>('upload');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdTiptoneId, setCreatedTiptoneId] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleColorDetected = (hex: string) => {
    setSelectedColor(hex);
    setStep('name');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    if (value.length > 0) {
      const validation = validateTiptoneName(value);
      if (!validation.isValid) {
        setNameError(validation.error || null);
      } else {
        setNameError(null);
      }
    } else {
      setNameError(null);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTiptoneName(name);
    if (!validation.isValid) {
      setNameError(validation.error || null);
      return;
    }

    setStep('confirm');
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async () => {
    if (!selectedColor || !name) return;

    if (!captchaToken) {
      alert('Please complete the CAPTCHA verification');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          hex: selectedColor,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (data.success && data.tiptone) {
        setCreatedTiptoneId(data.tiptone.id);
        setStep('success');
        // Reset captcha for next submission
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {
        alert(data.error || 'Failed to submit Tiptone');
        // Reset captcha on error
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('An error occurred. Please try again.');
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setSubmitting(false);
    }
  };

  const colorFormats = selectedColor ? getAllColorFormats(selectedColor) : null;

  return (
    <>
      <Header />
      <main className="container">
        <h1 style={{ marginTop: '15px', fontSize: '36px' }}>Add a Tiptone</h1>

        {/* Progress indicator */}
        <div className="panel">
          <div className="panel-content">
            <div className="flex gap-2 justify-between" style={{ fontSize: '16px' }}>
              <span style={{ fontWeight: step === 'upload' ? 'bold' : 'normal' }}>
                1. Upload Image
              </span>
              <span style={{ fontWeight: step === 'name' ? 'bold' : 'normal' }}>
                2. Name Your Tiptone
              </span>
              <span style={{ fontWeight: step === 'confirm' ? 'bold' : 'normal' }}>
                3. Confirm
              </span>
              <span style={{ fontWeight: step === 'success' ? 'bold' : 'normal' }}>
                4. Done
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <FaceDetector onColorDetected={handleColorDetected} />
        )}

        {/* Step 2: Name */}
        {step === 'name' && selectedColor && (
          <div className="panel">
            <div className="panel-header">Name Your Tiptone</div>
            <div className="panel-content">
              <div className="flex gap-3 mb-3">
                <div
                  className="color-swatch"
                  style={{
                    backgroundColor: selectedColor,
                    width: '60px',
                    height: '60px',
                  }}
                />
                <div>
                  {/* <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{selectedColor}</p> */}
                  <button
                    onClick={() => setStep('upload')}
                    className="btn"
                    style={{ fontSize: '10px' }}
                  >
                    Make a new selection
                  </button>
                </div>
              </div>

              <hr />

              <form onSubmit={handleNameSubmit}>
                <div className="mb-2">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Tiptone Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g., Hard Ryan"
                    style={{ width: '100%', maxWidth: '300px' }}
                    maxLength={25}
                  />
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>
                    {name.length}/25 characters
                  </div>
                </div>

                {nameError && (
                  <p style={{ color: '#cc0000', fontSize: '11px', marginBottom: '10px' }}>
                    {nameError}
                  </p>
                )}

                <div className="panel" style={{ background: '#0f0e0eff', marginTop: '10px' }}>
                  <div className="panel-content" style={{ fontSize: '11px' }}>
                    <strong>Naming Guidelines:</strong>
                    <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                      <li>Letters and spaces only (no numbers or symbols)</li>
                      <li>25 characters maximum</li>
             
                    </ul>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!name || !!nameError}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && selectedColor && colorFormats && (
          <div className="panel">
            <div className="panel-header">Confirm Your Tiptone</div>
            <div className="panel-content">
              <div className="flex gap-4">
                <div
                  className="color-swatch"
                  style={{
                    backgroundColor: selectedColor,
                    width: '120px',
                    height: '120px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h2 style={{ marginTop: 0 }}>{name.toUpperCase()}</h2>

                  <table style={{ width: '100%', maxWidth: '300px' }}>
                    <tbody>
                      <tr>
                        <th>Hex</th>
                        <td>{colorFormats.hex}</td>
                      </tr>
                      <tr>
                        <th>RGB</th>
                        <td>
                          {colorFormats.rgb.r}, {colorFormats.rgb.g}, {colorFormats.rgb.b}
                        </td>
                      </tr>
                      <tr>
                        <th>HSL</th>
                        <td>
                          {colorFormats.hsl.h}, {colorFormats.hsl.s}%, {colorFormats.hsl.l}%
                        </td>
                      </tr>
                      <tr>
                        <th>HSV</th>
                        <td>
                          {colorFormats.hsv.h}, {colorFormats.hsv.s}%, {colorFormats.hsv.v}%
                        </td>
                      </tr>
                      <tr>
                        <th>CMYK</th>
                        <td>
                          {colorFormats.cmyk.c}, {colorFormats.cmyk.m}, {colorFormats.cmyk.y},{' '}
                          {colorFormats.cmyk.k}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <hr />

              <div style={{ marginBottom: '16px' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={handleCaptchaChange}
                  theme="dark"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep('name')} className="btn">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={submitting || !captchaToken}
                >
                  {submitting ? 'Submitting...' : 'Submit Tiptone'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && createdTiptoneId && (
          <div className="panel">
            <div className="panel-header">Success!</div>
            <div className="panel-content text-center" style={{ padding: '30px' }}>
              <div
                className="color-swatch"
                style={{
                  backgroundColor: selectedColor || '#ccc',
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 15px',
                }}
              />
              <h2 style={{ marginTop: 0 }}>{name.toUpperCase()}</h2>
              <p>Your Tiptone has been added to the database!</p>
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={() => router.push(`/tiptone/${createdTiptoneId}`)}
                  className="btn btn-primary"
                >
                  View Your Tiptone
                </button>
                <button onClick={() => router.push('/')} className="btn">
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
