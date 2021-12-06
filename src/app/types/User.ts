import { Timestamp } from "@firebase/firestore";

export interface User {
  id: string,
  displayName: string,
  photoURL: string
  status: Status,
  lastViewed: { [key: string]: Timestamp }
}

export enum Status {
  OFFLINE,
  BUSY,
  DO_NOT_DISTURB,
  ONLINE
}