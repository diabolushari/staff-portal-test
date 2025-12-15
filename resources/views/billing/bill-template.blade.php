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
      <div class="title">DEMAND CUM DISCONNECTION NOTICE FOR OCTOBER 2025</div>
      <div class="sub" style="font-style: italic;">As per CHAPTER VII OF KERALA ELECTRICITY SUPPLY CODE - 2014</div>
    </div>

    <!-- TOP 65/35 LAYOUT -->
    <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:3px; page-break-inside: avoid;">
      <tr>
        <td width="65%" style="vertical-align: top; padding-right:4px;">
          <table class="small-table">
            <tr>
              <td><strong>Cons#</strong></td>
              <td class="mono">{{ $connection['consumer_number'] ?? '' }}</td>
              <td><strong>Bill Date</strong></td>
              <td>{{ $bill['bill_date'] ?? '' }}</td>
            </tr>
            <tr>
              <td><strong>Due Date</strong></td>
              <td>{{ $bill['due_date'] ?? '' }}</td>
              <td><strong>DC Date</strong></td>
              <td>{{ $bill['dc_date'] ?? '' }}</td>
            </tr>
            <tr>
              <td><strong>LCN</strong></td>
              <td>{{ $connection['consumer_legacy_code'] ?? '' }}</td>
              <td><strong>Tariff</strong></td>
              <td>{{ $connection['tariff']['parameter_value'] ?? '' }}</td>
            </tr>
            <tr>
              <td rowspan="4" style="width:55%">
                <strong>{{ $consumer['organization_name'] }}</strong><br>
                KTDC Corporate Office, KTDC, Mascot square,<br>
                THIRUVANANTHAPURAM<br>
                Mobile: 9447556981
              </td>
              <td><strong>Bill.No</strong></td>
              <td class="mono" style="border-right:1px solid #000;">21028112257573</td>
              <td style="border-right: 0px; border-bottom: 0px;"></td>
            </tr>
            <tr>
              <td><strong>CD</strong></td>
              <td>256800</td>
              <td style="border-right: 0px; border-bottom: 0px; border-top: 0px"></td>
            </tr>
            <tr>
              <td><strong>Ver</strong></td>
              <td>0</td>
              <td style="border-right: 0px; border-bottom: 0px;border-top: 0px"></td>
            </tr>
            <tr>
              <td><strong>BG</strong></td>
              <td>0</td>
              <td style="border-right: 0px; border-bottom: 0px;border-top: 0px"></td>
            </tr>
          </table>
        </td>



        <td width="35%" style="vertical-align: top;">
          <table class="small-table">
            <tr>
              <th colspan="2" class="center">Bank / GST</th>
            </tr>
            <tr>
              <td><strong>SBI Virtual A/c No</strong></td>
              <td>SBIN0070493</td>
            </tr>
            <tr>
              <td><strong>GSTIN</strong></td>
              <td>{{ $consumer['consumer_gstin'] ?? '' }}</td>
            </tr>
            <tr>
              <td colspan="2"><i>Email: aeeelectrickltdc@gmail.com</i></td>
            </tr>
            <tr>
              <td><strong>Supply Voltage</strong></td>
              <td>{{ $connection['voltage']['parameter_value'] ?? '' }}</td>
            </tr>
            <tr>
              <td><strong>Billing Type</strong></td>
              <td>{{ $connection['billing_process']['parameter_value'] ?? '' }}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- ARREARS SECTION -->
    <div class="section">
      <table class="grid">
        <tr>
          <th>Arrears as on 31-Aug-2025</th>
          <th>Date of Previous Reading</th>
          <th>Date of Present Reading</th>
          <th>Average MD (kVA)</th>
          <th>Consumption (kWh)</th>
          <th>PF</th>
        </tr>
        <tr>
          <td>Disputed: 0 | Undisputed: 115</td>
          <td>31-Aug-2025</td>
          <td>{{ $bill['reading_year_month'] ?? '' }}</td>
          <td class="center">{{ $averageAndTotalKva['averageKva'] ?? '' }}</td>
          <td class="center">{{ $averageAndTotalKwh['totalKwh'] ?? '' }}</td>
          <td class="center">{{ $computedProperties['Power Factor']['result'] ?? '' }}</td>
        </tr>
        <tr>
          <td colspan="2">Contract Demand (kVA): {{ $connection['contract_demand_kva_val'] ?? '' }} | 75% of CD: {{ $connection['contract_demand_kva_val'] * 0.75}} | 130% of CD: {{ $connection['contract_demand_kva_val'] * 1.30}}</td>
          <td colspan="4">Connected Load (kW): {{ $connection['connected_load_kw_val'] ?? '' }} | Section: Cantonment | Circle: Electrical Circle (Urban)</td>
        </tr>
      </table>
    </div>

    <!-- READING DETAILS -->
    <div class="section">
      <h3 style="margin:0 0 4px 0;">Reading Details of meter {{ $meter['meter_serial']}} - Working (KVA, KWh, KVAh & KVARh) for {{ $bill['reading_year_month'] ?? '' }}
      </h3>

      <!-- kWh + kVARh -->
      {{-- <table class="grid" style="page-break-inside: avoid;">
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

        <tr>
          <td>1</td>
          <td>375418</td>
          <td>371322</td>
          <td>2</td>
          <td class="right">8178</td>
          <td></td>
          <td>1</td>
          <td>51638</td>
          <td>50761</td>
          <td>2</td>
          <td class="right">1754</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td>2</td>
          <td>44069</td>
          <td>43517</td>
          <td>2</td>
          <td class="right">1104</td>
          <td></td>
          <td>2</td>
          <td>11587</td>
          <td>11434</td>
          <td>2</td>
          <td class="right">306</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td>3</td>
          <td>69772</td>
          <td>68843</td>
          <td>2</td>
          <td class="right">1858</td>
          <td></td>
          <td>3</td>
          <td>22371</td>
          <td>22078</td>
          <td>2</td>
          <td class="right">586</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>

        <tr class="total-row">
          <td colspan="4">Total</td>
          <td class="right">11140</td>
          <td></td>
          <td colspan="4">Total kVARh (Lag)</td>
          <td class="right">2646</td>
          <td colspan="2">Total kVARh (Lead)</td>
          <td>154</td>
        </tr>
      </table> --}}
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

        

        @foreach($filteredkWhs as $index => $kWhRow)
          <tr>
            {{-- kWh Energy Consumption --}}
            <td>{{ $index + 1 }}</td>
            <td>{{ $kWhRow['final_reading'] }}</td>
            <td>{{ $kWhRow['initial_reading'] }}</td>
            <td>{{ $meter['meter_mf'] }}</td>
            <td class="right">{{ $kWhRow['difference'] * ($meter['meter_mf'] ?? 1) }}</td>
            <td></td>

            {{-- kVArh Lag and Lead --}}
            @php
              $lagRow = $filteredLags[$index] ?? null;
              $leadRow = $filteredLeads[$index] ?? null;
            @endphp
            <td>{{ $index + 1 }}</td>
            <td>{{ $lagRow['initial_reading'] ?? '-' }}</td>
            <td>{{ $lagRow['final_reading'] ?? '-' }}</td>
            <td>{{ $meter['meter_mf'] ?? 1 }}</td>
            <td class="right">{{ ($lagRow['difference'] ?? 0) * ($meter['meter_mf'] ?? 1) }}</td>
            <td>{{ $leadRow['initial_reading'] ?? '' }}</td>
            <td>{{ $leadRow['final_reading'] ?? '' }}</td>
            <td class="right">{{ ($leadRow['difference'] ?? 0) * ($meter['meter_mf'] ?? 1) }}</td>
          </tr>
        @endforeach

        <tr class="total-row">
          <td colspan="4">Total</td>
          <td class="right">{{ collect($filteredkWhs)->sum('difference') }}</td>
          <td></td>
          <td colspan="4">Total kVARh (Lag)</td>
          <td class="right">{{ collect($filteredLags)->sum('difference') }}</td>
          <td colspan="2">Total kVARh (Lead)</td>
          <td>{{ collect($filteredLeads)->sum('difference') }}</td>
        </tr>
      </table>

      {{-- <table class="grid" style="margin-top:4px; page-break-inside: avoid;">
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

        <tr>
          <td>1</td>
          <td>387792</td>
          <td>383563</td>
          <td>2</td>
          <td class="right">8458</td>
          <td></td>

          <td class="center">31.4</td>
          <td>2</td>
          <td class="right">62.8</td>
          <td></td>
        </tr>

        <tr>
          <td>2</td>
          <td>47836</td>
          <td>47258</td>
          <td>2</td>
          <td class="right">1156</td>
          <td></td>
          <td class="center">9.4</td>
          <td>2</td>
          <td class="right">18.8</td>
          <td></td>
        </tr>

        <tr>
          <td>3</td>
          <td>78155</td>
          <td>77175</td>
          <td>2</td>
          <td class="right">1960</td>
          <td></td>
          <td class="center">8.0</td>
          <td>2</td>
          <td class="right">16.0</td>
          <td></td>
        </tr>

        <tr class="total-row">
          <td colspan="4">Total</td>
          <td class="right">11574</td>
          <td></td>
          <td colspan="3">Total</td>
          <td class="right">117.6</td>
        </tr>
      </table> --}}
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

        @foreach($filteredKVAhs as $index => $kVAhRow)
          <tr>
            {{-- Energy Consumption KVAh --}}
            <td>{{ $index + 1 }}</td> {{-- Zone number --}}
            <td>{{ $kVAhRow['initial_reading'] }}</td>
            <td>{{ $kVAhRow['final_reading'] }}</td>
            <td>{{ $meter['meter_mf'] ?? 1 }}</td> {{-- MF, adjust if needed --}}
            <td class="right">{{ $kVAhRow['difference'] * ($meter['meter_mf'] ?? 1) }}</td>
            <td></td>

            {{-- Demand KVA Readings --}}
            @php
              $kVAReading = $filteredkVAs[$index] ?? null;
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
          <td class="right">{{ collect($filteredKVAhs)->sum('difference') }}</td>
          <td></td>
          <td colspan="3">Total</td>
          <td class="right">{{ collect($filteredkVAs)->sum(fn($r) => $r['difference'] * ($meter['meter_mf'] ?? 1)) }}</td>
        </tr>
      </table>



    </div>

    <!-- INVOICE SECTION -->
   <table width="100%" cellspacing="0" cellpadding="0" class="invoice">
    <tr>
        <td width="65%" style="padding-right:4px; vertical-align: top;">
            <table class="grid">

                <tr>
                    <th>1. Total Demand Charge</th>
                    <th>Unit</th>
                    <th>Rate</th>
                    <th>Amount (Rs)</th>
                </tr>

                @php
                    $kvaRate = $computedProperties['KVA RATE']['value'] ?? 0;
                    $subTotalDemand = 0;
                @endphp


                {{-- CASE 1: CONTRACT DEMAND --}}
                @if($demand['is_contract_demand'] === true)

                    <tr>
                        <td>a. Contract Demand</td>
                        <td class="center">{{ $demand['result']['value'] }}</td>
                        <td class="right">{{ $computedProperties['KVA RATE']['result'] }}</td>
                        <td class="right">{{ $computedProperties['Demand Charge']['result'] ?? 0 }}</td>
                    </tr>
                     <tr>
                        <td>b. Excess Demand Charge</td>
                        <td class="center">{{ 0 }}</td>
                        <td class="right">{{ $computedProperties['KVA RATE']['result'] ?? '-'}}</td>
                        <td class="right">{{ $computedProperties['EXCESS DEMAND CHARGE']['result'] ?? 0 }}</td>
                    </tr>


                {{-- CASE 2: TIME-ZONE BASED --}}
                @else

                    @foreach($demand['result'] as $i => $zone)
                        @php
                            $label = chr(97 + $i); // a, b, c...
                            $unit = $zone['value'];
                            $amount = $unit * $computedProperties['KVA RATE']['result'] ?? 0;
                            $subTotalDemand += $amount;
                        @endphp

                        <tr>
                            <td>{{ $label }}. Demand Charge - {{ $zone['timezone'] }}</td>
                            <td class="center">{{ $unit }}</td>
                            <td class="right">{{ $computedProperties['KVA RATE']['result'] ?? '-' }}</td>
                            <td class="right">{{ number_format($amount, 2) }}</td>
                        </tr>
                        
                    @endforeach
                    <tr>
                            <td>d. Excess Demand Charge</td>
                            <td class="center">{{ 0 }}</td>
                            <td class="right">{{ $kvaRate }}</td>
                            <td class="right">{{ $computedProperties['EXCESS DEMAND CHARGE']['result'] ?? '-' }}</td>
                        </tr>

                @endif


                {{-- SUBTOTAL ROW --}}
                <tr class="total-row">
                    <td>Sub Total</td>
                    <td></td>
                    <td></td>
                <td class="right">{{ $chargeHeads['TOTAL DEMAND CHARGE']['result'] ?? '-' }}</td>
                </tr>

                <tr><td colspan="4"></td></tr>


                {{-- YOUR ENERGY TABLE CONTINUES HERE --}}
                @php
                    $rows = $energyChargeRows['energyChargeRows'] ?? [];
                @endphp


<tr>
    <th colspan="4">2. Total Energy Charges</th>
</tr>

@foreach($rows as $i => $row)
<tr>
    <td>{{ chr(97 + $i) }}. {{ $row['label'] }} ({{ $row['units'] }} × {{ $row['rate'] }})</td>
    <td></td>
    <td></td>
    <td class="right">{{ $computedProperties['ENERGY CHARGE']['result'][$i]['result'] ?? 0 }}</td>
</tr>
@endforeach

<tr class="total-row">
    <td>Sub Total (a + b + c)</td>
    <td></td>
    <td></td>
    <td class="right">{{ $chargeHeads['ENERGY CHARGE']['result'] ?? 0 }}</td>
</tr>



            <tr>
              <td>3. PF Incentive / Disincentive</td>
              <td></td>
              <td></td>
              <td class="right">{{$chargeHeads['Power Factor Incentive and Disincentive']['result'] ?? 0}}</td>
            </tr>
            @php
            $totalEnergyCharge = $chargeHeads['ENERGY CHARGE']['result'] ?? 0 + $chargeHeads['Power Factor Incentive and Disincentive']['result'] ?? 0 + $chargeHeads['TOTAL DEMAND CHARGE']['result'] ?? 0;
            @endphp
            <tr class="total-row">
              <td>Total Energy Charge</td>
              <td></td>
              <td></td>
              <td class="right">{{ $totalEnergyCharge }}</td>
            </tr>

            <tr>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td>4. Energy Charges on Lighting load</td>
              <td></td>
              <td></td>
              <td class="right">-0.00</td>
            </tr>
            <tr class="total-row">
              <td>Total (add 1 to 9)</td>
              <td></td>
              <td></td>
              <td class="right">{{$totalEnergyCharge}}</td>
            </tr>

          </table>
        </td>

        <!-- RIGHT SIDE -->
        <td width="35%" style="vertical-align: top;">
          <table class="grid">
            <tr>
              <th>Other Charges</th>
              <th class="right">Amount</th>
            </tr>

            <tr>
              <td>Reconnection Fee</td>
              <td class="right">0.00</td>
            </tr>
            <tr>
              <td>Charges for Belated Payments</td>
              <td class="right">2.00</td>
            </tr>
            <tr>
              <td>Monthly Fuel Surcharge</td>
              <td class="right">{{ $chargeHeads['Monthly Fuel Surcharge']['result'] }}</td>
            </tr>
            <tr>
              <td>Green Energy Charge</td>
              <td class="right">0.00</td>
            </tr>

            <tr class="total-row">
              <td>UnDisputed Arr Amount</td>
              <td class="right">115.00</td>
            </tr>

            <tr>
              <td>Electricity Duty</td>
              <td class="right">{{ $chargeHeads['Electricity Duty']['result'] }}</td>
            </tr>
            <tr>
              <td>Ele. Surcharge</td>
              <td class="right">{{ $chargeHeads['Electricity Surcharge']['result'] }}</td>
            </tr>

            <tr class="total-row">
              <td>Net Payable</td>
              <td class="right">{{$bill['bill_amount'] ?? 0}}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div class="footer">
      <i>(Rupees One Lakh Seventeen Thousand Eight Hundred Thirty Nine Only)</i>
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
        <td><strong>Cons#:</strong> <span class="mono">{{ $connection['consumer_number'] ?? '' }}</span></td>
        <td><strong>Bill No:</strong> <span class="mono">21028112257573</span></td>
        <td><strong>Rs:</strong> <span class="mono">{{$bill['bill_amount'] ?? 0}}</span></td>
      </tr>
    </table>
  </div>

</body>

</html>