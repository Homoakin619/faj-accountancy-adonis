import { DateTime } from 'luxon'

export default interface UserInterface{
  id?: number
  
  firstname?: string,
  
  lastname?: string,
  
  email: string,
  
  password: string,
  
  subscription?: number[],

  isSuspended?: boolean,

  createdAt: DateTime

  updatedAt: DateTime
}

export interface UserRegistrationInterface {
  firstname: string,
  lastname: string,
  email: string,
  password: string
}

export interface UserLoginInterface {
  email: string,
  password: string
}
