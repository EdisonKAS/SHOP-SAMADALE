// transaction.ts

// Type definitions for transactions in the SHOP-SAMADALE project

export type OrderTransaction = {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
};

export type RefundTransaction = {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed';
    createdAt: Date;
};

export type PaymentTransaction = {
    id: string;
    orderId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    status: 'completed' | 'failed';
    createdAt: Date;
};

export type Transaction = OrderTransaction | RefundTransaction | PaymentTransaction;