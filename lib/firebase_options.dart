import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart' show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        return web;
    }
  }

  // Web configuration (from bless-lab Firebase project)
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCW_KaEpbBhgyoTPvb_koMrntlInu35ak4',
    authDomain: 'bless-lab.firebaseapp.com',
    projectId: 'bless-lab',
    storageBucket: 'bless-lab.firebasestorage.app',
    messagingSenderId: '492042770903',
    appId: '1:492042770903:web:d75a65938f9601b2f19392',
    measurementId: 'G-0G6HQTLZ3L',
  );

  // Android configuration (same project)
  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCW_KaEpbBhgyoTPvb_koMrntlInu35ak4',
    authDomain: 'bless-lab.firebaseapp.com',
    projectId: 'bless-lab',
    storageBucket: 'bless-lab.firebasestorage.app',
    messagingSenderId: '492042770903',
    appId: '1:492042770903:web:d75a65938f9601b2f19392',
  );

  // iOS configuration (same project)
  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyCW_KaEpbBhgyoTPvb_koMrntlInu35ak4',
    authDomain: 'bless-lab.firebaseapp.com',
    projectId: 'bless-lab',
    storageBucket: 'bless-lab.firebasestorage.app',
    messagingSenderId: '492042770903',
    appId: '1:492042770903:web:d75a65938f9601b2f19392',
  );
}
