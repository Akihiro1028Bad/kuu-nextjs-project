"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const MAX_RECORDING_TIME = 30; // 最大30秒

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
    };
  }, [audioUrl]);

  // 音量レベルを測定する関数
  const measureVolume = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // 音量レベルの計算
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setVolumeLevel(average);

    if (isRecording) {
      animationFrameRef.current = requestAnimationFrame(measureVolume);
    }
  }, [isRecording]);

  // 録音開始
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // 音量レベル測定のためのAudioContext設定
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // サポートされているMIMEタイプを取得
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/wav'
      ];
      const supportedType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: supportedType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // 音量測定を停止
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        setVolumeLevel(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // 録音時間のカウント
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // 最大録音時間に達したら自動停止
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return newTime;
        });
      }, 1000);

      // 音量測定開始
      measureVolume();

    } catch (error) {
      console.error('録音の開始に失敗しました:', error);
      alert('マイクへのアクセスが許可されていません。ブラウザの設定を確認してください。');
    }
  }, [measureVolume]);

  // 録音停止
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 音量測定を停止
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setVolumeLevel(0);

      // ストリームを停止
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  // 録音一時停止/再開
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      // タイマー再開
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return newTime;
        });
      }, 1000);
      // 音量測定再開
      measureVolume();
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      // タイマー停止
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // 音量測定停止
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isPaused, measureVolume, stopRecording]);

  // 録音リセット
  const resetRecording = useCallback(() => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingTime(0);
    setSoundName('');
    setUploadMessage('');
  }, [stopRecording]);

  // 録音データのアップロード
  const uploadRecording = async () => {
    if (!audioBlob || !soundName.trim()) {
      setUploadMessage('音声名を入力してください');
      return;
    }

    setIsUploading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, `${soundName}.webm`);
      formData.append('name', soundName);

      await axios.post('/api/kuu/sounds', formData);
      
      setUploadMessage('録音がアップロードされました！');
      resetRecording();
      onUploadSuccess();
    } catch (error: any) {
      setUploadMessage(error.response?.data?.message || 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  // 時間のフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ブラウザがサポートされていない場合
  if (isSupported === false) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-orange-200">
        <h4 className="text-lg font-semibold text-orange-800 mb-4">録音で音声を追加</h4>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">🎤</div>
          <p className="text-orange-700 font-medium mb-2">録音機能がサポートされていません</p>
          <p className="text-sm text-orange-600">
            お使いのブラウザでは録音機能が利用できません。<br />
            ファイルアップロード機能をご利用ください。
          </p>
        </div>
      </div>
    );
  }

  // サポートチェック中
  if (isSupported === null) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-orange-200">
        <h4 className="text-lg font-semibold text-orange-800 mb-4">録音で音声を追加</h4>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-orange-600 mt-2">録音機能を確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-orange-200">
      <h4 className="text-lg font-semibold text-orange-800 mb-4">録音で音声を追加</h4>
      
      <div className="space-y-4">
        {/* 録音コントロール */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <span className="w-3 h-3 bg-white rounded-full"></span>
              <span>録音開始</span>
            </button>
          )}

          {isRecording && (
            <>
              <button
                onClick={togglePause}
                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
              >
                {isPaused ? '再開' : '一時停止'}
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              >
                録音停止
              </button>
            </>
          )}

          {audioBlob && (
            <button
              onClick={resetRecording}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              やり直し
            </button>
          )}
        </div>

        {/* 録音時間表示 */}
        {isRecording && (
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-orange-600 mb-2">
              {isPaused ? '一時停止中' : '録音中...'}
            </div>
            
            {/* 最大録音時間の表示 */}
            <div className="text-xs text-orange-500 mb-3">
              最大録音時間: {formatTime(MAX_RECORDING_TIME)}
            </div>
            
            {/* 音量レベル表示 */}
            <div className="w-full max-w-xs mx-auto">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-orange-600">音量:</span>
                <div className="flex-1 bg-orange-100 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${Math.min(100, (volumeLevel / 128) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-orange-500">
                {volumeLevel > 0 ? '🎤 音声を検出中' : '🔇 音声を検出していません'}
              </div>
            </div>
          </div>
        )}

        {/* 録音プレビュー */}
        {audioUrl && (
          <div className="space-y-3">
            <h5 className="font-medium text-orange-800">録音プレビュー</h5>
            <audio controls src={audioUrl} className="w-full" />
            
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">
                音声の名前
              </label>
              <input
                type="text"
                value={soundName}
                onChange={(e) => setSoundName(e.target.value)}
                placeholder="例：癒やしのくぅー"
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={uploadRecording}
              disabled={isUploading || !soundName.trim()}
              className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'アップロード中...' : '録音を保存'}
            </button>
          </div>
        )}

        {/* メッセージ表示 */}
        {uploadMessage && (
          <p className={`text-sm ${uploadMessage.includes('失敗') ? 'text-red-600' : 'text-green-600'}`}>
            {uploadMessage}
          </p>
        )}

        {/* 録音のヒント */}
        <div className="text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
          <p className="font-medium mb-1">録音のコツ：</p>
          <ul className="space-y-1">
            <li>• 静かな環境で録音しましょう</li>
            <li>• マイクから適度な距離を保ちましょう</li>
            <li>• 「くぅー」の感情を込めて録音しましょう</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 