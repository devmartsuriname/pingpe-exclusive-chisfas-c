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

interface BookingConfirmationEmailProps {
  userName?: string;
  bookingId?: string;
  propertyTitle?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  totalAmount?: number;
  currency?: string;
}

export const BookingConfirmationEmail = ({
  userName = 'Guest',
  bookingId = 'XXXX-XXXX',
  propertyTitle = 'Jungle Resort PingPe',
  checkInDate = 'TBD',
  checkOutDate = 'TBD',
  guests = 2,
  totalAmount = 0,
  currency = 'USD',
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your booking at Jungle Resort PingPe has been confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🌴 Booking Confirmed!</Heading>
        
        <Text style={text}>
          Dear {userName},
        </Text>
        
        <Text style={text}>
          We're thrilled to confirm your reservation at <strong>{propertyTitle}</strong>! 
          Your booking reference is <strong>#{bookingId}</strong>.
        </Text>

        <Section style={bookingDetails}>
          <Heading style={h2}>Booking Details</Heading>
          
          <Text style={detailRow}>
            <strong>Property:</strong> {propertyTitle}
          </Text>
          <Text style={detailRow}>
            <strong>Check-in:</strong> {checkInDate}
          </Text>
          <Text style={detailRow}>
            <strong>Check-out:</strong> {checkOutDate}
          </Text>
          <Text style={detailRow}>
            <strong>Guests:</strong> {guests}
          </Text>
          <Text style={detailRow}>
            <strong>Total Amount:</strong> {currency} ${totalAmount.toFixed(2)}
          </Text>
        </Section>

        <Text style={text}>
          We're preparing everything to ensure your stay is comfortable and memorable. 
          Our team will be in touch with you closer to your arrival date with check-in instructions 
          and additional information about your stay.
        </Text>

        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>📍 Location:</strong> Vidijaweg 25, Wanica, Suriname
          </Text>
          <Text style={infoText}>
            <strong>📞 Contact:</strong> +597 8858525
          </Text>
          <Text style={infoText}>
            <strong>📧 Email:</strong> info@jungleresortpingpe.com
          </Text>
        </Section>

        <Text style={text}>
          If you have any questions or need to make changes to your booking, 
          please don't hesitate to contact us.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          This message was sent by{' '}
          <Link href="https://jungleresortpingpe.com" style={link}>
            Jungle Resort PingPe
          </Link>
          <br />
          Upper Suriname's Premier Eco-Retreat
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BookingConfirmationEmail;

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
  color: '#22c55e',
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

const bookingDetails = {
  backgroundColor: '#f8faf8',
  border: '2px solid #22c55e',
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
