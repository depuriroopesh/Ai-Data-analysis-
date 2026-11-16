import { SharedFile } from './types';

export const SAMPLE_STRUCTURED_FILE: Omit<SharedFile, 'id'> = {
  name: 'ecommerce_sales_q3.csv',
  size: 14250,
  type: 'csv',
  classification: 'structured',
  status: 'raw',
  uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  uploaderName: 'Demo Team',
  isSample: true,
  rawContent: `Order_ID,Date,Product_Name,Category,Customer_City,Quantity,Unit_Price,Total_Revenue,Rating
ORD-1001,2026-07-01,Quantum Wireless Earbuds,Electronics,New York,2,89.99,179.98,4.8
ORD-1002,2026-07-02,Ergonomic Mesh Chair,Furniture,San Francisco,1,249.50,249.50,4.5
ORD-1003,2026/07/02,Organic Dark Roast Coffee,Grocery,Seattle,3,18.00,54.00,4.9
ORD-1004,2026-07-03,UltraHD 27-inch Monitor,Electronics,Austin,1,320.00,320.00,4.7
ORD-1005,2026-07-04,Mechanical RGB Keyboard,Electronics,New York,2,110.00,220.00,
ORD-1006,2026-07-04,Standing Desk Converter,Furniture,Chicago,1,195.00,195.00,4.3
ORD-1007,2026-07-05,Stainless Steel Water Bottle,Home,Seattle,4,22.50,90.00,4.6
ORD-1008,2026-07-05,Quantum Wireless Earbuds,Electronics,New York,2,89.99,179.98,4.8
ORD-1009,2026-07-06,Noise Cancelling Headphones,Electronics,San Francisco,1,199.99,199.99,4.9
ORD-1010,2026-07-07,Bamboo Cutting Board,Home,Austin,2,35.00,70.00,4.4
ORD-1011,2026-07-08,Ergonomic Mesh Chair,Furniture,Chicago,2,249.50,499.00,4.6
ORD-1012,2026-07-09,Organic Dark Roast Coffee,Grocery,New York,5,18.00,90.00,5.0
ORD-1013,2026-07-10,Smart LED Desk Lamp,Electronics,Seattle,1,45.00,45.00,4.2
ORD-1014,2026-07-11,Stainless Steel Water Bottle,Home,San Francisco,2,22.50,45.00,4.5
ORD-1015,2026-07-12,UltraHD 27-inch Monitor,Electronics,Chicago,2,320.00,640.00,4.8`
};

export const SAMPLE_UNSTRUCTURED_FILE: Omit<SharedFile, 'id'> = {
  name: 'customer_support_transcripts.txt',
  size: 8400,
  type: 'txt',
  classification: 'unstructured',
  status: 'raw',
  uploadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  uploaderName: 'Demo Team',
  isSample: true,
  rawContent: `TRANSCRIPT 1 - TICKET #88412
Date: July 14, 2026
Customer: Sarah Jenkins (Email: s.jenkins@example.com, Location: Boston)
Agent: Marcus Vance
Product: Enterprise Cloud Data Hub (Subscription Plan: Premium Tier)
Issue Summary: Customer reported intermittent latency spikes when syncing dataset files over 50MB during peak morning hours (9:00 AM - 11:00 AM EST).
Customer Statement: "We are trying to load daily CSV reports for our executive board meeting, but the pipeline hangs at 88%. This has delayed our morning report twice this week."
Resolution: Agent Marcus verified backend rate limits and upgraded the organization's API concurrency threshold from 10 to 50 threads. Latency dropped from 4.2s to 180ms. Customer expressed high satisfaction.
Sentiment: Positive after resolution. Key Topics: Performance, Rate Limits, API Concurrency.

TRANSCRIPT 2 - TICKET #88419
Date: July 15, 2026
Customer: David Chen (Email: dchen@techcorp.io, Location: Seattle)
Agent: Elena Rostova
Product: AI Studio Multi-Agent Orchestrator (License: Enterprise)
Issue Summary: Invoice mismatch for invoice #INV-2026-092. Billed amount was $1,450.00 instead of agreed contract price of $1,200.00.
Customer Statement: "Our quarterly discount coupon (SPRING2026) was not applied to invoice #INV-2026-092. Please issue a corrected invoice and refund the difference of $250.00."
Resolution: Agent Elena verified coupon code validity, issued a credit refund of $250.00 to account credit card ending in 4091, and forwarded corrected invoice to billing department.
Sentiment: Neutral / Satisfied. Key Topics: Billing, Refunds, Invoice Discount.

TRANSCRIPT 3 - TICKET #88425
Date: July 16, 2026
Customer: Dr. Aris Thorne (Email: athorne@bioresearch.org, Location: Chicago)
Agent: Marcus Vance
Product: Unstructured Data Processor Module
Issue Summary: Request for custom PDF entity extraction rule for medical research papers.
Customer Statement: "Can the AI Processor extract dosage amounts and clinical trial phase numbers directly into a CSV output?"
Resolution: Agent Marcus provided a custom JSON extraction schema template. User tested on 15 papers with 96.4% extraction accuracy.
Sentiment: Highly Positive. Key Topics: Feature Request, PDF Extraction, Accuracy.`
};
