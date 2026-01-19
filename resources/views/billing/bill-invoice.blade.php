{{-- ================= Invoice ================= --}}
<div class="invoice">

    <div class="center" style="font-weight:bold;font-size:14px;border:1px solid #000;padding:4px;">
        Invoice
    </div>

    <table class="grid">
        <tr>
            {{-- ================= LEFT : Main Invoice ================= --}}
            <td style="width:66%;vertical-align:top;padding:0;">

                <table class="grid">
                    <thead>
                        <tr>
                            <th colspan="2"></th>
                            <th class="right">Units</th>
                            <th class="right">Rate</th>
                            <th class="right">Amount (Rs)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {{-- 1. Total Demand Charge --}}
                        <tr>
                            <td colspan="5">1. Total Demand Charge</td>
                        </tr>

                        <tr>
                            <td colspan="2">Timezone</td>
                            <td>Unit</td>
                            <td>Rate</td>
                            <td>Amount (Rs)</td>
                        </tr>

                        <tr class="total-row">
                            <td colspan="4">Sub Total (a+b+c+d+e+f)</td>
                            <td class="right">
                                {{ is_numeric($chargeHeads['total_demand_charge']['result'] ?? null)
                                    ? number_format($chargeHeads['total_demand_charge']['result'], 2)
                                    : '-' }}
                            </td>
                        </tr>

                        {{-- 2. Total Energy Charges --}}
                        <tr>
                            <td colspan="5">2. Total Energy Charges</td>
                        </tr>

                        <tr>
                            <td colspan="2">Timezone</td>
                            <td>Unit</td>
                            <td>Rate</td>
                            <td>Amount (Rs)</td>
                        </tr>

                        <tr class="total-row">
                            <td colspan="4">Sub Total (a+b+c)</td>
                            <td class="right">
                                {{ is_numeric($chargeHeads['energy_charge']['result'] ?? null)
                                    ? number_format($chargeHeads['energy_charge']['result'], 2)
                                    : '-' }}
                            </td>
                        </tr>

                        {{-- 3. PF Incentive / Disincentive --}}
                        <tr>
                            <td colspan="4">3. PF Incentive / Disincentive</td>
                            <td class="right">
                                {{ is_numeric($chargeHeads['power_factor_incentive_and_disincentive']['result'] ?? null)
                                    ? number_format($chargeHeads['power_factor_incentive_and_disincentive']['result'], 2)
                                    : '-' }}
                            </td>
                        </tr>

                        {{-- Total Energy Charge --}}
                        <tr class="total-row">
                            <td colspan="4">Total Energy Charge</td>
                            <td class="right">
                                {{ is_numeric($chargeHeads['energy_charge']['result'] ?? null)
                                    ? number_format($chargeHeads['energy_charge']['result'], 2)
                                    : '-' }}
                            </td>
                        </tr>

                        {{-- 4. Lighting --}}
                        <tr>
                            <td colspan="5">4. Energy Charges on Lighting load</td>
                        </tr>

                        <tr>
                            <td colspan="2">a. Factory lighting</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>

                        <tr>
                            <td colspan="2">b. Colony lighting</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>

                        <tr class="total-row">
                            <td colspan="4">Sub Total (a+b)</td>
                            <td class="right">-</td>
                        </tr>

                        {{-- 5–8 --}}
                        <tr>
                            <td colspan="2">5. Electricity Duty</td>
                            <td>Unit</td>
                            <td>Rate</td>
                            <td>Amount (Rs)</td>
                        </tr>

                        <tr>
                            <td colspan="2">6. Ele. Surcharge (*)</td>
                            <td>Unit</td>
                            <td>Rate</td>
                            <td>Amount (Rs)</td>
                        </tr>

                        <tr>
                            <td colspan="2">7. Duty On Self Generated Energy</td>
                            <td>Unit</td>
                            <td>Rate</td>
                            <td>Amount (Rs)</td>
                        </tr>

                        <tr>
                            <td colspan="4">8. Penalty for non-segregation of light load</td>
                            <td class="right">-</td>
                        </tr>
                    </tbody>
                </table>

            </td>

            {{-- ================= RIGHT : Summary ================= --}}
            <td style="width:34%;vertical-align:top;padding:0;">

                <table class="grid">
                    <thead>
                        <tr>
                            <th colspan="2"></th>
                            <th class="right">Amount (Rs)</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="total-row">
                            <td colspan="3">9. Other Charges</td>
                        </tr>

                        <tr>
                            <td colspan="2">Reconnection Fee</td>
                            <td class="right">0.00</td>
                        </tr>

                        <tr>
                            <td colspan="2">Charges for Belated Payments</td>
                            <td class="right">1587.00</td>
                        </tr>

                        <tr>
                            <td colspan="2">LOW_VOLT_SUR</td>
                            <td class="right">117705.00</td>
                        </tr>

                        <tr>
                            <td colspan="2">Monthly Fuel Surcharge</td>
                            <td class="right">0.00</td>
                        </tr>

                        <tr>
                            <td colspan="2">Green Energy Charge</td>
                            <td class="right">14622.30</td>
                        </tr>

                        <tr>
                            <td colspan="3" style="height:12px;"></td>
                        </tr>

                        <tr class="total-row">
                            <td colspan="2">10. Total (add 1 to 9)</td>
                            <td class="right">334125.93</td>
                        </tr>

                        <tr>
                            <td colspan="2">Plus / Minus (Round off)</td>
                            <td class="right">0.07</td>
                        </tr>

                        <tr>
                            <td colspan="2">UnDisputed Arr Amount</td>
                            <td class="right">1096.00</td>
                        </tr>

                        <tr>
                            <td colspan="2">ACD_FY Assessment</td>
                            <td class="right">0.00</td>
                        </tr>

                        <tr>
                            <td rowspan="3" class="center">Less</td>
                            <td>1. Advance / Credit</td>
                            <td class="right">0.00</td>
                        </tr>

                        <tr>
                            <td>2. CD Interest</td>
                            <td class="right">0.00</td>
                        </tr>

                        <tr>
                            <td>3. CD / Oth Ref</td>
                            <td class="right">0.00</td>
                        </tr>

                        <tr class="total-row">
                            <td colspan="2">Net Payable</td>
                            <td class="right">335222.00</td>
                        </tr>
                    </tbody>
                </table>

            </td>
        </tr>
    </table>

</div>