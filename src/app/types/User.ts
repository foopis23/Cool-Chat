export interface User {
  id: string,
  displayName: string,
  photoURL: string
  status: Status
}

export enum Status {
  OFFLINE,
  BUSY,
  DO_NOT_DISTURB,
  ONLINE
}