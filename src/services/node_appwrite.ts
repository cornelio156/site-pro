import { Client, Account, Databases, Storage } from 'appwrite';
import { AppwriteCredentialsManager } from './AppwriteCredentialsManager';

// Appwrite configuration
const endpoint = 'https://fra.cloud.appwrite.io/v1'; // Endpoint fixo
// Usar o gerenciador de credenciais
const projectId = AppwriteCredentialsManager.getProjectId();
const apiKey = AppwriteCredentialsManager.getApiKey();

// Database and collection IDs - IDs simples e consistentes
export const databaseId = 'video_site_db';
export const videoCollectionId = 'videos';
export const userCollectionId = 'users'; 
export const siteConfigCollectionId = 'site_config';
export const sessionCollectionId = 'sessions';

// Storage bucket IDs - IDs simples e consistentes
export const videosBucketId = 'videos_bucket';
export const thumbnailsBucketId = 'thumbnails_bucket';

// Create Appwrite client
const client = new Client();
client.setEndpoint(endpoint);

// Atualizar cliente com credenciais salvas
AppwriteCredentialsManager.updateClient(client);

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Função para recarregar o cliente quando as credenciais mudarem
const reloadClient = () => {
  AppwriteCredentialsManager.updateClient(client);
};

// Escutar mudanças nas credenciais
if (typeof window !== 'undefined') {
  window.addEventListener('appwriteCredentialsChanged', reloadClient);
}

export default client;

