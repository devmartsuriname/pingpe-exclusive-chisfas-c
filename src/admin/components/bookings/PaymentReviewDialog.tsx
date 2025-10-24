import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ExternalLink, Loader2 } from "lucide-react";

interface PaymentReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    proof_url?: string;
    total_price: number;
    payment_provider?: string;
    guest_name?: string;
  };
  onSuccess: () => void;
}

export default function PaymentReviewDialog({ 
  open, 
  onOpenChange, 
  booking,
  onSuccess 
}: PaymentReviewDialogProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleReview = async (action: 'approve' | 'reject') => {
    setProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-review-payment', {
        body: {
          booking_id: booking.id,
          action,
          notes,
        },
      });

      if (error) throw error;

      toast({
        title: action === 'approve' ? "Payment Approved" : "Payment Rejected",
        description: `Booking ${booking.id.substring(0, 8)}... has been ${action}d`,
      });

      onSuccess();
      onOpenChange(false);
      setNotes("");
    } catch (error: any) {
      console.error('Review error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to review payment",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Payment</DialogTitle>
          <DialogDescription>
            Review and approve or reject this payment proof
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Booking ID</p>
              <p className="text-muted-foreground">{booking.id.substring(0, 13)}...</p>
            </div>
            <div>
              <p className="font-medium">Guest</p>
              <p className="text-muted-foreground">{booking.guest_name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Amount</p>
              <p className="text-muted-foreground">€{booking.total_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Provider</p>
              <p className="text-muted-foreground capitalize">{booking.payment_provider || 'N/A'}</p>
            </div>
          </div>

          {booking.proof_url && (
            <div>
              <Label>Payment Proof</Label>
              <div className="mt-2 border rounded-lg p-4">
                {booking.proof_url.endsWith('.pdf') ? (
                  <div className="flex items-center justify-center p-8 bg-muted rounded">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">PDF Document</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(booking.proof_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View PDF
                      </Button>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={booking.proof_url} 
                    alt="Payment proof" 
                    className="w-full h-auto max-h-96 object-contain rounded"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => window.open(booking.proof_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="review-notes">Admin Notes (Optional)</Label>
            <Textarea
              id="review-notes"
              placeholder="Add any notes about this payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>

          <Alert>
            <AlertDescription>
              Approving will confirm the booking and mark payment as complete. 
              Rejecting will cancel the booking.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleReview('reject')}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Payment
              </>
            )}
          </Button>
          <Button
            onClick={() => handleReview('approve')}
            disabled={processing}
            className="bg-success hover:bg-success/90"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
