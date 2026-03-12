export const dynamic = "force-dynamic"


import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WebhooksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Events</CardTitle>
        <CardDescription>
          A log of all incoming webhook events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Event ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Badge>PAYSTACK</Badge>
              </TableCell>
              <TableCell>charge.success</TableCell>
              <TableCell>evt_1234567890</TableCell>
              <TableCell>
                <Badge variant="outline">Processed</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
