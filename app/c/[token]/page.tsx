function viewInvoicePDF() {
  function toWords(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    if (num === 0) return 'Zero'
    if (num < 20) return ones[num]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + toWords(num % 100) : '')
    if (num < 100000) return toWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + toWords(num % 1000) : '')
    if (num < 10000000) return toWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + toWords(num % 100000) : '')
    return toWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + toWords(num % 10000000) : '')
  }

  const amount = activeProject ? Number(activeProject.amount) || 0 : 0
  const amountInWords = toWords(amount) + ' only'

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  const invoiceNum = String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')
  const invoiceDate = activeProject?.created_at ? formatDate(activeProject.created_at) : formatDate(new Date().toISOString())

  const invoiceHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${client?.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Montserrat', sans-serif;
      background: #e8f8f8;
      min-height: 100vh;
      padding: 30px 20px;
    }
    .print-bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .btn-print {
      background: #00b4b4;
      color: white;
      border: none;
      padding: 10px 28px;
      border-radius: 8px;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .invoice-wrap {
      max-width: 750px;
      margin: 0 auto;
      background: #00b4b4;
      border-radius: 12px;
      overflow: hidden;
    }

    /* HEADER */
    .header {
      background: #00b4b4;
      padding: 36px 44px 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .billed-to-label {
      font-size: 13px;
      font-weight: 700;
      color: #F5C518;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .client-name {
      font-size: 32px;
      font-weight: 800;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .client-sub {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      line-height: 1.7;
    }
    .header-right {
      text-align: right;
    }
    .invoice-title-top {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
      letter-spacing: 1px;
    }
    .invoice-for {
      font-size: 15px;
      font-weight: 700;
      color: rgba(255,255,255,0.9);
      margin-bottom: 12px;
    }
    .big-title {
      font-size: 38px;
      font-weight: 900;
      color: #F5C518;
      line-height: 1;
      letter-spacing: -1px;
    }
    .invoice-meta {
      margin-top: 16px;
      font-size: 13px;
      color: rgba(255,255,255,0.9);
      line-height: 1.8;
      font-weight: 500;
    }

    /* ITEMS TABLE */
    .table-wrap {
      background: #00b4b4;
      padding: 0 44px 0;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }
    .items-table thead tr {
      border-bottom: 2px solid #e5e5e5;
    }
    .items-table th {
      padding: 14px 20px;
      font-size: 13px;
      font-weight: 700;
      color: #333;
      text-align: left;
    }
    .items-table th:not(:first-child) { text-align: center; }
    .items-table th:last-child { text-align: right; }
    .items-table td {
      padding: 16px 20px;
      font-size: 13px;
      color: #444;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: top;
    }
    .items-table td:not(:first-child) { text-align: center; }
    .items-table td:last-child { text-align: right; font-weight: 600; }
    .empty-row td { color: #ccc; text-align: center !important; }

    /* TOTALS inside white box */
    .totals-inner {
      border-top: 2px solid #e5e5e5;
    }
    .totals-row {
      display: flex;
      justify-content: flex-end;
      padding: 7px 20px;
      font-size: 13px;
      color: #555;
    }
    .totals-row .label { width: 160px; text-align: right; padding-right: 24px; font-weight: 600; }
    .totals-row .val { width: 90px; text-align: right; }
    .totals-row.grand {
      border-top: 2px solid #333;
      padding: 12px 20px;
    }
    .totals-row.grand .label {
      font-size: 16px;
      font-weight: 800;
      color: #111;
    }
    .totals-row.grand .val {
      font-size: 16px;
      font-weight: 800;
      color: #111;
    }
    .words-row {
      padding: 10px 20px 16px;
      font-size: 12px;
      color: #555;
      border-top: 1px solid #f0f0f0;
    }
    .words-row strong { color: #222; }

    /* BOTTOM SECTION */
    .bottom {
      background: #00b4b4;
      padding: 28px 44px 36px;
    }
    .notes-title {
      font-size: 13px;
      font-weight: 700;
      color: #F5C518;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .notes-list {
      list-style: disc;
      padding-left: 18px;
      font-size: 12.5px;
      color: rgba(255,255,255,0.9);
      line-height: 2;
    }

    .payment-section {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .payment-left { flex: 1; }
    .payment-title {
      font-size: 13px;
      font-weight: 700;
      color: #F5C518;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .payment-line {
      font-size: 12.5px;
      color: rgba(255,255,255,0.9);
      line-height: 2;
    }

    .signature-area {
      text-align: center;
      min-width: 180px;
    }
    .sig-box {
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 16px 24px 12px;
      display: inline-block;
    }
    .sig-name {
      font-size: 18px;
      font-weight: 800;
      color: #F5C518;
      margin-bottom: 2px;
      font-style: italic;
    }
    .sig-sub {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
      letter-spacing: 1px;
    }
    .sig-thanks {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
      margin-top: 6px;
    }

    @media print {
      body { background: #00b4b4; padding: 0; }
      .print-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">⬇ Save as PDF / Print</button>
  </div>

  <div class="invoice-wrap">

    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="billed-to-label">BILLED TO:</div>
        <div class="client-name">${client?.name || 'Client'}</div>
        <div class="client-sub">
          ${client?.channel_name ? '(' + client.channel_name + ')<br>' : ''}
          ${client?.phone ? 'Contact No: ' + client.phone : ''}
          ${client?.email ? '<br>' + client.email : ''}
        </div>
      </div>
      <div class="header-right">
        <div class="invoice-for">INVOICE FOR</div>
        <div class="big-title">VIDEO EDITOR</div>
        <div class="invoice-meta">
          Invoice No. ${invoiceNum}<br>
          ${invoiceDate}
        </div>
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <div class="table-wrap">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width:50%">Item</th>
            <th style="width:15%">Quantity</th>
            <th style="width:17%">Unit Price</th>
            <th style="width:18%">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${activeProject?.title || 'Video Editing Services'}</td>
            <td>1</td>
            <td>₹${amount.toLocaleString('en-IN')}/-</td>
            <td>₹${amount.toLocaleString('en-IN')}/-</td>
          </tr>
          <tr class="empty-row">
            <td>–</td><td>–</td><td>–</td><td>–</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><td colspan="4" style="padding:0">
            <div class="totals-inner">
              <div class="totals-row">
                <span class="label">Subtotal</span>
                <span class="val">₹${amount.toLocaleString('en-IN')}/-</span>
              </div>
              <div class="totals-row">
                <span class="label">Discount (0%)</span>
                <span class="val">-₹0/-</span>
              </div>
              <div class="totals-row">
                <span class="label">Tax (0%)</span>
                <span class="val">₹0/-</span>
              </div>
              <div class="totals-row grand">
                <span class="label">Total</span>
                <span class="val">₹${amount.toLocaleString('en-IN')}/-</span>
              </div>
              <div class="words-row">
                <strong>Total Amount (₹ - In Words):</strong> ${amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1)}
              </div>
            </div>
          </td></tr>
        </tfoot>
      </table>
    </div>

    <!-- BOTTOM -->
    <div class="bottom">
      <div class="notes-title">Note:</div>
      <ul class="notes-list">
        <li>This invoice is valid for 15 days from the date of issue.</li>
        <li>Please process the payment by the due date to avoid any late fees.</li>
        <li>All payments are non-refundable once the work is delivered.</li>
        <li>For any disputes or clarifications, please contact me within 7 days.</li>
      </ul>

      <div class="payment-section">
        <div class="payment-left">
          <div class="payment-title">PAYMENT INFORMATION</div>
          <div class="payment-line">
            Bank Name : State Bank of India, Surat<br>
            A/C Name: Ayush Bhaveshbhai Siddhapura<br>
            A/C NO: 42626612933<br>
            IFSC Code: SBIN0016040<br>
            UPI ID: Ayushsiddhapura248@oksbi
          </div>
        </div>
        <div class="signature-area">
          <div class="sig-box">
            <div class="sig-name">Ayush Siddhapura</div>
            <div class="sig-sub">AUTHORISED SIGNATORY</div>
          </div>
          <div class="sig-thanks">Thank you! 🙏</div>
        </div>
      </div>
    </div>

  </div>
</body>
</html>`

  const blob = new Blob([invoiceHTML], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}