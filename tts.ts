import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Initialize the client with credentials from environment variables
const client = new TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export async function synthesizeSpeech(text: string): Promise<string> {
  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'nl-NL',
        name: 'nl-NL-Wavenet-A',
        ssmlGender: 'FEMALE',
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    // Convert audio content to base64 for browser playback
    const audioContent = response.audioContent;
    if (!audioContent) {
      throw new Error('No audio content received from Google TTS');
    }

    const base64Audio = Buffer.from(audioContent as Uint8Array).toString('base64');
    return `data:audio/mp3;base64,${base64Audio}`;
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
} 