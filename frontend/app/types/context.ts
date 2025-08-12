export interface AppData {
  currentUser: number;
  token: string;
}

export type AppDataContextType = {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>
}
