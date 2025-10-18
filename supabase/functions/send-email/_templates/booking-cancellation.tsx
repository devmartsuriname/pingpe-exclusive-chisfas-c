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

interface BookingCancellationEmailProps {
  userName?: string;
  bookingId?: string;
  propertyTitle?: string;
  checkInDate?: string;
  checkOutDate?: string;
  cancellationDate?: string;
  refundAmount?: number;
  currency?: string;
  reason?: string;
}

export const BookingCancellationEmail = ({
  userName = 'Guest',
  bookingId = 'XXXX-XXXX',
  propertyTitle = 'Jungle Resort PingPe',
  checkInDate = 'TBD',
  checkOutDate = 'TBD',
  cancellationDate = new Date().toLocaleDateString(),
  refundAmount = 0,
  currency = 'USD',
  reason = 'Customer requested cancellation',
}: BookingCancellationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your booking at Jungle Resort PingPe has been cancelled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Booking Cancelled</Heading>
        
        <Text style={text}>
          Dear {userName},
        </Text>
        
        <Text style={text}>
          This email confirms that your booking <strong>#{bookingId}</strong> at{' '}
          <strong>{propertyTitle}</strong> has been cancelled.
        </Text>

        <Section style={cancellationBox}>
          <Heading style={h2}>Cancellation Details</Heading>
          
          <Text style={detailRow}>
            <strong>Booking Reference:</strong> #{bookingId}
          </Text>
          <Text style={detailRow}>
            <strong>Property:</strong> {propertyTitle}
          </Text>
          <Text style={detailRow}>
            <strong>Original Check-in:</strong> {checkInDate}
          </Text>
          <Text style={detailRow}>
            <strong>Original Check-out:</strong> {checkOutDate}
          </Text>
          <Text style={detailRow}>
            <strong>Cancellation Date:</strong> {cancellationDate}
          </Text>
          <Text style={detailRow}>
            <strong>Reason:</strong> {reason}
          </Text>
        </Section>

        {refundAmount > 0 && (
          <Section style={refundBox}>
            <Text style={refundText}>
              💰 Refund Amount: {currency} ${refundAmount.toFixed(2)}
            </Text>
            <Text style={refundSubtext}>
              Your refund will be processed within 5-7 business days and will appear 
              on your original payment method.
            </Text>
          </Section>
        )}

        {refundAmount === 0 && (
          <Section style={warningBox}>
            <Text style={warningText}>
              ⚠️ No Refund Applicable
            </Text>
            <Text style={warningSubtext}>
              According to our cancellation policy, this booking is not eligible for a refund.
            </Text>
          </Section>
        )}

        <Text style={text}>
          We're sorry to see your plans change. We hope you'll consider staying with us 
          in the future! Our doors are always open, and we'd love to welcome you to 
          Jungle Resort PingPe whenever your schedule allows.
        </Text>

        <Section style={ctaBox}>
          <Text style={ctaText}>
            Ready to book again?
          </Text>
          <Link href="https://jungleresortpingpe.com" style={ctaButton}>
            Explore Our Properties
          </Link>
        </Section>

        <Text style={text}>
          If you have any questions about this cancellation or your refund, 
          please don't hesitate to contact us.
        </Text>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>📞 Contact:</strong> +597 8858525
          </Text>
          <Text style={infoText}>
            <strong>📧 Email:</strong> info@jungleresortpingpe.com
          </Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This message was sent by{' '}
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

export default BookingCancellationEmail;

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
  color: '#ef4444',
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

const cancellationBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #ef4444',
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

const refundBox = {
  backgroundColor: '#dcfce7',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
  textAlign: 'center' as const,
};

const refundText = {
  color: '#15803d',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const refundSubtext = {
  color: '#166534',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 40px',
  textAlign: 'center' as const,
};

const warningText = {
  color: '#92400e',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const warningSubtext = {
  color: '#854d0e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const ctaBox = {
  textAlign: 'center' as const,
  padding: '24px 40px',
};

const ctaText = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px',
};

const ctaButton = {
  backgroundColor: '#22c55e',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
};

const infoBox = {
  backgroundColor: '#f0f9ff',
  borderLeft: '4px solid #3b82f6',
  padding: '16px 24px',
  margin: '24px 40px',
};

const infoText = {
  color: '#1e40af',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const link = {
  color: '#22c55e',
  textDecoration: 'underline',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  textAlign: 'center' as const,
};
