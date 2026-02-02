import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 11 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: { fontSize: 24, fontWeight: "bold", color: "#00FFD5" },
  invoiceTitle: { fontSize: 28, fontWeight: "bold", color: "#333" },
  section: { marginBottom: 20 },
  label: { fontSize: 10, color: "#666", marginBottom: 4 },
  value: { fontSize: 12, color: "#000", fontWeight: "bold" },
  table: { marginTop: 20 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  tableHeader: { backgroundColor: "#f5f5f5", fontWeight: "bold" },
  col1: { width: "60%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "20%", textAlign: "right" },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  paymentLink: { fontSize: 12, color: "#BD00FF", marginTop: 10 },
});

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  prospect: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  paymentUrl: string;
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>ShadowSpark Technologies</Text>
            <Text style={styles.label}>AI-Powered Digital Agency</Text>
            <Text style={styles.label}>Lagos, Nigeria</Text>
            <Text style={styles.label}>
              architect@shadowspark-technologies.com
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.value}>{data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.label}>BILL TO</Text>
          <Text style={styles.value}>{data.prospect.name}</Text>
          <Text style={styles.value}>{data.prospect.company}</Text>
          <Text>{data.prospect.email}</Text>
          <Text>{data.prospect.phone}</Text>
        </View>

        {/* Invoice Details */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={styles.label}>INVOICE DATE</Text>
            <Text style={styles.value}>{data.date}</Text>
          </View>
          <View>
            <Text style={styles.label}>DUE DATE</Text>
            <Text style={styles.value}>{data.dueDate}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.col1}>DESCRIPTION</Text>
            <Text style={styles.col2}>QTY</Text>
            <Text style={styles.col3}>AMOUNT</Text>
          </View>

          {data.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>
                ₦{item.unitPrice.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={{ alignItems: "flex-end", marginTop: 20 }}>
          <Text style={styles.total}>
            TOTAL: ₦{data.total.toLocaleString()}
          </Text>
        </View>

        {/* Payment Instructions */}
        <View style={styles.footer}>
          <Text style={styles.label}>PAYMENT INSTRUCTIONS</Text>
          <Text>Pay online via Paystack (cards, bank transfer, USSD):</Text>
          <Text style={styles.paymentLink}>{data.paymentUrl}</Text>
          <Text style={{ marginTop: 10, fontSize: 10, color: "#666" }}>
            Payment is due within 7 days. Late payments may incur additional
            charges.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
