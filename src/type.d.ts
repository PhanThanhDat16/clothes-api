import { JwtPayload } from 'jsonwebtoken'
export interface JwtPayloadCustom extends JwtPayload {
  id: string 
  fullName: string
  email?: string
  phone?: string
}