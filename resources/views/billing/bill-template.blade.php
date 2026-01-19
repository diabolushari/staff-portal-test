<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>KSEB HT Consumer Bill</title>

  <style>
    @page {
      size: A4;
      margin: 6mm;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      margin: 0;
      padding: 0;
      color: #000;
    }

    .page {
      width: 100%;
      border: 3px solid #000;
      padding: 4px;
      box-sizing: border-box;
    }

    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }

    .header h1 {
      font-size: 20px;
      margin: 0;
      font-weight: bold;
      text-transform: uppercase;
    }

    .sub {
      font-size: 10px;
    }

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-top: 4px;
    }

    table {
      page-break-inside: avoid;
    }

    .small-table,
    .grid {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: avoid;
    }

    .small-table td,
    .small-table th,
    .grid td,
    .grid th {
      border: 1px solid #000;
      padding: 3px;
      font-size: 10px;
      vertical-align: top;
    }

    .grid th {
      background: #f5f5f5;
      font-weight: bold;
    }

    .section {
      border: 1px solid #000;
      padding: 4px;
      margin-top: 4px;
      page-break-inside: avoid;
    }

    .invoice {
      border: 1px solid #000;
      padding: 4px;
      margin-top: 4px;
      page-break-inside: avoid;
    }

    .total-row {
      background: #eee;
      font-weight: bold;
    }

    .footer {
      margin-top: 4px;
      font-size: 9.5px;
      page-break-inside: avoid;
    }

    .signature-row {
      margin-top: 12px;
      page-break-inside: avoid;
    }

    .signature {
      width: 250px;
      text-align: center;
      border-top: 1px solid #000;
      margin-left: auto;
      font-weight: bold;
    }

    .right {
      text-align: right;
    }

    .center {
      text-align: center;
    }

    .mono {
      font-family: "Courier New";
    }
  </style>
</head>

<body>
  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <h1>KERALA STATE ELECTRICITY BOARD LIMITED</h1>
      <div class="sub">Office of the Special Officer (Revenue), Pattom, Thiruvananthapuram</div>
      <div class="title">DEMAND CUM DISCONNECTION NOTICE FOR {{ \Carbon\Carbon::parse($bill['bill_year_month'])->format('F Y') }}
      </div>
      <div class="sub" style="font-style: italic;">As per CHAPTER VII OF KERALA ELECTRICITY SUPPLY CODE - 2014</div>
    </div>

    <!-- Bill Summary -->

    @include('billing.bill-summary', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer
    ])


    <!-- ARREARS SECTION -->

    @include('billing.bill-arrears', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer,
    'meter' => $meter,
    ])

    @include('billing.bill-reading', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer,
    'meter' => $meter,
    'kwhValues' => $kwhValues,
    'kvahValues' => $kvahValues,
    'lagValues' => $lagValues,
    'leadValues' => $leadValues,
    'kvaValues' => $kvaValues,
    ])




    <!-- READING DETAILS -->
    <div class="section">
      <h3 style="margin:0 0 4px 0;">Reading Details of meter {{ $meter['meter']['meter_serial']}} - Working (KVA, KWh, KVAh & KVARh) for {{ $bill['reading_year_month'] ?? '' }}
      </h3>


      <table class="grid" style="page-break-inside: avoid;">
        <tr>
          <th colspan="6">1. Energy Consumption (kWh)</th>
          <th colspan="8">3. Energy Consumption (KVARh) Lag and kVARh (Lead)</th>
        </tr>
        <tr>
          <th>Zone</th>
          <th>FR</th>
          <th>IR</th>
          <th>MF</th>
          <th>Units</th>
          <th></th>
          <th>Zone</th>
          <th>FR</th>
          <th>IR</th>
          <th>MF</th>
          <th>Units</th>
          <th>FR</th>
          <th>IR</th>
          <th>Units</th>
        </tr>



        @foreach($kwhValues as $index => $kWhRow)
        <tr>
          {{-- kWh Energy Consumption --}}
          <td>{{ $index + 1 }}</td>
          <td>{{ $kWhRow['final_reading'] ?? '-' }}</td>
          <td>{{ $kWhRow['initial_reading'] ?? '-' }}</td>
          <td>{{ $meter['meter_mf'] ?? '-' }}</td>
          <td class="right">{{ $kWhRow['difference'] * ($meter['meter_mf'] ?? 1) }}</td>
          <td></td>

          {{-- kVArh Lag and Lead --}}
          @php
          $lagRow = $lagValues[$index] ?? null;
          $leadRow = $leadValues[$index] ?? null;
          @endphp
          <td>{{ $index + 1 }}</td>
          <td>{{ $lagRow['initial_reading'] ?? '-' }}</td>
          <td>{{ $lagRow['final_reading'] ?? '-' }}</td>
          <td>{{ $meter['meter_mf'] ?? '-' }}</td>
          <td class="right">{{ ($lagRow['difference'] ?? 0) * ($meter['meter_mf'] ?? 1) }}</td>
          <td>{{ $leadRow['initial_reading'] ?? '-' }}</td>
          <td>{{ $leadRow['final_reading'] ?? '-' }}</td>
          <td class="right">{{ ($leadRow['difference'] ?? 0) * ($meter['meter_mf'] ?? 1) }}</td>
        </tr>
        @endforeach

        <tr class="total-row">
          <td colspan="4">Total</td>
          <td class="right">{{ collect($kwhValues)->sum('difference') * ($meter['meter_mf'] ?? 1) }}</td>
          <td></td>
          <td colspan="4">Total kVARh (Lag)</td>
          <td class="right">{{ collect($lagValues)->sum('difference') * ($meter['meter_mf'] ?? 1) }}</td>
          <td colspan="2">Total kVARh (Lead)</td>
          <td>{{ collect($leadValues)->sum('difference') * ($meter['meter_mf'] ?? 1) }}</td>
        </tr>
      </table>


      <table class="grid" style="margin-top:4px; page-break-inside: avoid;">
        <tr>
          <th colspan="6">2. Energy Consumption (KVAh)</th>
          <th colspan="4">4. Demand (KVA) Readings</th>
        </tr>

        <tr>
          <th>Zone</th>
          <th>FR</th>
          <th>IR</th>
          <th>MF</th>
          <th>Units</th>
          <th></th>
          <th>Reading</th>
          <th>MF</th>
          <th>Units</th>
          <th></th>
        </tr>

        @foreach($kvahValues as $index => $kVAhRow)
        <tr>
          {{-- Energy Consumption KVAh --}}
          <td>{{ $index + 1 }}</td> {{-- Zone number --}}
          <td>{{ $kVAhRow['initial_reading'] ?? '-' }}</td>
          <td>{{ $kVAhRow['final_reading'] ?? '-' }}</td>
          <td>{{ $meter['meter_mf'] ?? 1 }}</td> {{-- MF, adjust if needed --}}
          <td class="right">{{ $kVAhRow['difference'] * ($meter['meter_mf'] ?? 1) }}</td>
          <td></td>

          {{-- Demand KVA Readings --}}
          @php
          $kVAReading = $kvaValues[$index] ?? null;
          @endphp
          <td class="center">{{ $kVAReading['difference'] ?? '-' }}</td>
          <td>{{ $meter['meter_mf'] ?? 1 }}</td>
          <td class="right">
            {{ ($kVAReading['difference'] ?? 0) * ($meter['meter_mf'] ?? 1) }}
          </td>
          <td></td>
        </tr>
        @endforeach

        <tr class="total-row">
          <td colspan="4">Total</td>
          <td class="right">{{ collect($kvahValues)->sum('difference') * ($meter['meter_mf'] ?? 1) }}</td>
          <td></td>
          <td colspan="3">Total</td>
          <td class="right">{{ collect($kvaValues)->sum(fn($r) => $r['difference'] * ($meter['meter_mf'] ?? 1)) }}</td>
        </tr>
      </table>



    </div>

    <!-- INVOICE SECTION -->

    @include('billing.bill-invoice', [
    'bill' => $bill,
    'connection' => $connection,
    'consumer' => $consumer,
    'meter' => $meter,
    'kwhValues' => $kwhValues,
    'kvahValues' => $kvahValues,
    'lagValues' => $lagValues,
    'leadValues' => $leadValues,
    'kvaValues' => $kvaValues,
    ])



    <div class="footer">
      <i>(Rupees {{ $bill['bill_amount'] ?? '-' }} Only)</i>
      <div class="signature">SPECIAL OFFICER (REVENUE)</div>
    </div>
  </div>

  <!-- FOOTER BLOCK OUTSIDE BORDER -->
  <div class="footer" style="page-break-inside: avoid;">
    <p><i>1. As per Regulation 130 of Kerala Electricity Supply Code 2014
        any complaint regarding accuracy of a bill shall be first
        taken up with the officer designated to issue the bill (Special Officer(Revenue)). For Enquiry, please
        contact: 0471 2514323, 2514262. Please follow our official Facebook page fb.com/ksebl for information &
        announcements.</i></p>
    <p><i>2. The connection will be disconnected without further notice,
        if the amount is not remitted on or before the DC date above.</i></p>

    <table width="100%" style="page-break-inside: avoid;">
      <tr>
        <td><strong>Cons#:</strong> <span class="mono">{{ $connection['consumer_number'] ?? '-' }}</span></td>
        <td><strong>Bill No:</strong> <span class="mono">{{$bill['bill_id'] ?? '-'}}</span></td>
        <td><strong>Rs:</strong> <span class="mono">{{$bill['bill_amount'] ?? '-'}}</span></td>
      </tr>
    </table>
  </div>

</body>

</html>