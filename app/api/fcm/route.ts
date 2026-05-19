import { NextResponse } from 'next/server';
import admin from '@/firebase/firebase.admin';

export async function POST(req: Request) {
  const body = await req.json();
  const { heading, content, urgency } = body;

  if (!heading || !content) {
    return NextResponse.json(
      { error: 'heading and content are required' },
      { status: 400 }
    );
  }

  try {
    const messageId = await admin.messaging().send({
      topic: 'avisos',
      notification: {
        title: heading,
        body: content,
      },
      data: {
        type: 'aviso',
        urgency: urgency ?? 'normal',
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'avisos_channel',
        },
      },
    });

    return NextResponse.json({ messageId });
  } catch (error) {
    console.error('Error al enviar la notificación FCM:', error);
    return NextResponse.json(
      { error: 'Error al enviar la notificación' },
      { status: 500 }
    );
  }
}
