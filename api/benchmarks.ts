import type { Request, Response } from 'express';

function normalizeUrl(input: string): string {
  const s = input.trim();
  return s.startsWith('http://') || s.startsWith('https://') ? s : `https://${s}`;
}

async function fetchPageText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    });
    const html = await res.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

const BENCHMARK_SCHEMA = `{
  "roadmap-prioritisation": { "pmCount": <int>, "hourlyRate": <int annual cost in local currency> },
  "customer-centric-building": { "devTeamSize": <int>, "avgDevSalary": <int annual cost>, "alignmentImprovement": <int 10-25> },
  "regulatory-confidence": { "regulatedInteractions": <int annual>, "incidentProb": <float e.g. 0.001>, "avgFine": <int>, "riskReduction": <int 15-40> },
  "compliance-review-efficiency": { "interactionsAudited": <int annual>, "reviewTime": <int minutes 5-30>, "analystCost": <int annual cost>, "reviewReduction": <int 20-60> },
  "reduced-service-escalations": { "complaintCount": <int annual>, "costPerComplaint": <int>, "reduction": <int 10-30> },
  "sustained-brand-confidence": { "incidentCount": <int 2-20>, "costPerIncident": <int>, "preventionRate": <int 20-50> },
  "nps-improvement-roi": { "totalCustomerBase": <int>, "npsImprovement": <float 1-5>, "referralRatePerPoint": <float 0.05-0.5>, "avgNewCustomerValue": <int> },
  "retained-customer-value": { "customersAtRisk": <int annual>, "successRate": <int 10-30>, "clv": <int> },
  "reduced-reactive-retention-spend": { "customersSaved": <int annual>, "avgIncentive": <int cost per customer> },
  "competitive-win-rate-improvement": { "competitiveOpps": <int annual>, "winRateInc": <float 0.5-3>, "avgAnnualValue": <int contract value> },
  "faster-competitive-response": { "targetedCustomers": <int annual>, "arpu": <int annual revenue per customer>, "churnAvoidedComp": <float 1-5> },
  "upsell-cross-sell-conversion": { "eligibleCustomers": <int>, "conversionImprovement": <float 0.5-3>, "avgUpsellValue": <int> },
  "sales-channel-conversion": { "salesLeads": <int annual>, "salesConversionImprovement": <float 0.5-2>, "avgCustomerValue": <int> },
  "marketing-spend-efficiency": { "annualMarketingSpend": <int>, "conversionEfficiencyLift": <float 2-10> },
  "reduced-cac": { "annualAcquired": <int annual>, "avgCac": <int>, "cacReduction": <float 1-5> },
  "aht-reduction": { "agentCount": <int>, "callsPerDay": <int 30-80>, "wrapUpTimeSaved": <float 1-3 minutes>, "agentAnnualCost": <int annual cost> },
  "personalised-coaching": { "agents": <int>, "avgSalary": <int annual cost>, "prodImprovement": <float 2-8> },
  "reduced-agent-attrition": { "totalAgentsChurn": <int>, "attritionReduction": <float 2-10>, "hiringCost": <int per agent> },
  "analysis-productivity-gain": { "analystCount": <int>, "hoursSaved": <int 5-20 per month>, "hourlyCost": <int annual cost> },
  "faster-decision-making": { "decisionCount": <int 20-100 per year>, "decisionValue": <int per decision>, "accelerationFactor": <int 10-30> }
}`;

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body ?? {};
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI service not configured — add ANTHROPIC_API_KEY to your Vercel environment variables.' });

  try {
    const normalizedUrl = normalizeUrl(url);
    const pageText = await fetchPageText(normalizedUrl);

    const prompt = `You are an expert business analyst. A user has provided their company URL for an ROI calculator focused on CX analytics (contact centre operations, compliance, NPS, customer retention, competitive intelligence, revenue growth).

Company URL: ${normalizedUrl}
${pageText ? `\nWebsite content (excerpt):\n${pageText}\n` : ''}
Based on the company's apparent industry, scale, and geography, provide realistic industry benchmark values.

Important guidance:
- Scale values to company size (small = thousands of agents/customers, large enterprise = tens of thousands+)
- Use local currency scale: UK/EU companies typically have lower absolute USD figures; adjust for GBP/EUR vs USD
- incidentProb should be a small decimal (e.g. 0.001 means 0.1% of interactions)
- All percentage improvement fields (reduction, riskReduction, etc.) should be integers between their noted ranges
- Be realistic and conservative — these are industry benchmarks, not best-case projections

Return ONLY a valid JSON object matching this exact structure (no explanation, no markdown fences):
${BENCHMARK_SCHEMA}`;

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('Anthropic API error:', errText);
      throw new Error('AI service returned an error');
    }

    const claudeData = await claudeRes.json();
    const text: string = claudeData.content?.[0]?.text ?? '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI returned an unexpected format');

    const values = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ values });
  } catch (err) {
    console.error('Benchmarks error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to generate benchmarks' });
  }
}
