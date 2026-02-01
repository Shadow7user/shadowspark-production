"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitEnterpriseLead, LeadState } from "@/lib/actions/marketing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Users, Send } from "lucide-react";

const initialState: LeadState = {
  message: "",
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-cyber-cyan text-black hover:bg-cyber-cyan/90 font-bold"
      disabled={pending}
    >
      {pending ? "Sending..." : "Request Consultation"}{" "}
      <Send className="w-4 h-4 ml-2" />
    </Button>
  );
}

export function EnterpriseLeadForm() {
  const [state, formAction] = useFormState(submitEnterpriseLead, initialState);

  if (state?.success) {
    return (
      <Card className="border-cyber-cyan bg-cyber-cyan/5 backdrop-blur">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Request Received!
          </h3>
          <p className="text-muted-foreground">{state.message}</p>
          <p className="text-sm text-muted-foreground">
            We'll email you shortly to schedule a scoping call.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Get a Custom Quote</CardTitle>
        <CardDescription>
          Tell us about your team's training needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@company.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <div className="relative">
                <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  name="company"
                  className="pl-9"
                  placeholder="Acme Inc"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  id="teamSize"
                  name="teamSize"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="50+">50+ Employees</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Training Needs (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="e.g., We need Python training for our data team..."
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500 font-medium">{state.error}</p>
          )}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
