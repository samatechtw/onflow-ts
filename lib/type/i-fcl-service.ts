import { FclServiceMethod, FclServiceType } from '../wallet'

export interface IFclService {
  f_type: 'Service'
  f_vsn: '1.0.0'
  uid?: string
  id?: string
  type: FclServiceType
  endpoint?: string
  method?: FclServiceMethod
  address?: string
  addr?: string
  keyId?: number
  identity?: {
    address?: string
    keyId?: number
    addr?: string
  }
  provider?: Record<string, string>
  params?: Record<string, string>
  scoped?: Record<string, string>
  data?: Record<string, unknown>
  authn?: string
}
