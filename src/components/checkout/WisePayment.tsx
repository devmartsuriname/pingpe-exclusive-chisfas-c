import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Copy, Check, AlertCircle, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface WisePaymentProps {
  bookingId: string;
  amount: number;
  currency: string;
  instructions: string;
  onSuccess: () => void;
}

export default function WisePayment({ bookingId, amount, currency, instructions, onSuccess }: WisePaymentProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proofUrl, setProofUrl] = useState<string>("");
  const [notes, setNotes] = useState("");

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Payment instructions copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: "Invalid file",
        description: "Please upload an image or PDF file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}-${Date.now()}.${fileExt}`;
      const filePath = `${bookingId}/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment_proofs')
        .getPublicUrl(filePath);

      setProofUrl(publicUrl);

      toast({
        title: "Upload successful",
        description: "Payment proof uploaded successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofUrl) {
      toast({
        title: "No proof uploaded",
        description: "Please upload payment proof first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update booking with proof URL
      const { error } = await supabase
        .from('bookings')
        .update({
          proof_url: proofUrl,
          payment_status: 'pending',
          review_notes: notes,
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Submitted!",
        description: "Payment proof submitted for review",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Wise Bank Transfer</CardTitle>
          <CardDescription>
            Complete your payment via bank transfer to PingPe's Wise account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Amount to transfer: {currency} {amount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyInstructions}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono">{instructions}</pre>
          </div>

          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              After completing the transfer, upload proof of payment below. Your booking will be confirmed within 1-2 business days.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Payment Proof</CardTitle>
          <CardDescription>
            Upload a screenshot or PDF of your bank transfer confirmation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="proof-upload" className="block mb-2 text-sm font-medium">
              Payment Proof (Image or PDF, max 5MB)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="proof-upload"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('proof-upload')?.click()}
                disabled={uploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : proofUrl ? 'Change File' : 'Choose File'}
              </Button>
            </div>
            {proofUrl && (
              <p className="text-sm text-success mt-2">✓ File uploaded successfully</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block mb-2 text-sm font-medium">
              Additional Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about your payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmitProof}
            disabled={!proofUrl || uploading}
            className="w-full"
          >
            Submit Payment Proof
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
