import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'https://esm.sh/@react-email/components@0.0.22';
import * as React from 'https://esm.sh/react@18.3.1';

interface PaymentReceiptEmailProps {
  userName?: string;
  bookingId?: string;
  propertyTitle?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentDate?: string;
  currency?: string;
  transactionId?: string;
}

export const PaymentReceiptEmail = ({
  userName = 'Guest',
  bookingId = 'XXXX-XXXX',
  propertyTitle = 'Jungle Resort PingPe',
  paymentAmount = 0,
  paymentMethod = 'Credit Card',
  paymentDate = new Date().toLocaleDateString(),
  currency = 'USD',
  transactionId = 'N/A',
}: PaymentReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Payment receipt for your booking at Jungle Resort PingPe</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>💳 Payment Receipt</Heading>
        
        <Text style={text}>
          Dear {userName},
        </Text>
        
        <Text style={text}>
          Thank you for your payment! This email confirms that we have successfully 
          received your payment for booking <strong>#{bookingId}</strong>.
        </Text>

        <Section style={receiptBox}>
          <Heading style={h2}>Payment Details</Heading>
          
          <Text style={detailRow}>
            <strong>Booking Reference:</strong> #{bookingId}
          </Text>
          <Text style={detailRow}>
            <strong>Property:</strong> {propertyTitle}
          </Text>
          <Text style={detailRow}>
            <strong>Payment Amount:</strong> {currency} ${paymentAmount.toFixed(2)}
          </Text>
          <Text style={detailRow}>
            <strong>Payment Method:</strong> {paymentMethod}
          </Text>
          <Text style={detailRow}>
            <strong>Payment Date:</strong> {paymentDate}
          </Text>
          <Text style={detailRow}>
            <strong>Transaction ID:</strong> {transactionId}
          </Text>
        </Section>

        <Section style={successBox}>
          <Text style={successText}>
            ✓ Payment Successful
          </Text>
          <Text style={successSubtext}>
            Your booking is now fully confirmed and paid.
          </Text>
        </Section>

        <Text style={text}>
          A copy of this receipt has been saved to your account for your records. 
          You can access your booking details anytime by logging into your account.
        </Text>

        <Text style={text}>
          We look forward to welcoming you to Jungle Resort PingPe!
        </Text>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Need Help?</strong>
          </Text>
          <Text style={infoText}>
            Contact us at +597 8858525 or info@jungleresortpingpe.com
          </Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This receipt was sent by{' '}
          <Link href="https://jungleresortpingpe.com" style={link}>
            Jungle Resort PingPe
          </Link>
          <br />
          Vidijaweg 25, Wanica, Suriname<br />
          Upper Suriname's Premier Eco-Retreat
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PaymentReceiptEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#3b82f6',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const receiptBox = {
  backgroundColor: '#f8f9fa',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
};

const detailRow = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '8px 0',
};

const successBox = {
  backgroundColor: '#dcfce7',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
  textAlign: 'center' as const,
};

const successText = {
  color: '#15803d',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const successSubtext = {
  color: '#16a34a',
  fontSize: '14px',
  margin: '0',
};

const infoBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #eab308',
  padding: '16px 24px',
  margin: '24px 40px',
};

const infoText = {
  color: '#854d0e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  textAlign: 'center' as const,
};
