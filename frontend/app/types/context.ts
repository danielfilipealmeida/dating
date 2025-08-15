export interface AppData {
  currentUser: string;
  token: string;
}

export type AppDataContextType = {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>
}
