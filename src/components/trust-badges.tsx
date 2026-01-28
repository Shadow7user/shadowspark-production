import { Shield, Lock, CheckCircle, CreditCard } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4 text-green-600" />
        <span>SSL Secure</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4 text-blue-600" />
        <span>NDPR Compliant</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CreditCard className="h-4 w-4 text-purple-600" />
        <span>Paystack Verified</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4 text-emerald-600" />
        <span>Trusted by 50+ Clients</span>
      </div>
    </div>
  );
}
