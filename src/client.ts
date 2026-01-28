import axios, { AxiosInstance } from 'axios';
import {
    AuthenticationError,
    BalanceError,
    APIError,
    PlexismsError
} from './exceptions';
import {
    SendSMSOptions,
    SMSResponse,
    SendBulkSMSOptions,
    BulkSMSResponse,
    OTPRequestResponse,
    OTPVerifyResponse,
    BalanceResponse,
    MessageStatusResponse
} from './types';

export class Client {
    private client: AxiosInstance;
    private readonly DEFAULT_BASE_URL = "https://server.plexisms.com";

    public messages: Messages;
    public otp: OTP;
    public account: Account;

    /**
     * @param apiKey Your PlexiSMS API Key.
     * @param baseUrl Optional override for API URL.
     */
    constructor(apiKey?: string, baseUrl?: string) {
        const token = apiKey || process.env.PLEXISMS_API_KEY;

        if (!token) {
            throw new AuthenticationError("API Key is required. Pass it to the constructor or set PLEXISMS_API_KEY environment variable.");
        }

        this.client = axios.create({
            baseURL: (baseUrl || process.env.PLEXISMS_BASE_URL || this.DEFAULT_BASE_URL).replace(/\/$/, ""),
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'plexisms-node/1.0.0'
            }
        });

        this.messages = new Messages(this.client);
        this.otp = new OTP(this.client);
        this.account = new Account(this.client);
    }
}

class Resource {
    protected client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }

    protected async request<T>(method: 'get' | 'post', endpoint: string, data?: Record<string, unknown>, params?: Record<string, unknown>): Promise<T> {
        try {
            const response = await this.client.request<T>({
                method,
                url: endpoint,
                data,
                params
            });
            return response.data;
        } catch (error: unknown) {
            this.handleError(error);
            throw error; // Should be unreachable given handleError throws
        }
    }

    protected handleError(error: unknown): void {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as Record<string, unknown>;
            const message = (data?.error || data?.detail || error.message) as string;

            if (status === 401 || status === 403) {
                throw new AuthenticationError(`Unauthorized: ${message}`);
            } else if (status === 402) {
                throw new BalanceError(`Insufficient funds: ${message}`);
            } else if (status && status >= 500) {
                throw new APIError(`Server Error (${status}): ${message}`, status, data);
            } else if (status) {
                throw new APIError(`API Error (${status}): ${message}`, status, data);
            } else {
                throw new PlexismsError(`Network Error: ${error.message}`);
            }
        }
        throw new PlexismsError(`Unexpected Error: ${error}`);
    }
}

export class Messages extends Resource {
    /**
     * Send a single SMS
     */
    async create(options: SendSMSOptions): Promise<SMSResponse> {
        return this.request<SMSResponse>('post', '/api/sms/send/', {
            phone_number: options.to,
            message: options.body,
            sender_id: options.senderId,
            sms_type: options.smsType || 'transactional'
        });
    }

    /**
     * Send bulk SMS
     */
    async createBulk(options: SendBulkSMSOptions): Promise<BulkSMSResponse> {
        return this.request<BulkSMSResponse>('post', '/api/sms/send-bulk/', {
            phone_numbers: options.phoneNumbers,
            message: options.body,
            sender_id: options.senderId,
            sms_type: options.smsType || 'transactional'
        });
    }

    /**
     * Get SMS status
     */
    async get(messageId: string | number): Promise<MessageStatusResponse> {
        return this.request('get', `/api/sms/${messageId}/status/`);
    }
}

export class OTP extends Resource {
    /**
     * Send an OTP code
     */
    async send(to: string, brand: string = "PlexiSMS"): Promise<OTPRequestResponse> {
        return this.request<OTPRequestResponse>('post', '/api/sms/send-otp/', {
            phone_number: to,
            brand
        });
    }

    /**
     * Verify an OTP code
     */
    async verify(verificationId: string, code: string): Promise<OTPVerifyResponse> {
        return this.request<OTPVerifyResponse>('post', '/api/sms/verify-otp/', {
            verification_id: verificationId,
            otp_code: code
        });
    }
}

export class Account extends Resource {
    /**
     * Check account balance
     */
    async balance(): Promise<BalanceResponse> {
        return this.request<BalanceResponse>('get', '/api/sms/balance/');
    }
}
