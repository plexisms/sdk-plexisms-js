# PlexiSMS Node.js SDK

The official Node.js library for the [PlexiSMS](https://plexisms.com) API. Send SMS, manage OTPs, and check detailed analytics with our reliable Tier-1 network.

## Installation

```bash
npm install plexisms
# or
yarn add plexisms
```

## Usage

### 1. Initialize the Client

```typescript
import { Client } from 'plexisms';

// Option 1: Pass API Key directly
const client = new Client('your_api_key_here');

// Option 2: Use environment variable 'PLEXISMS_API_KEY'
// const client = new Client();
```

### 2. Send an SMS

```typescript
try {
  const result = await client.messages.create({
    to: '+243970000000', // Replace with your phone number
    body: 'Hello from Node.js! 🚀',
    senderId: 'MyApp' // Replace with your sender ID
  });
  
  console.log('SMS Sent! ID:', result.message_id);
} catch (error) {
  console.error('Error:', error.message);
}
```

### 3. Send Bulk SMS

```typescript
const result = await client.messages.createBulk({
  phoneNumbers: ['+243970000000', '+243810000000'],
  body: 'Bulk message test',
  senderId: 'MyApp'
});
console.log(`Queued ${result.queued} messages`);
```

### 4. OTP Verification

```typescript
// Step 1: Send OTP
const otpRes = await client.otp.send('+243970000000', 'MyService');
const verificationId = otpRes.verification_id;

// Step 2: Verify Code
const verifyRes = await client.otp.verify(verificationId, '123456');

if (verifyRes.verified) {
  console.log('User verified successfully!');
} else {
  console.log('Invalid code');
}
```

## Error Handling

```typescript
import { AuthenticationError, BalanceError } from 'plexisms';

try {
  await client.messages.create({...});
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Check your API Key');
  } else if (error instanceof BalanceError) {
    console.error('Top up your account');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## License

MIT
