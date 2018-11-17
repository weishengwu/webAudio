package com.hello;

import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.net.Uri;
import android.os.Environment;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.widget.Toast;
import java.io.File;
import java.util.Locale;
import android.util.Log;

import com.facebook.react.bridge.Promise;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class TtsModule extends ReactContextBaseJavaModule {
  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  protected static final String INIT_SUCCESSFUL = "Init successful";
  protected static final String INIT_FAILED = "Init failed";

  private MediaPlayer mediaPlayer;
  protected TextToSpeech tts = null;
  protected String initStatus = null;
  protected int maxSpeechInputLength = -1;
  File file;
  int currentPosition = 0;

  public TtsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Tts";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void init(String message, int duration, final Promise promise) {
    if(tts != null){
      this.shutdown();
    }
    tts = new TextToSpeech(getReactApplicationContext(), new TextToSpeech.OnInitListener() {
      @Override
      public void onInit(int status) {
        if(status == TextToSpeech.SUCCESS) {
          tts.setLanguage(Locale.US);
          setMaxSpeechInputLength();
          mediaPlayer = new MediaPlayer();
          setUtteranceProgressListener();
          promise.resolve("Init successful!");

        }else {
          promise.reject("Fail", "Init failed");
        }
      }}
    );
  }

  protected void setMaxSpeechInputLength() {
    this.maxSpeechInputLength = tts.getMaxSpeechInputLength();
  }
  @ReactMethod
  public void getMaxSpeechInputLength(final Promise promise) {
    promise.resolve(this.maxSpeechInputLength);
  }


  protected void setUtteranceProgressListener() {
    this.tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
      @Override
      public void onDone(String utteranceID) {
          Log.v("ReactNative", "setUtteranceProgressListener Success: "+utteranceID);
          // Speech file is created
          initializeMediaPlayer();
      }

      @Override
      public void onError(String utteranceId){
        Log.v("ReactNative", "setUtteranceProgressListener Fail: "+utteranceId);
      }

      @Override
      public void onStart(String utteranceId){
        Log.v("ReactNative", "setUtteranceProgressListener Start: "+utteranceId);
      }
    });
  }
  private void initializeMediaPlayer() {
    Uri uri = Uri.parse("file://"+this.file.getAbsolutePath());

    mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);

    try {
      mediaPlayer.setDataSource(getReactApplicationContext(), uri);
      mediaPlayer.prepare();
      Log.v("ReactNative", "Init MP success");
    } catch (Exception e) {
      Log.v("ReactNative", "Init MP Fail: "+e);
    }

  }

  @ReactMethod
  public void play() {
    mediaPlayer.start();
  }

  @ReactMethod
  public void pause() {
    mediaPlayer.pause();
    this.currentPosition = mediaPlayer.getCurrentPosition();
  }

  @ReactMethod
  public void stop() {
    mediaPlayer.stop();
    this.currentPosition = mediaPlayer.getCurrentPosition();
  }

  @ReactMethod
  public void synthesizeToFile(String text, String fileName, String utteranceID, Promise promise){
    this.file = new File(getReactApplicationContext().getFilesDir(), fileName+".wav");
    Log.v("ReactNative", "Synthesize: "+this.file);

    int stfStatus = this.tts.synthesizeToFile(text, null, file, utteranceID);
    if(stfStatus == TextToSpeech.SUCCESS) {
      promise.resolve("Saving speech to file");
    }else{
      promise.reject("Fail", "Failed to save speech to file");
    }

  }


  @ReactMethod
  public void speak(String text) {
    tts.speak(text, TextToSpeech.QUEUE_ADD, null, null);
  }

  @ReactMethod
  public void shutdown() {
    initStatus = null;
    tts.shutdown();
    tts = null;
  }
}
