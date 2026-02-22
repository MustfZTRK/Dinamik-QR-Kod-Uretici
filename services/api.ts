import { User, QRCodeData } from '../types';

// In production, we use relative URL. In development, we can use the Vite proxy or hardcoded URL.
export const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api');

export const apiService = {
  // --- USER OPERATIONS (AUTH) ---

  async login(email: string, pass: string): Promise<User> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pass })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Giriş başarısız');
    }

    const user = await response.json();
    localStorage.setItem('qrpro_current_session', JSON.stringify(user));
    return user;
  },

  async register(name: string, email: string, pass: string): Promise<User> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, pass })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Kayıt başarısız');
    }

    const user = await response.json();
    localStorage.setItem('qrpro_current_session', JSON.stringify(user));
    return user;
  },

  // --- QR CODE MANAGEMENT ---

  async getQRCodes(userId: string): Promise<QRCodeData[]> {
    const response = await fetch(`${API_URL}/qrcodes?userId=${userId}`);
    if (!response.ok) throw new Error('Veriler alınamadı');
    return response.json();
  },

  async createQRCode(userId: string, data: QRCodeData): Promise<QRCodeData> {
    const response = await fetch(`${API_URL}/qrcodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data })
    });

    if (!response.ok) throw new Error('Oluşturulamadı');
    return response.json();
  },

  async updateQRCode(userId: string, data: QRCodeData): Promise<QRCodeData> {
    const response = await fetch(`${API_URL}/qrcodes/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, data })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Güncellenemedi');
    }
    return response.json();
  },

  async deleteQRCode(userId: string, qrId: string): Promise<void> {
    const response = await fetch(`${API_URL}/qrcodes/${qrId}?userId=${userId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Silinemedi');
  },

  async incrementScan(qrId: string): Promise<void> {
    await fetch(`${API_URL}/qrcodes/${qrId}/scan`, { method: 'POST' });
  },

  async getPublicQR(qrId: string): Promise<QRCodeData | null> {
    const response = await fetch(`${API_URL}/public/qr/${qrId}`);
    if (!response.ok) return null;
    return response.json();
  }
};
