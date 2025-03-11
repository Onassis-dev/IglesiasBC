import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
dotenv.config();

const serviceAccount: object = {
  type: 'service_account',
  project_id: 'iglesiasbc-os',
  private_key_id: '0526c7b29feed3a4312fc85e06b3750a02d6e4f5',
  private_key: process.env.FIREBASE_PRIVATE_KEY.replaceAll('\\n', '\n'),
  client_email: 'firebase-adminsdk-1j8oi@iglesiasbc-os.iam.gserviceaccount.com',
  client_id: '101599338776402859468',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1j8oi%40iglesiasbc-os.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'iglesiasbc-os.appspot.com',
});

export const auth = getAuth();
