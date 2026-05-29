import { NextResponse } from 'next/server';
import { Client, Storage } from 'node-appwrite';

export async function DELETE(req: Request) {
  const { fileId } = await req.json();

  if (!fileId) {
    return NextResponse.json({ error: 'fileId es requerido' }, { status: 400 });
  }

  const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID;
  const appwriteApiKey = process.env.APPWRITE_API_KEY;
  const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!bucketId || !appwriteApiKey || !appwriteProjectId) {
    return NextResponse.json({ error: 'Configuración de Appwrite incompleta' }, { status: 500 });
  }

  try {
    const client = new Client()
      .setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject(appwriteProjectId)
      .setKey(appwriteApiKey);

    const storage = new Storage(client);
    await storage.deleteFile(bucketId, fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar el archivo de Appwrite:', error);
    return NextResponse.json({ error: 'Error al eliminar el archivo' }, { status: 500 });
  }
}
