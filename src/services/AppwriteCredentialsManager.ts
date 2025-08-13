// Gerenciador de credenciais do Appwrite
export class AppwriteCredentialsManager {
  private static readonly PROJECT_ID_KEY = 'appwrite_project_id';
  private static readonly API_KEY_KEY = 'appwrite_api_key';

  // Salvar credenciais no localStorage
  static saveCredentials(projectId: string, apiKey: string): void {
    localStorage.setItem(this.PROJECT_ID_KEY, projectId);
    localStorage.setItem(this.API_KEY_KEY, apiKey);
    
    // Notificar que as credenciais mudaram
    this.reloadClient();
  }

  // Carregar credenciais do localStorage
  static loadCredentials(): { projectId: string; apiKey: string } {
    const projectId = localStorage.getItem(this.PROJECT_ID_KEY) || '';
    const apiKey = localStorage.getItem(this.API_KEY_KEY) || '';
    return { projectId, apiKey };
  }

  // Verificar se as credenciais estão salvas
  static hasCredentials(): boolean {
    const { projectId, apiKey } = this.loadCredentials();
    return !!(projectId && apiKey);
  }

  // Limpar credenciais
  static clearCredentials(): void {
    localStorage.removeItem(this.PROJECT_ID_KEY);
    localStorage.removeItem(this.API_KEY_KEY);
    
    // Notificar que as credenciais foram limpas
    this.reloadClient();
  }

  // Obter Project ID (localStorage primeiro, depois env)
  static getProjectId(): string {
    const saved = localStorage.getItem(this.PROJECT_ID_KEY);
    return saved || import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
  }

  // Obter API Key (localStorage primeiro, depois env)
  static getApiKey(): string {
    const saved = localStorage.getItem(this.API_KEY_KEY);
    return saved || import.meta.env.VITE_APPWRITE_API_KEY || '';
  }

  // Atualizar cliente Appwrite com novas credenciais
  static updateClient(client: any): void {
    const projectId = this.getProjectId();
    
    if (projectId) {
      client.setProject(projectId);
    }
    
    // Nota: setKey não está disponível no cliente browser do Appwrite
    // A API Key é usada apenas para operações administrativas no backend
  }

  // Função para recarregar o cliente quando as credenciais mudarem
  static reloadClient(): void {
    // Disparar evento customizado para notificar que as credenciais mudaram
    window.dispatchEvent(new CustomEvent('appwriteCredentialsChanged'));
  }
}
