"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import * as vad from '@ricky0123/vad-web';
import Modal from './Modal';

interface AudioRecorderProps {
  onUploadSuccess: () => void;
}

export default function AudioRecorder({ onUploadSuccess }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [soundName, setSoundName] = useState('');
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isVoiceDetected, setIsVoiceDetected] = useState(false);
  const [voiceDetectionStatus, setVoiceDetectionStatus] = useState<'idle' | 'loading' | 'ready' | 'error' | 'permission-denied'>('idle');
  
  // 連続録音用の状態
  const [isContinuousRecording, setIsContinuousRecording] = useState(false);
  const [audioSegments, setAudioSegments] = useState<Float32Array[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  
  // モーダル状態
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const voiceDetectionRef = useRef<vad.MicVAD | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const MAX_RECORDING_TIME = 30; // 最大30秒

  // モーダル表示用ヘルパー関数
  const showSuccessModal = useCallback((title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType('success');
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Float32ArrayをWAVファイルに変換する関数（修正版）
  const convertFloat32ArrayToWav = (audioData: Float32Array, sampleRate: number): Blob => {
    console.log('WAV変換開始:', { 
      audioDataLength: audioData.length, 
      sampleRate, 
      duration: audioData.length / sampleRate 
    });

    const numChannels = 1; // モノラル
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioData.length * bytesPerSample;
    const fileSize = 36 + dataSize;

    console.log('WAVヘッダー情報:', {
      dataSize,
      fileSize,
      byteRate,
      blockAlign
    });

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // WAVヘッダー（修正版）
    // RIFF identifier
    view.setUint8(0, 0x52); // R
    view.setUint8(1, 0x49); // I
    view.setUint8(2, 0x46); // F
    view.setUint8(3, 0x46); // F

    // File size (little endian)
    view.setUint32(4, fileSize, true);

    // WAVE identifier
    view.setUint8(8, 0x57); // W
    view.setUint8(9, 0x41); // A
    view.setUint8(10, 0x56); // V
    view.setUint8(11, 0x45); // E

    // fmt chunk
    view.setUint8(12, 0x66); // f
    view.setUint8(13, 0x6D); // m
    view.setUint8(14, 0x74); // t
    view.setUint8(15, 0x20); // space

    // fmt chunk size (16 for PCM)
    view.setUint32(16, 16, true);

    // Audio format (1 for PCM)
    view.setUint16(20, 1, true);

    // Number of channels
    view.setUint16(22, numChannels, true);

    // Sample rate
    view.setUint32(24, sampleRate, true);

    // Byte rate
    view.setUint32(28, byteRate, true);

    // Block align
    view.setUint16(32, blockAlign, true);

    // Bits per sample
    view.setUint16(34, bitsPerSample, true);

    // data chunk
    view.setUint8(36, 0x64); // d
    view.setUint8(37, 0x61); // a
    view.setUint8(38, 0x74); // t
    view.setUint8(39, 0x61); // a

    // data chunk size
    view.setUint32(40, dataSize, true);

    // Audio data
    let offset = 44;
    let maxSample = 0;
    let minSample = 0;
    
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
      
      // デバッグ用：最大・最小値を記録
      if (sample > maxSample) maxSample = sample;
      if (sample < minSample) minSample = sample;
    }

    console.log('WAV変換完了:', {
      maxSample,
      minSample,
      bufferSize: buffer.byteLength,
      expectedSize: 44 + dataSize
    });

    return new Blob([buffer], { type: 'audio/wav' });
  };

  // 代替の音声変換関数（WebM形式）
  const convertFloat32ArrayToWebM = async (audioData: Float32Array, sampleRate: number): Promise<Blob> => {
    console.log('WebM変換開始');
    
    try {
      // AudioContextを作成
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Float32ArrayをAudioBufferに変換
      const audioBuffer = audioContext.createBuffer(1, audioData.length, sampleRate);
      audioBuffer.getChannelData(0).set(audioData);
      
      // AudioBufferをBlobに変換
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(mediaStreamDestination);
      source.start();
      
      // MediaRecorderでWebMに変換
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          console.log('WebM変換完了:', { size: blob.size });
          resolve(blob);
        };
        
        mediaRecorder.onerror = reject;
        
        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
          audioContext.close();
        }, 100);
      });
    } catch (error) {
      console.error('WebM変換エラー:', error);
      throw error;
    }
  };

  // 音声セグメントを結合する関数
  const combineAudioSegments = (segments: Float32Array[]): Float32Array => {
    if (segments.length === 0) return new Float32Array(0);
    if (segments.length === 1) return segments[0];
    
    // 全セグメントの合計長を計算
    const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0);
    const combined = new Float32Array(totalLength);
    
    let offset = 0;
    for (const segment of segments) {
      combined.set(segment, offset);
      offset += segment.length;
    }
    
    return combined;
  };

  // 連続録音を開始する関数
  const startContinuousRecording = useCallback(() => {
    setIsContinuousRecording(true);
    setAudioSegments([]);
    setRecordingStartTime(Date.now());
    console.log('連続録音開始');
  }, []);

  // 連続録音を停止する関数
  const stopContinuousRecording = useCallback(async () => {
    if (!isContinuousRecording || audioSegments.length === 0) {
      setIsContinuousRecording(false);
      setAudioSegments([]);
      setRecordingStartTime(null);
      return;
    }
    
    console.log(`連続録音停止: ${audioSegments.length}セグメント`);
    
    // セグメントを結合
    const combinedAudio = combineAudioSegments(audioSegments);
    console.log('結合後の音声データ:', {
      length: combinedAudio.length,
      duration: combinedAudio.length / 16000,
      segments: audioSegments.length
    });
    
    // 結合した音声を処理
    try {
      console.log('WAV形式で変換を試行...');
      const wavBlob = convertFloat32ArrayToWav(combinedAudio, 16000);
      
      console.log('WAV Blob詳細:', {
        size: wavBlob.size,
        type: wavBlob.type
      });

      setAudioBlob(wavBlob);
      setAudioUrl(URL.createObjectURL(wavBlob));
      console.log('連続録音完了:', combinedAudio.length, 'サンプル');
      
    } catch (wavError) {
      console.error('WAV変換エラー:', wavError);
      
      try {
        console.log('WebM形式で変換を試行...');
        const webmBlob = await convertFloat32ArrayToWebM(combinedAudio, 16000);
        
        console.log('WebM Blob詳細:', {
          size: webmBlob.size,
          type: webmBlob.type
        });

        setAudioBlob(webmBlob);
        setAudioUrl(URL.createObjectURL(webmBlob));
        console.log('連続録音完了（WebM）:', combinedAudio.length, 'サンプル');
        
      } catch (webmError) {
        console.error('WebM変換エラー:', webmError);
        
        console.log('生データ形式で保存...');
        const fallbackBlob = new Blob([combinedAudio], { type: 'audio/raw' });
        setAudioBlob(fallbackBlob);
        setAudioUrl(URL.createObjectURL(fallbackBlob));
        console.log('連続録音完了（生データ）:', combinedAudio.length, 'サンプル');
      }
    }
    
    // 状態をリセット
    setIsContinuousRecording(false);
    setAudioSegments([]);
    setRecordingStartTime(null);
  }, [isContinuousRecording, audioSegments, convertFloat32ArrayToWav, convertFloat32ArrayToWebM]);

  // マイク権限をチェックする関数
  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      // 既存の権限をチェック
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (permission.state === 'granted') {
        return true;
      } else if (permission.state === 'denied') {
        return false;
      } else {
        // 権限が未設定の場合は、一時的にマイクにアクセスして権限を要求
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      }
    } catch (error) {
      console.error('マイク権限チェックエラー:', error);
      return false;
    }
  };

  // 自動音声検出の初期化（基本設定）
  useEffect(() => {
    const initVoiceDetection = async () => {
      try {
        setVoiceDetectionStatus('loading');
        
        // マイク権限をチェック
        const hasPermission = await checkMicrophonePermission();
        if (!hasPermission) {
          setVoiceDetectionStatus('permission-denied');
          return;
        }
        
        // 自動音声検出の初期化（より安定した設定）
        voiceDetectionRef.current = await vad.MicVAD.new({
          onSpeechStart: () => {
            console.log('音声検出開始');
            setIsVoiceDetected(true);
          },
          onSpeechEnd: async (audio) => {
            console.log('音声検出終了');
            setIsVoiceDetected(false);
            
            // 音声が検出された場合のみ録音データを保存
            if (audio && audio.length > 0) {
              console.log('VAD音声データ詳細:', {
                length: audio.length,
                type: audio.constructor.name,
                sampleRate: 16000,
                duration: audio.length / 16000,
                firstFewSamples: Array.from(audio.slice(0, 10)),
                lastFewSamples: Array.from(audio.slice(-10))
              });

              // 連続録音モードの場合はセグメントとして保存
              if (isContinuousRecording) {
                console.log('連続録音セグメント追加:', audio.length, 'サンプル');
                setAudioSegments(prev => [...prev, audio]);
                return;
              }

              // 単発録音モード（従来の処理）
              const minDuration = 0.5; // 秒（短い音声も取得）
              const minSamples = minDuration * 16000; // サンプル数
              
              if (audio.length >= minSamples) {
                try {
                  // まずWAV形式を試す
                  console.log('WAV形式で変換を試行...');
                  const wavBlob = convertFloat32ArrayToWav(audio, 16000);
                  
                  console.log('WAV Blob詳細:', {
                    size: wavBlob.size,
                    type: wavBlob.type
                  });

                  setAudioBlob(wavBlob);
                  setAudioUrl(URL.createObjectURL(wavBlob));
                  console.log('WAV形式で音声録音完了:', audio.length, 'サンプル');
                  
                } catch (wavError) {
                  console.error('WAV変換エラー:', wavError);
                  
                  // WAVが失敗した場合はWebM形式を試す
                  try {
                    console.log('WebM形式で変換を試行...');
                    const webmBlob = await convertFloat32ArrayToWebM(audio, 16000);
                    
                    console.log('WebM Blob詳細:', {
                      size: webmBlob.size,
                      type: webmBlob.type
                    });

                    setAudioBlob(webmBlob);
                    setAudioUrl(URL.createObjectURL(webmBlob));
                    console.log('WebM形式で音声録音完了:', audio.length, 'サンプル');
                    
                  } catch (webmError) {
                    console.error('WebM変換エラー:', webmError);
                    
                    // 最後の手段：生データをBlobとして保存
                    console.log('生データ形式で保存...');
                    const fallbackBlob = new Blob([audio], { type: 'audio/raw' });
                    setAudioBlob(fallbackBlob);
                    setAudioUrl(URL.createObjectURL(fallbackBlob));
                    console.log('生データ形式で音声録音完了:', audio.length, 'サンプル');
                  }
                }
              } else {
                console.log('音声が短すぎます:', audio.length, 'サンプル');
              }
            }
          },
          onVADMisfire: () => {
            console.log('VAD誤検出');
            setIsVoiceDetected(false);
          },
          onFrameProcessed: (probabilities, frame) => {
            // フレーム処理のログ（デバッグ用）
            console.log('VAD確率:', probabilities);
          },
          // VADの感度を調整（連続録音対応）
          minSpeechFrames: 3, // 最小音声フレーム数（連続録音では短めに）
          frameSamples: 1024, // フレームあたりのサンプル数（デフォルト: 1024）
          positiveSpeechThreshold: 0.5, // 音声判定の閾値（連続録音では低めに）
          negativeSpeechThreshold: 0.2, // 非音声判定の閾値（連続録音では低めに）
          redemptionFrames: 8, // 誤検出修正フレーム数（連続録音では短めに）
          preSpeechPadFrames: 1 // 音声開始前のパディング（連続録音では少なめに）
        });

        setVoiceDetectionStatus('ready');
        console.log('自動音声検出初期化完了');
      } catch (error) {
        console.error('自動音声検出初期化エラー:', error);
        
        // 権限エラーの場合は特別な処理
        if (error instanceof Error && error.name === 'NotAllowedError') {
          setVoiceDetectionStatus('permission-denied');
        } else {
          setVoiceDetectionStatus('error');
        }
      }
    };

    initVoiceDetection();

    return () => {
      if (voiceDetectionRef.current) {
        try {
          voiceDetectionRef.current.destroy();
        } catch (error) {
          console.error('自動音声検出破棄エラー:', error);
        }
      }
    };
  }, []);



  // ブラウザの録音機能サポートチェック
  useEffect(() => {
    const checkSupport = () => {
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasMediaRecorder = !!window.MediaRecorder;
      
      if (!hasMediaDevices) {
        setIsSupported(false);
        return;
      }
      
      if (!hasMediaRecorder) {
        setIsSupported(false);
        return;
      }

      // MediaRecorderのサポートされているMIMEタイプをチェック
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/wav'
      ];
      
      const supportedType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
      setIsSupported(!!supportedType);
    };

    checkSupport();

    // クリーンアップ関数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (error) {
          console.error('AudioContext閉じるエラー:', error);
        }
      }
    };
  }, [audioUrl]);

  // 音量レベルを測定する関数
  const measureVolume = useCallback(() => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    setVolumeLevel(rms * 100);
    
    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(measureVolume);
    }
  }, [isRecording]);

  // 権限を再要求する関数
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('マイク権限要求エラー:', error);
      return false;
    }
  };

  // 自動音声検出録音開始
  const startRecording = useCallback(async () => {
    // 連続録音モードを開始
    startContinuousRecording();
    
    try {
      if (voiceDetectionStatus === 'permission-denied') {
        const granted = await requestMicrophonePermission();
        if (granted) {
          // 権限が許可された場合は初期化を再実行
          setVoiceDetectionStatus('loading');
          const hasPermission = await checkMicrophonePermission();
          if (hasPermission) {
            // VADを再初期化
            try {
              voiceDetectionRef.current = await vad.MicVAD.new({
                onSpeechStart: () => {
                  console.log('音声検出開始');
                  setIsVoiceDetected(true);
                },
                onSpeechEnd: async (audio) => {
                  console.log('音声検出終了');
                  setIsVoiceDetected(false);
                  
                  if (audio && audio.length > 0) {
                    console.log('VAD音声データ詳細:', {
                      length: audio.length,
                      type: audio.constructor.name,
                      sampleRate: 16000,
                      duration: audio.length / 16000,
                      firstFewSamples: Array.from(audio.slice(0, 10)),
                      lastFewSamples: Array.from(audio.slice(-10))
                    });

                    const minDuration = 1.0;
                    const minSamples = minDuration * 16000;
                    
                    if (audio.length >= minSamples) {
                      try {
                        console.log('WAV形式で変換を試行...');
                        const wavBlob = convertFloat32ArrayToWav(audio, 16000);
                        
                        console.log('WAV Blob詳細:', {
                          size: wavBlob.size,
                          type: wavBlob.type
                        });

                        setAudioBlob(wavBlob);
                        setAudioUrl(URL.createObjectURL(wavBlob));
                        console.log('WAV形式で音声録音完了:', audio.length, 'サンプル');
                        
                      } catch (wavError) {
                        console.error('WAV変換エラー:', wavError);
                        
                        try {
                          console.log('WebM形式で変換を試行...');
                          const webmBlob = await convertFloat32ArrayToWebM(audio, 16000);
                          
                          console.log('WebM Blob詳細:', {
                            size: webmBlob.size,
                            type: webmBlob.type
                          });

                          setAudioBlob(webmBlob);
                          setAudioUrl(URL.createObjectURL(webmBlob));
                          console.log('WebM形式で音声録音完了:', audio.length, 'サンプル');
                          
                        } catch (webmError) {
                          console.error('WebM変換エラー:', webmError);
                          
                          console.log('生データ形式で保存...');
                          const fallbackBlob = new Blob([audio], { type: 'audio/raw' });
                          setAudioBlob(fallbackBlob);
                          setAudioUrl(URL.createObjectURL(fallbackBlob));
                          console.log('生データ形式で音声録音完了:', audio.length, 'サンプル');
                        }
                      }
                    } else {
                      console.log('音声が短すぎます:', audio.length, 'サンプル');
                    }
                  }
                },
                onVADMisfire: () => {
                  console.log('VAD誤検出');
                  setIsVoiceDetected(false);
                },
                onFrameProcessed: (probabilities, frame) => {
                  console.log('VAD確率:', probabilities);
                },
                minSpeechFrames: 5,
                frameSamples: 1024,
                positiveSpeechThreshold: 0.7,
                negativeSpeechThreshold: 0.3,
                redemptionFrames: 12,
                preSpeechPadFrames: 2
              });
              setVoiceDetectionStatus('ready');
            } catch (error) {
              console.error('VAD再初期化エラー:', error);
              setVoiceDetectionStatus('error');
              return;
            }
          } else {
            setVoiceDetectionStatus('permission-denied');
            return;
          }
        } else {
          alert('マイクの権限が必要です。ブラウザの設定でマイクの使用を許可してください。');
          return;
        }
      } else if (voiceDetectionStatus !== 'ready') {
        alert('音声検出システムの準備が完了していません。しばらく待ってから再試行してください。');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          // 騒音環境対応の追加設定
          channelCount: 1 // モノラル録音
        } 
      });
      
      streamRef.current = stream;

      // AudioContext設定（音量測定用）
      let audioContext: AudioContext;
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContext = audioContextRef.current;
      } else {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
      }
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // 自動音声検出を開始
      if (voiceDetectionRef.current) {
        voiceDetectionRef.current.start();
        console.log('自動音声検出録音開始');
      }

      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl('');
      chunksRef.current = [];

      // タイマー開始
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // 音量測定開始
      measureVolume();

    } catch (error) {
      console.error('VAD録音開始エラー:', error);
      alert('録音を開始できませんでした。マイクの権限を確認してください。');
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceDetectionStatus, measureVolume]);

  // 自動音声検出録音停止
  const stopRecording = useCallback(async () => {
    // 連続録音モードを停止
    await stopContinuousRecording();
    
    try {
      if (voiceDetectionRef.current) {
        voiceDetectionRef.current.pause();
        console.log('自動音声検出録音停止');
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          await audioContextRef.current.close();
        } catch (error) {
          console.error('AudioContext閉じるエラー:', error);
        }
        audioContextRef.current = null;
      }

      setIsRecording(false);
      setIsPaused(false);
      setIsVoiceDetected(false);

    } catch (error) {
      console.error('VAD録音停止エラー:', error);
    }
  }, []);

  // 録音一時停止/再開
  const togglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      measureVolume();
    } else {
      setIsPaused(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isPaused, measureVolume]);

  // 録音リセット
  const resetRecording = useCallback(() => {
    stopRecording();
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioUrl('');
    setSoundName('');
    setIsVoiceDetected(false);
    setIsContinuousRecording(false);
    setAudioSegments([]);
    setRecordingStartTime(null);
  }, [stopRecording]);

    // 音声アップロード
  const uploadAudio = useCallback(async () => {
    if (!audioBlob || !soundName.trim()) {
      alert('音声ファイルとサウンド名を入力してください。');
      return;
    }

    setIsUploading(true);
    setUploadMessage('アップロード中...');

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, `${soundName}.wav`);
      formData.append('name', soundName);

      const response = await axios.post('/api/kuu/sounds', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUploadMessage('アップロード成功！');
        onUploadSuccess();
        resetRecording();
        
        // アップロード成功モーダル表示
        showSuccessModal(
          'アップロード完了',
          `「${soundName}」の音声が正常にアップロードされました！\nくぅー！`
        );
      } else {
        setUploadMessage('アップロードに失敗しました。');
      }
    } catch (error: any) {
      console.error('アップロードエラー:', error);
      const errorMessage = error.response?.data?.message || 'アップロードに失敗しました。';
      setUploadMessage(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [audioBlob, soundName, onUploadSuccess, resetRecording, showSuccessModal]);

  // 音声削除
  const deleteAudio = useCallback(async (soundId: string) => {
    try {
      const response = await axios.delete(`/api/kuu/sounds/${soundId}`);
      
      if (response.status === 200) {
        // 削除成功モーダル表示
        showSuccessModal(
          '削除完了',
          '音声ファイルが正常に削除されました！'
        );
        onUploadSuccess(); // リストを更新
      } else {
        alert('削除に失敗しました。');
      }
    } catch (error: any) {
      console.error('削除エラー:', error);
      const errorMessage = error.response?.data?.message || '削除に失敗しました。';
      alert(errorMessage);
    }
  }, [showSuccessModal, onUploadSuccess]);

  // 時間フォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSupported === false) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center text-red-600">
          <p>このブラウザは録音機能に対応していません。</p>
          <p>Chrome、Firefox、Safariの最新版をご利用ください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        音声録音（自動音声検出対応）
      </h2>

      {/* 音声検出システムステータス表示 */}
      <div className="mb-4 p-3 rounded-lg bg-blue-50">
        <div className="text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>音声検出システム:</span>
            <span className={`font-medium ${
              voiceDetectionStatus === 'ready' ? 'text-green-600' :
              voiceDetectionStatus === 'loading' ? 'text-yellow-600' :
              voiceDetectionStatus === 'error' ? 'text-red-600' :
              voiceDetectionStatus === 'permission-denied' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {voiceDetectionStatus === 'ready' ? '準備完了' :
               voiceDetectionStatus === 'loading' ? '初期化中...' :
               voiceDetectionStatus === 'error' ? 'エラー' :
               voiceDetectionStatus === 'permission-denied' ? '権限拒否' : '待機中'}
            </span>
          </div>
          
          {/* 音声検出インジケーター */}
          {isRecording && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-600 mr-2">音声検出:</span>
              <div className={`w-3 h-3 rounded-full ${
                isVoiceDetected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-600 ml-2">
                {isVoiceDetected ? '検出中' : '待機中'}
              </span>
            </div>
          )}
          
          {/* 連続録音インジケーター */}
          {isContinuousRecording && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-600 mr-2">連続録音:</span>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm text-gray-600 ml-2">
                {audioSegments.length}セグメント ({recordingStartTime ? Math.round((Date.now() - recordingStartTime) / 1000) : 0}秒)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 録音時間表示 */}
      <div className="text-center mb-4">
        <div className="text-3xl font-mono text-gray-800">
          {formatTime(recordingTime)}
        </div>
        <div className="text-sm text-gray-600">
          {recordingTime >= MAX_RECORDING_TIME ? '最大録音時間に達しました' : '最大30秒'}
        </div>
      </div>

      {/* 音量レベル表示 */}
      {isRecording && !isPaused && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>音量レベル</span>
            <span>{Math.round(volumeLevel)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${Math.min(volumeLevel, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 録音コントロール */}
      {!audioUrl && (
        <div className="flex justify-center space-x-4 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={voiceDetectionStatus !== 'ready' && voiceDetectionStatus !== 'permission-denied'}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                voiceDetectionStatus === 'ready'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : voiceDetectionStatus === 'permission-denied'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {voiceDetectionStatus === 'permission-denied' ? '権限を許可して録音開始' : '録音開始'}
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className="px-6 py-3 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
              >
                {isPaused ? '再開' : '一時停止'}
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                録音停止
              </button>
            </>
          )}
        </div>
      )}

      {/* 録音結果表示 */}
      {audioUrl && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">録音結果</h3>
          <audio controls className="w-full mb-4">
            <source src={audioUrl} type={audioBlob?.type || 'audio/wav'} />
            お使いのブラウザは音声再生に対応していません。
          </audio>
          

          
          <div className="mb-4">
            <label htmlFor="soundName" className="block text-sm font-medium text-gray-700 mb-2">
              サウンド名
            </label>
            <input
              type="text"
              id="soundName"
              value={soundName}
              onChange={(e) => setSoundName(e.target.value)}
              placeholder="サウンド名を入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={uploadAudio}
              disabled={isUploading || !soundName.trim()}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isUploading || !soundName.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isUploading ? 'アップロード中...' : 'アップロード'}
            </button>
            <button
              onClick={resetRecording}
              className="px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            >
              リセット
            </button>
          </div>

          {uploadMessage && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              uploadMessage.includes('成功') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {uploadMessage}
            </div>
          )}
        </div>
      )}

      {/* 使用方法説明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">使用方法</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>連続録音モード</strong>: 長い音声を途切れることなく録音</li>
          <li>• 音声が検出されると自動的に録音が開始されます</li>
          <li>• 音声が終了しても録音は継続され、次の音声を待機します</li>
          <li>• 録音停止ボタンで全ての音声セグメントを結合して保存</li>
          <li>• 無音部分は自動的に除去され、自然な音声になります</li>
          <li>• 最大30秒まで録音可能</li>
        </ul>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <h5 className="font-semibold text-yellow-800 mb-2">騒音環境での使用</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 騒音環境では1秒以上の音声が必要です</li>
            <li>• 背景音が大きい場合は、マイクに近づいて話してください</li>
            <li>• 短い音声や背景音は自動的に除外されます</li>
            <li>• 音声検出の感度を調整済み（騒音対応）</li>
          </ul>
        </div>
        
        {voiceDetectionStatus === 'permission-denied' && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
            <h5 className="font-semibold text-red-800 mb-2">マイク権限について</h5>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• マイクの使用が拒否されています</li>
              <li>• ブラウザの設定でマイクの使用を許可してください</li>
              <li>• アドレスバーの🔒アイコンをクリックして権限を確認</li>
              <li>• 「権限を許可して録音開始」ボタンをクリックして再試行</li>
            </ul>
          </div>
        )}
      </div>

      {/* モーダル */}
      <Modal
        show={showModal}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
        showKuuEffect={modalType === 'success'}
      />
    </div>
  );
} 