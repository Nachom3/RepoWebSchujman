# Panel Summary Specification

## Purpose

Aggregated metrics dashboard: monthly income, m³ dispatched this week, peak hours, payment status. Single endpoint, JWT required. All computations via Prisma queries (no denormalized tables).

---

## Endpoint

### Requirement: Panel Summary Endpoint

`GET /api/panel/summary` — Returns aggregated metrics. JWT required.

Response shape:

```json
{
  "monthlyIncome": 0.0,
  "m3DispatchedThisWeek": 0.0,
  "peakHours": [{ "hour": 0, "count": 0 }],
  "paymentStatus": { "paid": 0.0, "pending": 0.0 }
}
```

#### Scenario: Empty data

- GIVEN no orders, no movements → GET → 200 with all zeros

#### Scenario: Populated data

- GIVEN 10 COMPLETADA orders this month → GET → monthlyIncome = sum(priceSnapshot × quantity)

### Requirement: Monthly Income Computation

`monthlyIncome` MUST equal the sum of `priceSnapshot × quantity` for all Orders with `status = COMPLETADA` and `completedAt` in the current calendar month.

#### Scenario: Income across months

- GIVEN order completed Jan 15 (price=5000, qty=10) and order completed Feb 3 (price=5000, qty=5) → GET in Feb → monthlyIncome = 25000

#### Scenario: Only completed orders count

- GIVEN APROBADA order this month → GET → does not contribute to monthlyIncome

### Requirement: M³ Dispatched This Week

`m3DispatchedThisWeek` MUST equal the sum of `quantity` for all Orders with `status = COMPLETADA` and `completedAt` within the last 7 days.

#### Scenario: Week boundary

- GIVEN order completed 6 days ago (qty=8) and order completed 8 days ago (qty=12) → GET → m3DispatchedThisWeek = 8

### Requirement: Peak Hours

`peakHours` MUST return the top 3 hours (0–23) by count of `completedAt` hour-of-day across the last 30 days of COMPLETADA orders. Sorted descending by count.

#### Scenario: Peak detection

- GIVEN 5 orders completed at hour 8, 3 at hour 14, 2 at hour 10 → GET → peakHours = [{hour:8,count:5},{hour:14,count:3},{hour:10,count:2}]

#### Scenario: Fewer than 3 hours

- GIVEN 1 order at hour 9 → GET → peakHours = [{hour:9,count:1}]

### Requirement: Payment Status

`paymentStatus` MUST aggregate:
- `paid`: sum of `monto` for CREDITO movements this month
- `pending`: sum of `monto` for DEBITO movements this month

#### Scenario: Mixed movements

- GIVEN 3 CREDITO (100, 200, 300) and 2 DEBITO (50, 150) this month → GET → paid=600, pending=200

---

## Error States

| Code | Condition |
|------|-----------|
| 401 | No JWT / expired |

---

## Frontend Contracts

### Requirement: Panel View

The frontend MUST render 4 metric cards, a bar list for m³/week by day, and a peak hours list. No charting library — use Tailwind-styled bars.

| Component | shadcn primitives |
|-----------|-------------------|
| PanelView | Card (×4 for metrics), Separator |
| MetricCard | Card, CardHeader, CardTitle, CardContent |
| M3BarList | custom Tailwind bars (div + width%) |
| PeakHoursList | Table, TableRow, TableCell |

#### Scenario: Four cards render

- GET /api/panel/summary → PanelView shows: Monthly Income, m³ This Week, Peak Hours, Payment Status

#### Scenario: Empty state

- All zeros → cards show "$0", "0 m³", "—", "$0 / $0"
