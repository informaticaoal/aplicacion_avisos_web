import { Client, Account } from 'appwrite';

export const client = new Client();
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(projectID);

export const account = new Account(client);
export { ID } from 'appwrite';
