import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, ShieldCheck, Award, UserMinus, Users,
  TrendingUp, Search, Headphones, Monitor, ChevronRight,
  Menu, X, Share2, Sparkles
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { getClient, localise } from "./clients";
import type { ClientConfig } from "./clients";
import Admin from "./Admin";

const CURRENCIES = [
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
];

function ROICard({ title, problem, solution, inputs, calculate, icon, accentColor, values, onValueChange, currencySymbol, formula, locale = 'en-GB' }: { title: any; problem: any; solution: any; inputs: any; calculate: any; icon: any; accentColor: any; values: any; onValueChange: any; currencySymbol: any; formula: any; locale?: 'en-GB' | 'en-US' }) {
  const result = useMemo(() => calculate(values), [values, calculate]);
  const fmt = (v) => v.toLocaleString("en-US");
  const parse = (s) => Number(s.replace(/[^0-9.-]+/g, ""));
  const progress = (inp, val) => Math.max(0, Math.min(100, ((val - inp.min) / (inp.max - inp.min)) * 100));

  return (
    <div className="card">
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ padding:8, background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8 }}>{icon}</div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1 }}>Est. 3-Year Value</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#0f172a" }}>{currencySymbol}{result.toLocaleString("en-US", { maximumFractionDigits:0 })}</div>
        </div>
      </div>
      <h3 style={{ fontSize:16, fontWeight:700, color:"#0f172a", marginBottom:8 }}>{title}</h3>
      <div style={{ marginBottom:16, flexGrow:1 }}>
        <div style={{ marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:800, color:"#334155", textTransform:"uppercase", letterSpacing:0.5 }}>Challenge</span>
          <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:"4px 0 0" }}>{localise(problem, locale)}</p>
        </div>
        <div>
          <span style={{ fontSize:11, fontWeight:800, color:"#334155", textTransform:"uppercase", letterSpacing:0.5 }}>How it works</span>
          <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:"4px 0 0" }}>{localise(solution, locale)}</p>
        </div>
      </div>
      <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:16 }}>
        {inputs.map(inp => (
          <div key={inp.id} style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{inp.label}</label>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <input
                  type="text"
                  value={fmt(values[inp.id] ?? inp.defaultValue)}
                  onChange={e => { const n = parse(e.target.value); if (!isNaN(n)) onValueChange(inp.id, n); }}
                  style={{ width:88, padding:"4px 8px", textAlign:"right", fontSize:13, fontWeight:700, color:"#0f172a", border:"1px solid #cbd5e1", borderRadius:6, outline:"none" }}
                />
                <span style={{ fontSize:12, color:"#64748b", minWidth:20 }}>
                  {inp.unit === "$" || inp.unit === "€" || inp.unit === "£" ? currencySymbol : inp.unit}
                </span>
              </div>
            </div>
            {inp.guidance && (
              <p style={{ fontSize:11, color:"#94a3b8", margin:"0 0 6px", lineHeight:1.5 }}>{inp.guidance}</p>
            )}
            <input
              type="range" min={inp.min} max={inp.max} step={inp.step}
              value={values[inp.id] ?? inp.defaultValue}
              onChange={e => onValueChange(inp.id, Number(e.target.value))}
              style={{
                width:"100%", height:6, borderRadius:9999, appearance:"none", cursor:"pointer",
                background:`linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${progress(inp, values[inp.id] ?? inp.defaultValue)}%, #e2e8f0 ${progress(inp, values[inp.id] ?? inp.defaultValue)}%, #e2e8f0 100%)`
              }}
            />
          </div>
        ))}
      </div>
      {formula && (
        <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:10, marginTop:4 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>How we calculated this</div>
          <p style={{ fontSize:11, color:"#94a3b8", margin:0, lineHeight:1.6 }}>{formula}</p>
        </div>
      )}
    </div>
  );
}

const SECTIONS = [
  {
    id:"product-feedback", title:"Product Feedback",
    description:"Accelerate your roadmap by identifying high-impact features from across your operating companies.",
    icon:<LayoutDashboard size={18} color="#6366f1"/>, accentColor:"#6366f1",
    cards:[
      {
        id:"roadmap-prioritisation", title:"Roadmap Prioritisation",
        problem:"Product managers across your operating companies spend significant time manually reviewing and tagging interaction data to identify feature requests and recurring themes — work that scales poorly as interaction volumes grow.",
        solution:"The platform automatically categorises recurring themes from interactions across all supported markets, surfacing product signals that would otherwise be buried in volume and reducing the manual effort required to identify genuine priorities.",
        icon:<LayoutDashboard size={20} color="#6366f1"/>,
        inputs:[
          { id:"pmCount", label:"Number of Product Managers", min:1, max:100, step:1, unit:"", defaultValue:0,
            guidance:"Total product managers across your operating companies" },
          { id:"hourlyRate", label:"Annual Loaded Cost per PM", min:50000, max:500000, step:5000, unit:"$", defaultValue:0,
            guidance:"Include salary, benefits and on-costs" }
        ],
        calculate:v => ((v.pmCount||0)*20*0.9*((v.hourlyRate||0)/2000)*12)*3,
        formula:"Product managers × 20 hrs/month × 90% efficiency gain × hourly rate × 12 months × 3 years"
      },
      {
        id:"customer-centric-building", title:"Customer-Centric Product Development",
        problem:"Without reliable signal on which features operating company customers actually use and value, development resource is spread across low-impact work — a structural inefficiency that compounds over planning cycles.",
        solution:"Sentiment clustering and request analysis across interaction data gives product teams a clear view of genuine customer priorities, improving alignment between development investment and measurable customer value.",
        icon:<LayoutDashboard size={20} color="#6366f1"/>,
        inputs:[
          { id:"devTeamSize", label:"Development Team Size", min:5, max:500, step:5, unit:"", defaultValue:0,
            guidance:"Total developers across all product teams" },
          { id:"avgDevSalary", label:"Average Annual Loaded Cost per Dev", min:80000, max:250000, step:5000, unit:"$", defaultValue:0,
            guidance:"Include salary, benefits and on-costs" },
          { id:"alignmentImprovement", label:"Roadmap Alignment Improvement", min:5, max:50, step:5, unit:"%", defaultValue:0,
            guidance:"Estimated improvement in alignment between development investment and customer-valued features" }
        ],
        calculate:v => ((v.devTeamSize||0)*(v.avgDevSalary||0)*0.25*((v.alignmentImprovement||0)/100))*3,
        formula:"Dev team size × average dev cost × 25% roadmap waste factor × alignment improvement % × 3 years"
      }
    ]
  },
  {
    id:"compliance", title:"Compliance",
    description:"Maintain regulatory confidence across every market your shared service centres support.",
    icon:<ShieldCheck size={18} color="#10b981"/>, accentColor:"#10b981",
    cards:[
      {
        id:"regulatory-confidence", title:"Regulatory Confidence",
        problem:"Agents supporting multiple markets cannot reasonably hold every regulatory nuance in their heads, particularly as rules evolve across jurisdictions. Regulatory risk accumulates not through negligence, but through the inherent limits of human recall at scale.",
        solution:"The platform monitors live interactions for signals that indicate potential regulatory misalignment — flagging phrases, commitments, or omissions that a human agent would not connect to a regulatory requirement — and prompts agents in real time so the organisation stays aligned across every market.",
        icon:<ShieldCheck size={20} color="#10b981"/>,
        inputs:[
          { id:"regulatedInteractions", label:"Regulated Interactions / Year", min:100000, max:500000000, step:100000, unit:"", defaultValue:0,
            guidance:"Total regulated interactions across all supported markets annually" },
          { id:"incidentProb", label:"Incident Probability", min:0.0001, max:0.1, step:0.0001, unit:"%", defaultValue:0,
            guidance:"Estimated probability of a regulatory incident per interaction" },
          { id:"avgFine", label:"Average Regulatory Cost", min:100, max:10000000, step:100, unit:"€", defaultValue:0,
            guidance:"Average cost of a regulatory incident, including fines and remediation" },
          { id:"riskReduction", label:"Risk Reduction", min:5, max:50, step:5, unit:"%", defaultValue:0,
            guidance:"Estimated reduction in incident probability through real-time monitoring" }
        ],
        calculate:v => ((v.regulatedInteractions||0)*((v.incidentProb||0)/100)*(v.avgFine||0)*((v.riskReduction||0)/100))*3,
        formula:"Regulated interactions × incident probability × average regulatory cost × risk reduction % × 3 years"
      },
      {
        id:"compliance-review-efficiency", title:"Compliance Review Efficiency",
        problem:"Compliance teams manually audit a fraction of total interactions to verify regulatory adherence — a process that is resource-intensive, inconsistent, and unable to scale with growing interaction volumes across markets.",
        solution:"Automated pre-screening prioritises the interactions most likely to require human review, enabling compliance analysts to focus their time where it matters and increasing the coverage achievable within existing resource.",
        icon:<ShieldCheck size={20} color="#10b981"/>,
        inputs:[
          { id:"interactionsAudited", label:"Interactions Audited / Year", min:10000, max:5000000, step:10000, unit:"", defaultValue:0,
            guidance:"Total interactions manually reviewed by compliance teams annually" },
          { id:"reviewTime", label:"Average Review Time", min:1, max:60, step:1, unit:"min", defaultValue:0,
            guidance:"Average time a compliance analyst spends per interaction" },
          { id:"analystCost", label:"Analyst Annual Loaded Cost", min:40000, max:400000, step:5000, unit:"$", defaultValue:0,
            guidance:"Include salary, benefits and on-costs" },
          { id:"reviewReduction", label:"Manual Review Reduction", min:5, max:90, step:5, unit:"%", defaultValue:0,
            guidance:"Estimated reduction in manual review requirement through automated pre-screening" }
        ],
        calculate:v => ((v.interactionsAudited||0)*((v.reviewTime||0)/60)*((v.analystCost||0)/2000)*((v.reviewReduction||0)/100))*3,
        formula:"Interactions audited × review time (hrs) × analyst hourly rate × manual review reduction % × 3 years"
      }
    ]
  },
  {
    id:"brand", title:"Brand",
    description:"Protect your reputation and maintain service consistency across all channels and markets.",
    icon:<Award size={18} color="#f59e0b"/>, accentColor:"#f59e0b",
    cards:[
      {
        id:"reduced-service-escalations", title:"Reduced Service Escalations",
        problem:"Customer experience issues that reach public channels — social media, press, regulatory bodies — create reputational exposure that is disproportionate to the original service failure. By the time these escalations surface, the window to intervene has closed.",
        solution:"By identifying patterns in interaction data before they become systemic, operating companies can address root causes earlier, reducing the volume of issues that escalate beyond the service relationship.",
        icon:<Award size={20} color="#f59e0b"/>,
        inputs:[
          { id:"complaintCount", label:"Public Escalations Annually", min:1000, max:1000000, step:1000, unit:"", defaultValue:0,
            guidance:"Public complaints or social escalations per year across all markets" },
          { id:"costPerComplaint", label:"Estimated Cost per Incident", min:10, max:5000, step:10, unit:"€", defaultValue:0,
            guidance:"Include agent time, management escalation and remediation costs" },
          { id:"reduction", label:"Reduction from Earlier Detection", min:5, max:50, step:5, unit:"%", defaultValue:0,
            guidance:"Estimated reduction through earlier identification and intervention" }
        ],
        calculate:v => ((v.complaintCount||0)*(v.costPerComplaint||0)*((v.reduction||0)/100))*3,
        formula:"Annual escalations × cost per incident × reduction % × 3 years"
      },
      {
        id:"sustained-brand-confidence", title:"Sustained Brand Confidence",
        problem:"When systemic service issues go undetected across high-volume interaction channels, they can compound into significant reputation events — attracting media coverage, regulatory attention, or sustained customer backlash across multiple markets.",
        solution:"Early detection of emerging patterns gives leadership teams the information they need to act before an issue reaches critical mass, maintaining the consistency of service that underpins long-term brand trust.",
        icon:<Award size={20} color="#f59e0b"/>,
        inputs:[
          { id:"incidentCount", label:"Potential Brand-Impacting Incidents / Year", min:1, max:100, step:1, unit:"", defaultValue:0,
            guidance:"Estimated incidents per year that could escalate to brand level" },
          { id:"costPerIncident", label:"Estimated Cost per Incident", min:10000, max:10000000, step:10000, unit:"€", defaultValue:0,
            guidance:"Include direct costs, remediation and estimated reputational impact" },
          { id:"preventionRate", label:"Prevention Rate", min:5, max:80, step:5, unit:"%", defaultValue:0,
            guidance:"Estimated % of incidents prevented through earlier detection" }
        ],
        calculate:v => ((v.incidentCount||0)*(v.costPerIncident||0)*((v.preventionRate||0)/100))*3,
        formula:"Potential incidents per year × cost per incident × prevention rate % × 3 years"
      },
      {
        id:"nps-improvement-roi", title:"NPS Improvement",
        problem:"Recurring friction in the customer experience suppresses satisfaction scores and reduces the likelihood of organic advocacy — a measurable drag on growth that is difficult to address without visibility into its root causes across operating companies.",
        solution:"The platform surfaces the specific interaction patterns and service gaps driving dissatisfaction, giving operating companies a prioritised view of where experience improvements will have the greatest impact on NPS and downstream referral behaviour.",
        icon:<Award size={20} color="#f59e0b"/>,
        inputs:[
          { id:"totalCustomerBase", label:"Total Customer Base", min:1000000, max:100000000, step:1000000, unit:"", defaultValue:0,
            guidance:"Total customers across all operating companies" },
          { id:"npsImprovement", label:"NPS Improvement (points)", min:0.5, max:10, step:0.5, unit:"", defaultValue:0,
            guidance:"Expected NPS point improvement from resolving root-cause experience issues" },
          { id:"referralRatePerPoint", label:"Additional Referral Rate per NPS Point", min:0.01, max:2, step:0.01, unit:"%", defaultValue:0,
            guidance:"Estimated % increase in referral rate per NPS point gained" },
          { id:"avgNewCustomerValue", label:"Average Value of a New Customer", min:50, max:2000, step:50, unit:"€", defaultValue:0,
            guidance:"Average first-year revenue value of a new customer" }
        ],
        calculate:v => ((v.totalCustomerBase||0)*((v.npsImprovement||0)*((v.referralRatePerPoint||0)/100))*(v.avgNewCustomerValue||0))*3,
        formula:"Customer base × NPS improvement × referral rate per point % × average new customer value × 3 years"
      }
    ]
  },
  {
    id:"churn-risk", title:"Customer Retention",
    description:"Identify and retain at-risk customers before they disengage.",
    icon:<UserMinus size={18} color="#f43f5e"/>, accentColor:"#f43f5e",
    cards:[
      {
        id:"retained-customer-value", title:"Retained Customer Value",
        problem:"Dissatisfaction in the customer base accumulates gradually, and the signals are often visible in interaction data well before a customer takes action to leave. Without structured visibility across high interaction volumes, these signals go unacknowledged until it is too late to respond.",
        solution:"The platform identifies patterns in interaction data that are statistically associated with elevated disengagement risk, enabling teams to prioritise outreach to the right customers at the right time — before the relationship deteriorates further.",
        icon:<UserMinus size={20} color="#f43f5e"/>,
        inputs:[
          { id:"customersAtRisk", label:"Customers at Retention Risk", min:10000, max:2000000, step:10000, unit:"", defaultValue:0,
            guidance:"Estimated customers showing early disengagement signals annually" },
          { id:"successRate", label:"Intervention Success Rate", min:1, max:50, step:1, unit:"%", defaultValue:0,
            guidance:"% of at-risk customers retained through proactive intervention" },
          { id:"clv", label:"Customer Lifetime Value", min:100, max:2000, step:50, unit:"$", defaultValue:0,
            guidance:"Average lifetime value of a retained customer" }
        ],
        calculate:v => ((v.customersAtRisk||0)*((v.successRate||0)/100)*(v.clv||0))*3,
        formula:"Customers at risk × intervention success rate % × customer lifetime value × 3 years"
      },
      {
        id:"reduced-reactive-retention-spend", title:"Reduced Reactive Retention Spend",
        problem:"Retention offers made reactively — at the point a customer threatens to leave — are typically more expensive and less effective than proactive engagement earlier in the disengagement cycle.",
        solution:"Earlier identification of at-risk customers allows retention teams to engage before the situation becomes critical, reducing reliance on costly last-resort incentives and improving the overall efficiency of retention spend.",
        icon:<UserMinus size={20} color="#f43f5e"/>,
        inputs:[
          { id:"customersSaved", label:"Customers Saved Proactively", min:1000, max:500000, step:1000, unit:"", defaultValue:0,
            guidance:"Estimated customers retained through proactive rather than reactive intervention" },
          { id:"avgIncentive", label:"Average Reactive Retention Incentive", min:10, max:500, step:10, unit:"$", defaultValue:0,
            guidance:"Average cost of a reactive retention offer currently" }
        ],
        calculate:v => ((v.customersSaved||0)*(v.avgIncentive||0))*3,
        formula:"Customers saved proactively × average retention incentive cost × 3 years"
      }
    ]
  },
  {
    id:"competitive-intelligence", title:"Competitive Intelligence",
    description:"Stay ahead by monitoring competitor activity and market shifts across your operating companies.",
    icon:<Users size={18} color="#3b82f6"/>, accentColor:"#3b82f6",
    cards:[
      {
        id:"competitive-win-rate-improvement", title:"Competitive Win Rate Improvement",
        problem:"Sales teams across operating companies lose winnable deals because they lack timely, structured intelligence on the specific objections and competitor comparisons that arise in live prospect interactions.",
        solution:"The platform surfaces competitive themes and objection patterns from interaction data, giving sales teams a continuously updated view of what prospects are comparing and where current positioning needs to be strengthened.",
        icon:<Users size={20} color="#3b82f6"/>,
        inputs:[
          { id:"competitiveOpps", label:"Competitive Sales Opportunities / Year", min:10000, max:1000000, step:10000, unit:"", defaultValue:0,
            guidance:"Annual sales opportunities where competitive comparison is a factor" },
          { id:"winRateInc", label:"Win Rate Improvement", min:0.1, max:5, step:0.1, unit:"%", defaultValue:0,
            guidance:"Expected improvement in win rate from better competitive intelligence" },
          { id:"avgAnnualValue", label:"Average Annual Contract Value", min:50, max:2000, step:50, unit:"$", defaultValue:0,
            guidance:"Average first-year contract value of a won opportunity" }
        ],
        calculate:v => ((v.competitiveOpps||0)*((v.winRateInc||0)/100)*(v.avgAnnualValue||0))*3,
        formula:"Competitive opportunities × win rate improvement % × average contract value × 3 years"
      },
      {
        id:"faster-competitive-response", title:"Faster Competitive Response",
        problem:"When competing operators launch aggressive offers targeting your customer base, response time is critical. Delays in identifying the competitive pressure and co-ordinating a response across markets accelerate customer losses.",
        solution:"Real-time monitoring of interaction patterns allows commercial teams to identify competitive pressure early — before it shows in churn data — enabling a faster, more co-ordinated response across affected markets.",
        icon:<Users size={20} color="#3b82f6"/>,
        inputs:[
          { id:"targetedCustomers", label:"Customers Targeted by Competitors", min:10000, max:1000000, step:10000, unit:"", defaultValue:0,
            guidance:"Estimated customers actively targeted by competing operators annually" },
          { id:"arpu", label:"Average Annual Revenue per Customer", min:100, max:2000, step:50, unit:"$", defaultValue:0,
            guidance:"Average annual revenue per customer across your base" },
          { id:"churnAvoidedComp", label:"Churn Avoided via Faster Response", min:0.5, max:10, step:0.5, unit:"%", defaultValue:0,
            guidance:"% of targeted customers retained through earlier detection and response" }
        ],
        calculate:v => ((v.targetedCustomers||0)*(v.arpu||0)*((v.churnAvoidedComp||0)/100))*3,
        formula:"Customers targeted × revenue per customer × churn avoided % × 3 years"
      }
    ]
  },
  {
    id:"revenue-growth", title:"Revenue Growth",
    description:"Unlock expansion opportunities within your existing customer base.",
    icon:<TrendingUp size={18} color="#8b5cf6"/>, accentColor:"#8b5cf6",
    cards:[
      {
        id:"upsell-cross-sell-conversion", title:"Upsell & Cross-Sell Conversion",
        problem:"Expansion signals exist in customer interaction data — customers expressing interest, asking about additional services, or describing needs that current products could address — but at scale, these signals are not consistently captured or acted upon.",
        solution:"The platform identifies high-intent signals in interaction data and routes them to the relevant commercial teams, enabling targeted engagement that converts expressed customer interest into incremental revenue.",
        icon:<TrendingUp size={20} color="#8b5cf6"/>,
        inputs:[
          { id:"eligibleCustomers", label:"Customers Eligible for Upsell", min:100000, max:10000000, step:100000, unit:"", defaultValue:0,
            guidance:"Customers in your base who are eligible for upsell or cross-sell" },
          { id:"conversionImprovement", label:"Conversion Rate Improvement", min:0.1, max:10, step:0.1, unit:"%", defaultValue:0,
            guidance:"Expected improvement in conversion rate from better signal identification" },
          { id:"avgUpsellValue", label:"Average Upsell Value", min:10, max:500, step:5, unit:"$", defaultValue:0,
            guidance:"Average incremental revenue value per successful upsell" }
        ],
        calculate:v => ((v.eligibleCustomers||0)*((v.conversionImprovement||0)/100)*(v.avgUpsellValue||0))*3,
        formula:"Eligible customers × conversion rate improvement % × average upsell value × 3 years"
      },
      {
        id:"sales-channel-conversion", title:"Sales Channel Conversion Improvement",
        problem:"Conversion rates in sales channels are constrained when messaging and offers are based on broad assumptions rather than the actual priorities and concerns that operating company customers express in their own interactions.",
        solution:"Analysis of interaction patterns across markets enables commercial teams to align messaging and offers with what customers are actually asking for, improving conversion without increasing acquisition spend.",
        icon:<TrendingUp size={20} color="#8b5cf6"/>,
        inputs:[
          { id:"salesLeads", label:"Number of Sales Leads / Year", min:100000, max:5000000, step:100000, unit:"", defaultValue:0,
            guidance:"Total sales leads across all channels and markets annually" },
          { id:"salesConversionImprovement", label:"Conversion Rate Improvement", min:0.1, max:5, step:0.1, unit:"%", defaultValue:0,
            guidance:"Expected improvement in lead-to-sale conversion rate" },
          { id:"avgCustomerValue", label:"Average Value of New Customer", min:50, max:2000, step:50, unit:"$", defaultValue:0,
            guidance:"Average first-year revenue value of a newly acquired customer" }
        ],
        calculate:v => ((v.salesLeads||0)*((v.salesConversionImprovement||0)/100)*(v.avgCustomerValue||0))*3,
        formula:"Sales leads × conversion improvement % × average customer value × 3 years"
      }
    ]
  },
  {
    id:"marketing-insights", title:"Marketing Insights",
    description:"Optimise marketing performance with deeper understanding of what customers across your markets actually care about.",
    icon:<Search size={18} color="#06b6d4"/>, accentColor:"#06b6d4",
    cards:[
      {
        id:"marketing-spend-efficiency", title:"Marketing Spend Efficiency",
        problem:"Marketing investment is allocated to campaigns based on historical performance and broad assumptions about customer priorities, with limited ability to connect messaging to the actual language and concerns of operating company customers in each market.",
        solution:"Interaction analysis gives marketing teams a grounded view of the themes, concerns, and language patterns most relevant to each market, enabling more targeted campaigns that perform better against the same spend.",
        icon:<Search size={20} color="#06b6d4"/>,
        inputs:[
          { id:"annualMarketingSpend", label:"Annual Marketing Campaign Spend", min:10000000, max:1000000000, step:10000000, unit:"€", defaultValue:0,
            guidance:"Total annual spend on marketing campaigns across all markets" },
          { id:"conversionEfficiencyLift", label:"Conversion Efficiency Improvement", min:0.5, max:20, step:0.5, unit:"%", defaultValue:0,
            guidance:"Expected improvement in campaign conversion rate from better customer insight" }
        ],
        calculate:v => ((v.annualMarketingSpend||0)*((v.conversionEfficiencyLift||0)/100))*3,
        formula:"Annual marketing spend × conversion efficiency improvement % × 3 years"
      },
      {
        id:"reduced-cac", title:"Reduced Customer Acquisition Cost",
        problem:"Acquisition costs remain high when spend is allocated to channels and messages that are only partially aligned with how prospective customers are actually making decisions — a gap that is difficult to close without visibility into interaction-level data.",
        solution:"Improved targeting based on interaction intelligence reduces misallocated acquisition spend and improves the efficiency of each campaign, lowering the average cost of bringing a new customer on board.",
        icon:<Search size={20} color="#06b6d4"/>,
        inputs:[
          { id:"annualAcquired", label:"Customers Acquired Annually", min:100000, max:5000000, step:100000, unit:"", defaultValue:0,
            guidance:"Total new customers acquired across all markets and channels annually" },
          { id:"avgCac", label:"Average Customer Acquisition Cost", min:10, max:500, step:10, unit:"$", defaultValue:0,
            guidance:"Current average cost to acquire a new customer" },
          { id:"cacReduction", label:"CAC Reduction from Better Targeting", min:0.5, max:10, step:0.5, unit:"%", defaultValue:0,
            guidance:"Expected reduction in acquisition cost from improved targeting" }
        ],
        calculate:v => ((v.annualAcquired||0)*(v.avgCac||0)*((v.cacReduction||0)/100))*3,
        formula:"Customers acquired annually × average CAC × CAC reduction % × 3 years"
      }
    ]
  },
  {
    id:"care-operations", title:"Care Performance",
    description:"Improve agent productivity and service consistency across your shared service centres.",
    icon:<Headphones size={18} color="#f97316"/>, accentColor:"#f97316",
    cards:[
      {
        id:"aht-reduction", title:"Reduced Wrap-Up Time",
        problem:"Agents in shared service centres spend a significant portion of each interaction on post-call administration — selecting disposition codes, updating records, and summarising outcomes in legacy systems that were not designed for speed or accuracy at scale.",
        solution:"The platform automates interaction summarisation and outcome tagging in real time, removing the manual wrap-up burden from agents and producing more consistent, structured data for operational reporting across all supported markets.",
        icon:<Headphones size={20} color="#f97316"/>,
        inputs:[
          { id:"agentCount", label:"Number of Agents", min:10, max:1000, step:10, unit:"", defaultValue:0,
            guidance:"Total agents across your shared service centres" },
          { id:"callsPerDay", label:"Interactions per Agent per Day", min:5, max:100, step:5, unit:"", defaultValue:0,
            guidance:"Average daily interactions handled per agent" },
          { id:"wrapUpTimeSaved", label:"Wrap-Up Time Saved per Interaction", min:0.5, max:10, step:0.5, unit:"min", defaultValue:0,
            guidance:"Estimated minutes of wrap-up time eliminated per interaction" },
          { id:"agentAnnualCost", label:"Agent Annual Loaded Cost", min:5000, max:150000, step:1000, unit:"€", defaultValue:0,
            guidance:"Include salary, benefits and on-costs per agent" }
        ],
        calculate:v => ((v.wrapUpTimeSaved||0)*(v.agentCount||0)*(v.callsPerDay||0)*250*((v.agentAnnualCost||0)/120000))*3,
        formula:"Wrap-up time saved (hrs) × agents × interactions per day × 250 working days × hourly rate × 3 years"
      },
      {
        id:"personalised-coaching", title:"Personalised Coaching",
        problem:"Performance variation across large agent populations is difficult to address at scale when coaching is based on manual sampling of a small fraction of total interactions. Most agents receive generic feedback that does not reflect their specific patterns or the markets they support.",
        solution:"Automated analysis of every interaction enables targeted, evidence-based coaching for each agent — identifying the specific behaviours and conversation patterns that, if improved, would have the greatest measurable impact on performance.",
        icon:<Headphones size={20} color="#f97316"/>,
        inputs:[
          { id:"agents", label:"Number of Agents", min:100, max:20000, step:100, unit:"", defaultValue:0,
            guidance:"Total agents across your shared service centres" },
          { id:"avgSalary", label:"Average Annual Loaded Cost", min:5000, max:100000, step:1000, unit:"$", defaultValue:0,
            guidance:"Include salary, benefits and on-costs per agent" },
          { id:"prodImprovement", label:"Productivity Improvement", min:0.1, max:10, step:0.1, unit:"%", defaultValue:0,
            guidance:"Expected improvement in agent productivity from targeted, evidence-based coaching" }
        ],
        calculate:v => ((v.agents||0)*(v.avgSalary||0)*((v.prodImprovement||0)/100))*3,
        formula:"Number of agents × average annual cost × productivity improvement % × 3 years"
      },
      {
        id:"reduced-agent-attrition", title:"Reduced Agent Attrition",
        problem:"High agent attrition in shared service centres is driven in part by administrative burden, inadequate tooling, and infrequent or imprecise feedback — factors that erode job satisfaction and increase the cost of maintaining stable headcount.",
        solution:"Reducing wrap-up time and providing agents with clear, actionable performance insight based on their actual interactions improves the working experience and reduces the attrition that generates ongoing recruitment and training costs.",
        icon:<Users size={20} color="#f97316"/>,
        inputs:[
          { id:"totalAgentsChurn", label:"Total Number of Support Agents", min:100, max:50000, step:100, unit:"", defaultValue:0,
            guidance:"Total agents across all shared service centres" },
          { id:"attritionReduction", label:"Reduction in Attrition Rate", min:0.5, max:20, step:0.5, unit:"%", defaultValue:0,
            guidance:"Expected reduction in annual attrition rate" },
          { id:"hiringCost", label:"Cost to Hire and Train per Agent", min:1000, max:50000, step:500, unit:"€", defaultValue:0,
            guidance:"Include recruitment, onboarding and training costs" }
        ],
        calculate:v => ((v.totalAgentsChurn||0)*((v.attritionReduction||0)/100)*(v.hiringCost||0))*3,
        formula:"Total agents × attrition reduction % × cost to hire and train per agent × 3 years"
      }
    ]
  },
  {
    id:"strategic-decision-velocity", title:"Strategic Decision Velocity",
    description:"Accelerate decision-making and reduce the time from insight to action across your organisation.",
    icon:<Monitor size={18} color="#ec4899"/>, accentColor:"#ec4899",
    cards:[
      {
        id:"analysis-productivity-gain", title:"Analysis Productivity Gain",
        problem:"Analysts and managers across operating companies spend significant time compiling reports, extracting data from disparate systems, and preparing presentations — work that delays the availability of insight and reduces the time available for higher-value analysis.",
        solution:"Automated insight generation and structured reporting reduces the time from question to answer, enabling teams to spend more time acting on intelligence rather than assembling it from multiple sources.",
        icon:<Monitor size={20} color="#ec4899"/>,
        inputs:[
          { id:"analystCount", label:"Number of Analysts / Managers", min:10, max:2000, step:10, unit:"", defaultValue:0,
            guidance:"Analysts, managers and team leads who regularly produce or consume performance reports" },
          { id:"hoursSaved", label:"Hours Saved per Month", min:1, max:40, step:1, unit:"hr", defaultValue:0,
            guidance:"Estimated hours saved per person per month through automated reporting" },
          { id:"hourlyCost", label:"Average Annual Loaded Cost", min:60000, max:400000, step:5000, unit:"€", defaultValue:0,
            guidance:"Include salary, benefits and on-costs" }
        ],
        calculate:v => ((v.analystCount||0)*(v.hoursSaved||0)*12*((v.hourlyCost||0)/2000))*3,
        formula:"Number of analysts × hours saved per month × 12 months × hourly rate × 3 years"
      },
      {
        id:"faster-decision-making", title:"Faster Decision Making",
        problem:"Strategic decisions are delayed when the underlying insight — on customer behaviour, market performance, or service quality — is not readily accessible and requires time to compile and validate before it can be presented to senior stakeholders.",
        solution:"Self-service access to structured interaction intelligence enables senior stakeholders to interrogate performance data directly, reducing the cycle time between identifying a question and making an informed decision across markets.",
        icon:<Monitor size={20} color="#ec4899"/>,
        inputs:[
          { id:"decisionCount", label:"Strategic Decisions Annually", min:10, max:500, step:10, unit:"", defaultValue:0,
            guidance:"Significant strategic decisions that depend on customer or market data annually" },
          { id:"decisionValue", label:"Estimated Value per Decision", min:1000, max:1000000, step:1000, unit:"€", defaultValue:0,
            guidance:"Estimated average value at stake per strategic decision" },
          { id:"accelerationFactor", label:"Acceleration Factor", min:1, max:50, step:1, unit:"%", defaultValue:0,
            guidance:"Estimated improvement in decision value from faster, better-informed decisions" }
        ],
        calculate:v => ((v.decisionCount||0)*(v.decisionValue||0)*((v.accelerationFactor||0)/100))*3,
        formula:"Strategic decisions per year × estimated value per decision × acceleration factor % × 3 years"
      }
    ]
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState("summary");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalValues, setGlobalValues] = useState({});
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [subCost, setSubCost] = useState(0);
  const [shareStatus, setShareStatus] = useState<'idle' | 'saving' | 'copied' | 'error'>('idle');
  const [client, setClient] = useState<ClientConfig | null>(null);
  const [benchmarkUrl, setBenchmarkUrl] = useState('');
  const [benchmarkStatus, setBenchmarkStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [benchmarkError, setBenchmarkError] = useState('');

  const handleValueChange = (cardId, inputId, value) => {
    setGlobalValues(prev => ({ ...prev, [cardId]: { ...(prev[cardId]||{}), [inputId]: value } }));
  };

  const getCardValues = (card) =>
    globalValues[card.id] || card.inputs.reduce((a, i) => ({ ...a, [i.id]: i.defaultValue }), {});

  const sectionResults = useMemo(() =>
    SECTIONS.map(s => ({
      id: s.id, title: s.title, accentColor: s.accentColor, icon: s.icon,
      total: s.cards.reduce((sum, c) => sum + c.calculate(getCardValues(c)), 0)
    })), [globalValues]);

  const totalValue = useMemo(() => sectionResults.reduce((s, r) => s + r.total, 0), [sectionResults]);

  const roi = useMemo(() => {
    if (subCost <= 0) return null;
    return ((totalValue - subCost * 3) / (subCost * 3)) * 100;
  }, [totalValue, subCost]);

  const waterfallData = useMemo(() => {
    let cum = 0;
    const data = sectionResults.map(r => {
      const start = cum; cum += r.total;
      return { name: r.title.split(" ").slice(0,2).join(" "), fullName: r.title, start, value: r.total, color: r.accentColor };
    });
    data.push({ name:"Total", fullName:"Total 3-Year Value", start:0, value: cum, color:"#0f172a" });
    return data;
  }, [sectionResults]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior:"smooth" }); }
    setMobileOpen(false);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin:"-20% 0px -70% 0px" });
    ["summary", ...SECTIONS.map(s => s.id)].forEach(id => {
      const el = document.getElementById(id); if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const guid = new URLSearchParams(window.location.search).get('c');
    if (!guid) return;
    const apply = (config: ClientConfig | null) => {
      if (!config) return;
      setClient(config);
      const c = CURRENCIES.find(x => x.code === config.defaultCurrency);
      if (c) setCurrency(c);
    };
    fetch(`/api/client?c=${guid}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => apply(data ?? getClient(guid)))
      .catch(() => apply(getClient(guid)));
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('s');
    if (!id) return;
    fetch(`/api/load/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.globalValues) setGlobalValues(data.globalValues);
        if (data.currency) {
          const c = CURRENCIES.find(x => x.code === data.currency.code);
          if (c) setCurrency(c);
        }
        if (typeof data.subCost === 'number') setSubCost(data.subCost);
      })
      .catch(console.error);
  }, []);

  const generateBenchmarks = async () => {
    if (!benchmarkUrl.trim()) return;
    setBenchmarkStatus('loading');
    setBenchmarkError('');
    try {
      const res = await fetch('/api/benchmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: benchmarkUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate benchmarks');
      setGlobalValues(data.values);
      setBenchmarkStatus('done');
    } catch (err) {
      setBenchmarkError(err instanceof Error ? err.message : 'Something went wrong');
      setBenchmarkStatus('error');
    }
  };

  const shareScenario = async () => {
    setShareStatus('saving');
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalValues, currency, subCost }),
      });
      if (!res.ok) throw new Error('Save failed');
      const { id } = await res.json();
      await navigator.clipboard.writeText(`${window.location.origin}/s/${id}`);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 3000);
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 3000);
    }
  };

  const sym = currency.symbol;
  const locale = client?.locale ?? 'en-GB';

  const adminKey = new URLSearchParams(window.location.search).get('admin');
  if (adminKey) return <Admin adminKey={adminKey} />;

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"#f8fafc", fontFamily:"system-ui, -apple-system, sans-serif" }}>
      <style>{`
        .card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.06); display:flex; flex-direction:column; }
        .card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.1); transform:translateY(-2px); transition:all 0.2s; }
        .nav-btn { width:100%; display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:8px; border:none; background:none; cursor:pointer; font-size:13px; font-weight:500; text-align:left; transition:all 0.15s; }
        .nav-btn:hover { background:#f8fafc; }
        .nav-btn.active { background:#f1f5f9; font-weight:600; }
        input[type=range]::-webkit-slider-thumb { appearance:none; width:14px; height:14px; background:#fff; border:2px solid; border-radius:50%; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
        .bento:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.1); transition:all 0.2s; cursor:pointer; }
        @media (min-width: 768px) { .layout { flex-direction: row !important; } .sidebar { display:flex !important; } .mobile-header { display:none !important; } }
      `}</style>

      {/* Mobile Header */}
      <div className="mobile-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#fff", borderBottom:"1px solid #e2e8f0", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, background:"#0f172a", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <TrendingUp size={16} color="#fff"/>
          </div>
          <span style={{ fontWeight:800, color:"#0f172a" }}>ROI Engine</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {client?.logoUrl && (
            <img src={client.logoUrl} alt={client.name} style={{ height:24, maxWidth:80, objectFit:"contain" }}/>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
            {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </div>

      <div className="layout" style={{ display:"flex", flexDirection:"column", flex:1 }}>
        {/* Sidebar */}
        <aside className="sidebar" style={{ display: mobileOpen ? "flex" : "none", flexDirection:"column", width:260, minWidth:260, background:"#fff", borderRight:"1px solid #e2e8f0", position:"sticky", top:0, height:"100vh", overflowY:"auto", zIndex:40 }}>
          <div style={{ padding:"24px 20px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: client ? 12 : 28 }}>
              <div style={{ width:32, height:32, background:"#0f172a", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <TrendingUp size={16} color="#fff"/>
              </div>
              <span style={{ fontWeight:800, fontSize:18, color:"#0f172a" }}>ROI Engine</span>
            </div>
            {client && (
              <div style={{ marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f1f5f9" }}>
                <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Prepared for</div>
                {client.logoUrl
                  ? <img src={client.logoUrl} alt={client.name} style={{ height:28, maxWidth:110, objectFit:"contain", objectPosition:"left center" }}/>
                  : <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{client.name}</div>
                }
              </div>
            )}

            <div style={{ fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, paddingLeft:4 }}>Overview</div>
            <button className={`nav-btn ${activeSection==="summary"?"active":""}`} onClick={() => scrollTo("summary")} style={{ color: activeSection==="summary"?"#0f172a":"#64748b", marginBottom:12 }}>
              <LayoutDashboard size={16} color={activeSection==="summary"?"#0f172a":"#94a3b8"}/> ROI Summary
              {activeSection==="summary" && <ChevronRight size={12} color="#94a3b8" style={{ marginLeft:"auto" }}/>}
            </button>

            <div style={{ fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, paddingLeft:4 }}>Areas of Value</div>
            {SECTIONS.map(s => (
              <button key={s.id} className={`nav-btn ${activeSection===s.id?"active":""}`} onClick={() => scrollTo(s.id)} style={{ color: activeSection===s.id?"#0f172a":"#64748b" }}>
                {s.icon} {s.title}
                {activeSection===s.id && <ChevronRight size={12} color="#94a3b8" style={{ marginLeft:"auto" }}/>}
              </button>
            ))}
          </div>

          <div style={{ marginTop:"auto", padding:16, borderTop:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>Currency</div>
            <select value={currency.code} onChange={e => { const c = CURRENCIES.find(x => x.code===e.target.value); if(c) setCurrency(c); }}
              style={{ width:"100%", padding:"8px 10px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, color:"#0f172a", background:"#fff" }}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} - {c.label}</option>)}
            </select>
            <p style={{ fontSize:10, color:"#94a3b8", marginTop:8, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5 }}>Calculations are estimates.</p>
            <button onClick={shareScenario} disabled={shareStatus === 'saving'}
              style={{ marginTop:12, width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"9px 12px", background: shareStatus === 'copied' ? "#059669" : shareStatus === 'error' ? "#f43f5e" : "#0f172a", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor: shareStatus === 'saving' ? "wait" : "pointer", transition:"background 0.2s" }}>
              <Share2 size={14}/>
              {shareStatus === 'saving' ? 'Saving…' : shareStatus === 'copied' ? 'Copied!' : shareStatus === 'error' ? 'Error' : 'Share Scenario'}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex:1, padding:"40px 32px", maxWidth:1100, margin:"0 auto", width:"100%" }}>

          {/* AI Benchmarks Card */}
          <div style={{ marginBottom:24, background:"linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)", border:"1px solid #ddd6fe", borderRadius:12, padding:"20px 24px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:34, height:34, background:"#6366f1", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight:700, color:"#0f172a", fontSize:14, lineHeight:1.2 }}>AI Industry Benchmarks</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Enter your company website and we'll pre-fill every field with realistic industry estimates.</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input
                type="text"
                value={benchmarkUrl}
                onChange={(e: { target: HTMLInputElement }) => { setBenchmarkUrl(e.target.value); if (benchmarkStatus !== 'idle') setBenchmarkStatus('idle'); }}
                onKeyDown={(e: { key: string }) => e.key === 'Enter' && generateBenchmarks()}
                placeholder="e.g. vodafone.com or https://yourcompany.com"
                style={{ flex:1, padding:"9px 12px", border:"1px solid #c4b5fd", borderRadius:8, fontSize:13, color:"#0f172a", background:"#fff", outline:"none" }}
              />
              <button
                onClick={generateBenchmarks}
                disabled={!benchmarkUrl.trim() || benchmarkStatus === 'loading'}
                style={{ padding:"9px 18px", background: benchmarkUrl.trim() && benchmarkStatus !== 'loading' ? "#6366f1" : "#ddd6fe", color: benchmarkUrl.trim() && benchmarkStatus !== 'loading' ? "#fff" : "#a78bfa", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor: benchmarkUrl.trim() && benchmarkStatus !== 'loading' ? "pointer" : "not-allowed", whiteSpace:"nowrap", transition:"background 0.15s" }}
              >
                {benchmarkStatus === 'loading' ? 'Generating…' : 'Add Benchmarks'}
              </button>
            </div>
            {benchmarkStatus === 'error' && (
              <div style={{ marginTop:10, fontSize:12, color:"#dc2626", padding:"7px 10px", background:"#fef2f2", borderRadius:6 }}>{benchmarkError}</div>
            )}
            {benchmarkStatus === 'done' && (
              <div style={{ marginTop:10, fontSize:12, color:"#059669", padding:"7px 10px", background:"#f0fdf4", borderRadius:6 }}>
                ✓ Values pre-filled with industry benchmarks — review and adjust any figure to match your specific situation.
              </div>
            )}
          </div>

          {/* Summary Section */}
          <section id="summary" style={{ marginBottom:80 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:24, marginBottom:32 }}>
              <div style={{ maxWidth:640 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", background:"#f1f5f9", borderRadius:999, fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>
                  <TrendingUp size={12}/> {localise("Value Realisation Report", locale)}
                </div>
                <h1 style={{ fontSize:40, fontWeight:800, color:"#0f172a", lineHeight:1.1, margin:"0 0 12px", letterSpacing:-1 }}>Your value from our partnership.</h1>
                <p style={{ fontSize:17, color:"#475569", lineHeight:1.7, margin:0 }}>Enter your numbers across each area of value below. The estimates are built from your inputs — every figure is traceable to its calculation.</p>
              </div>
              {client?.logoUrl && (
                <img src={client.logoUrl} alt={client.name} style={{ height:48, maxWidth:180, objectFit:"contain", objectPosition:"right center", flexShrink:0, marginTop:4 }}/>
              )}
            </div>

            {/* Top KPI cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:20, marginBottom:24 }}>
              <div className="card" style={{ gridColumn:"span 2" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Total Estimated 3-Year Value</div>
                <div style={{ fontSize:56, fontWeight:800, color:"#0f172a", letterSpacing:-2, lineHeight:1 }}>
                  {sym}{totalValue.toLocaleString("en-US", { maximumFractionDigits:0 })}
                </div>
              </div>
              <div className="card">
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Annual Subscription Cost</div>
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontWeight:700 }}>{sym}</span>
                    <input type="text" value={subCost===0?"0":subCost.toLocaleString("en-US")}
                      onChange={e => { const v = Number(e.target.value.replace(/[^0-9.-]+/g,"")); if (!isNaN(v)) setSubCost(v); }}
                      style={{ width:"100%", paddingLeft:28, paddingRight:12, paddingTop:10, paddingBottom:10, border:"1px solid #e2e8f0", borderRadius:10, fontSize:15, fontWeight:700, color:"#0f172a", boxSizing:"border-box" }}
                    />
                  </div>
                </div>
                <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Estimated ROI</div>
                  {roi !== null ? (
                    <div>
                      <div style={{ fontSize:44, fontWeight:800, color:"#059669", letterSpacing:-1 }}>{roi.toLocaleString("en-US",{maximumFractionDigits:0})}%</div>
                      <div style={{ fontSize:10, fontWeight:700, color:"#10b981", textTransform:"uppercase", letterSpacing:1 }}>Return on Investment</div>
                    </div>
                  ) : (
                    <div style={{ textAlign:"center", padding:"16px 0" }}>
                      <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>Enter a subscription cost above to see your ROI.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Waterfall */}
            <div className="card" style={{ marginBottom:24 }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:"#0f172a", marginBottom:4 }}>{localise("Value Realisation Waterfall", locale)}</h3>
              <p style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>How each area of value contributes to your 3-year total.</p>
              <div style={{ height:360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} margin={{ top:10, right:20, left:20, bottom:50 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:"#64748b", fontSize:9, fontWeight:600 }} dy={10}/>
                    <YAxis axisLine={false} tickLine={false} tick={{ fill:"#64748b", fontSize:10 }} tickFormatter={v => `${sym}${Math.round(v/1000000)}M`}/>
                    <Tooltip cursor={{ fill:"#f8fafc" }} content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0].payload;
                        return <div style={{ background:"#fff", border:"1px solid #e2e8f0", padding:"10px 14px", borderRadius:10, boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}>
                          <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginBottom:4 }}>{d.fullName}</p>
                          <p style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{sym}{d.value.toLocaleString("en-US",{maximumFractionDigits:0})}</p>
                        </div>;
                      }
                    }}/>
                    <Bar dataKey="start" stackId="a" fill="transparent"/>
                    <Bar dataKey="value" stackId="a" radius={[4,4,0,0]}>
                      {waterfallData.map((e,i) => <Cell key={i} fill={e.color}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bento grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:16 }}>
              {sectionResults.map(r => (
                <div key={r.id} className="card bento" onClick={() => scrollTo(r.id)} style={{ padding:20 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ padding:8, background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8 }}>{r.icon}</div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>{sym}{r.total.toLocaleString("en-US",{maximumFractionDigits:0})}</div>
                      <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", textTransform:"uppercase" }}>3-Year</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#0f172a", marginBottom:10 }}>{r.title}</div>
                  <div style={{ height:4, background:"#f1f5f9", borderRadius:999 }}>
                    <div style={{ height:"100%", borderRadius:999, background:r.accentColor, width:`${totalValue > 0 ? Math.max(2,(r.total/totalValue)*100) : 2}%`, transition:"width 0.5s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sections */}
          {SECTIONS.map(section => (
            <section key={section.id} id={section.id} style={{ marginBottom:80, scrollMarginTop:80 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:8 }}>
                {section.icon && <span style={{ fontSize:32 }}>{section.icon}</span>}
                <h2 style={{ fontSize:34, fontWeight:800, color:"#0f172a", letterSpacing:-0.5, margin:0 }}>{section.title}</h2>
              </div>
              <p style={{ fontSize:16, color:"#475569", marginBottom:32, lineHeight:1.7 }}>{localise(section.description, locale)}</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(360px, 1fr))", gap:20 }}>
                {section.cards.map((card, i) => (
                  <ROICard key={i} {...card} accentColor={section.accentColor}
                    values={getCardValues(card)} currencySymbol={sym} locale={locale}
                    onValueChange={(inputId, val) => handleValueChange(card.id, inputId, val)}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Footer CTA */}
          <div style={{ background:"#0f172a", borderRadius:20, padding:"40px 48px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <h2 style={{ fontSize:28, fontWeight:800, color:"#fff", marginBottom:12 }}>{localise("Ready to realise this value?", locale)}</h2>
              <p style={{ color:"#94a3b8", maxWidth:460, lineHeight:1.7, marginBottom:24 }}>Our platform helps {client ? client.name : "enterprise teams"} capture the 3-year value estimated above — typically within 30 days of going live.</p>
              <a href="https://cxconnect.ai" target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-block", padding:"12px 24px", background:"#fff", color:"#0f172a", fontWeight:700, borderRadius:10, textDecoration:"none", fontSize:14 }}>
                Get in touch
              </a>
            </div>
            <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, background:"rgba(99,102,241,0.1)", borderRadius:"50%", filter:"blur(40px)" }}/>
            <div style={{ position:"absolute", bottom:-40, left:-40, width:200, height:200, background:"rgba(16,185,129,0.1)", borderRadius:"50%", filter:"blur(40px)" }}/>
          </div>
        </main>
      </div>
    </div>
  );
}
