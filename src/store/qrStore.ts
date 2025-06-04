import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface QRCode {
  id: string;
  name: string;
  originalUrl: string;
  currentUrl: string;
  shortCode: string;
  createdAt: string;
  style: QRCodeStyle;
  scans: QRScan[];
}

export interface QRCodeStyle {
  size: number;
  color: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  logoUrl?: string;
}

export interface QRScan {
  id: string;
  timestamp: string;
  userAgent: string;
  ip: string;
  country?: string;
  city?: string;
  device: string;
}

interface QRStore {
  qrCodes: QRCode[];
  currentQR: QRCode | null;
  
  // Actions
  createQRCode: (name: string, url: string, style?: Partial<QRCodeStyle>) => QRCode;
  updateQRCode: (id: string, updates: Partial<QRCode>) => void;
  deleteQRCode: (id: string) => void;
  setCurrentQR: (qr: QRCode | null) => void;
  updateQRUrl: (id: string, newUrl: string) => void;
  addScan: (id: string, scan: Omit<QRScan, 'id'>) => void;
  getQRByShortCode: (shortCode: string) => QRCode | undefined;
}

export const useQRStore = create<QRStore>()(
  persist(
    (set, get) => ({
      qrCodes: [],
      currentQR: null,

      createQRCode: (name: string, url: string, style?: Partial<QRCodeStyle>) => {
        const qrCode: QRCode = {
          id: nanoid(),
          name,
          originalUrl: url,
          currentUrl: url,
          shortCode: nanoid(8),
          createdAt: new Date().toISOString(),
          style: {
            size: 200,
            color: '#000000',
            backgroundColor: '#ffffff',
            errorCorrectionLevel: 'M',
            margin: 4,
            ...style,
          },
          scans: [],
        };

        set((state) => ({
          qrCodes: [...state.qrCodes, qrCode],
          currentQR: qrCode,
        }));

        return qrCode;
      },

      updateQRCode: (id: string, updates: Partial<QRCode>) => {
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, ...updates } : qr
          ),
          currentQR: state.currentQR?.id === id 
            ? { ...state.currentQR, ...updates } 
            : state.currentQR,
        }));
      },

      deleteQRCode: (id: string) => {
        set((state) => ({
          qrCodes: state.qrCodes.filter((qr) => qr.id !== id),
          currentQR: state.currentQR?.id === id ? null : state.currentQR,
        }));
      },

      setCurrentQR: (qr: QRCode | null) => {
        set({ currentQR: qr });
      },

      updateQRUrl: (id: string, newUrl: string) => {
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, currentUrl: newUrl } : qr
          ),
          currentQR: state.currentQR?.id === id
            ? { ...state.currentQR, currentUrl: newUrl }
            : state.currentQR,
        }));
      },

      addScan: (id: string, scan: Omit<QRScan, 'id'>) => {
        const newScan: QRScan = {
          ...scan,
          id: nanoid(),
        };

        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, scans: [...qr.scans, newScan] } : qr
          ),
          currentQR: state.currentQR?.id === id
            ? { ...state.currentQR, scans: [...state.currentQR.scans, newScan] }
            : state.currentQR,
        }));
      },

      getQRByShortCode: (shortCode: string) => {
        return get().qrCodes.find((qr) => qr.shortCode === shortCode);
      },
    }),
    {
      name: 'qr-store',
    }
  )
); 