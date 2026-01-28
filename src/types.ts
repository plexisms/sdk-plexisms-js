export interface SMSResponse {
    id: number;
    message_id: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    phone_number: string;
    parts: number;
    cost_usd: string;
    balance: {
        remaining_usd: string;
        remaining_sms: number;
    };
}

export interface BulkSMSResponse {
    total: number;
    queued: number;
    task_id: string;
    message: string;
}

export interface OTPRequestResponse {
    verification_id: string;
    status: string;
    phone_number: string;
    expires_in: number;
}

export interface OTPVerifyResponse {
    verified: boolean;
    phone_number?: string;
    error?: string;
}

export interface BalanceResponse {
    amount: string;
    currency: string;
    provider: string;
}

export interface SendSMSOptions {
    to: string;
    body: string;
    senderId?: string;
    smsType?: 'transactional' | 'promotional';
}

export interface SendBulkSMSOptions {
    phoneNumbers: string[];
    body: string;
    senderId?: string;
    smsType?: 'transactional' | 'promotional';
}

export interface MessageStatusResponse {
    id: number;
    message_id: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    phone_number: string;
    parts: number;
    cost_usd: string;
    created_at: string;
    updated_at: string;
}
