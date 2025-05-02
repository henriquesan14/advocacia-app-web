export interface Cobranca {
    customerCpf: string
    customerName: string
    customerEmail: string
    billingType: string
    value: number
    dueDate: string
    description: string
    installmentCount: number
    callback: Callback
  }
  
  export interface Callback {
    successUrl: string
  }