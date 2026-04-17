import { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, ShieldCheck, Award, UserMinus, Users,
  TrendingUp, Search, Headphones, Monitor, ChevronRight,
  Menu, X, FileDown, Share2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const CURRENCIES = [
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
];

function ROICard({ id, title, problem, solution, inputs, calculate, icon, accentColor, values, onValueChange, currencySymbol }) {
  const result = useMemo(() => calculate(values), [values, calculate]);
  const fmt = (v) => v.toLocaleString("en-US");
  const parse = (s) => Number(s.replace(/[^0-9.-]+/g, ""));
  const progress = (inp, val) => ((val - inp.min) / (inp.max - inp.min)) * 100;

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
          <span style={{ fontSize:11, fontWeight:800, color:"#334155", textTransform:"uppercase", letterSpacing:0.5 }}>Problem</span>
          <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:"4px 0 0" }}>{problem}</p>
        </div>
        <div>
          <span style={{ fontSize:11, fontWeight:800, color:"#334155", textTransform:"uppercase", letterSpacing:0.5 }}>Our Solution</span>
          <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:"4px 0 0" }}>{solution}</p>
        </div>
      </div>
      <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:16 }}>
        {inputs.map(inp => (
          <div key={inp.id} style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{inp.label}</label>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <input
                  type="text"
                  value={fmt(values[inp.id] ?? inp.defaultValue)}
                  onChange={e => { const n = parse(e.target.value); if (!isNaN(n)) onValueChange(inp.id, n); }}
                  style={{ width:88, padding:"4px 8px", textAlign:"right", fontSize:13, fontWeight:700, color:"#0f172a", border:"1px solid #cbd5e1", borderRadius:6, outline:"none" }}
                />
                <span style={{ fontSize:12, color:"#64748b", minWidth:20 }}>{inp.unit === "$" ? currencySymbol : inp.unit}</span>
              </div>
            </div>
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
    </div>
  );
}

const SECTIONS = [
  {
    id:"product-feedback", title:"Product Feedback", description:"Accelerate your roadmap by identifying high-impact features faster.",
    icon:<LayoutDashboard size={18} color="#6366f1"/>, accentColor:"#6366f1",
    cards:[
      { id:"roadmap-prioritization", title:"Roadmap Prioritization",
        problem:"Product teams spend 20 hours/month manually tagging feedback.",
        solution:"Automated tagging from The Answer Layer reduces manual effort by 90%.",
        icon:<LayoutDashboard size={20} color="#6366f1"/>,
        inputs:[
          { id:"pmCount", label:"Number of Product Managers", min:1, max:100, step:1, unit:"", defaultValue:5 },
          { id:"hourlyRate", label:"Product Manager Annual Loaded Cost", min:50000, max:500000, step:5000, unit:"$", defaultValue:200000 }
        ],
        calculate:v => ((v.pmCount||5)*20*0.9*((v.hourlyRate||200000)/2000)*12)*3
      },
      { id:"customer-centric-building", title:"Value of Building what your customers want",
        problem:"Roadmap waste: 25% of features built are rarely used due to poor signal-to-noise in feedback.",
        solution:"Sentiment and request clustering from The Answer Layer ensures 40% better roadmap alignment.",
        icon:<LayoutDashboard size={20} color="#6366f1"/>,
        inputs:[
          { id:"devTeamSize", label:"Dev Team Size", min:5, max:500, step:5, unit:"", defaultValue:50 },
          { id:"avgDevSalary", label:"Avg Dev Annual Loaded Cost", min:80000, max:250000, step:5000, unit:"$", defaultValue:120000 },
          { id:"alignmentImprovement", label:"Alignment Improvement", min:5, max:50, step:5, unit:"%", defaultValue:20 }
        ],
        calculate:v => ((v.devTeamSize||50)*(v.avgDevSalary||120000)*0.25*((v.alignmentImprovement||20)/100))*3
      }
    ]
  },
  {
    id:"compliance", title:"Compliance", description:"Mitigate risk and automate regulatory monitoring.",
    icon:<ShieldCheck size={18} color="#10b981"/>, accentColor:"#10b981",
    cards:[
      { id:"regulatory-fine-avoidance", title:"Regulatory Fine Avoidance",
        problem:"Customer conversations often contain regulated statements (GDPR, financial disclosures, etc.). Detecting issues early reduces the likelihood of regulatory penalties.",
        solution:"Our compliance engine, powered by The Answer Layer, detects regulated statements in real-time, allowing for immediate intervention and reducing the probability of costly incidents.",
        icon:<ShieldCheck size={20} color="#10b981"/>,
        inputs:[
          { id:"regulatedInteractions", label:"Regulated Interactions / Year", min:100000, max:500000000, step:100000, unit:"", defaultValue:100000000 },
          { id:"incidentProb", label:"Incident Probability", min:0.0001, max:0.1, step:0.0001, unit:"%", defaultValue:0.005 },
          { id:"avgFine", label:"Avg. Fine Exposure", min:100, max:10000000, step:100, unit:"€", defaultValue:1000 },
          { id:"riskReduction", label:"Risk Reduction with The Answer Layer", min:5, max:50, step:5, unit:"%", defaultValue:10 }
        ],
        calculate:v => ((v.regulatedInteractions||100000000)*((v.incidentProb||0.005)/100)*(v.avgFine||1000)*((v.riskReduction||10)/100))*3
      },
      { id:"reduced-compliance-review-labor", title:"Reduced Compliance Review Labor",
        problem:"Compliance teams manually audit customer interactions to ensure regulatory adherence, which is slow and expensive.",
        solution:"Analysis from The Answer Layer dramatically reduces the amount of human review required by pre-screening and prioritizing interactions.",
        icon:<ShieldCheck size={20} color="#10b981"/>,
        inputs:[
          { id:"interactionsAudited", label:"Interactions Audited / Year", min:10000, max:5000000, step:10000, unit:"", defaultValue:250000 },
          { id:"reviewTime", label:"Avg. Review Time", min:1, max:60, step:1, unit:"min", defaultValue:8 },
          { id:"analystCost", label:"Analyst Annual Loaded Cost", min:40000, max:400000, step:5000, unit:"$", defaultValue:120000 },
          { id:"reviewReduction", label:"Manual Review Reduction", min:5, max:90, step:5, unit:"%", defaultValue:40 }
        ],
        calculate:v => ((v.interactionsAudited||250000)*((v.reviewTime||8)/60)*((v.analystCost||120000)/2000)*((v.reviewReduction||40)/100))*3
      }
    ]
  },
  {
    id:"brand", title:"Brand", description:"Protect your reputation and track sentiment across all channels.",
    icon:<Award size={18} color="#f59e0b"/>, accentColor:"#f59e0b",
    cards:[
      { id:"reduced-public-complaints", title:"Reduced Public Complaints / Social Escalations",
        problem:"Negative customer experiences that escalate to public channels (social media, regulatory complaints, press coverage) damage brand perception.",
        solution:"Detecting systemic issues earlier reduces these incidents and the associated reputational risk.",
        icon:<Award size={20} color="#f59e0b"/>,
        inputs:[
          { id:"complaintCount", label:"Public complaints or social escalations annually", min:1000, max:1000000, step:1000, unit:"", defaultValue:10000 },
          { id:"costPerComplaint", label:"Estimated cost per incident", min:10, max:5000, step:10, unit:"€", defaultValue:220 },
          { id:"reduction", label:"Reduction from real-time flagging and escalation", min:5, max:50, step:5, unit:"%", defaultValue:20 }
        ],
        calculate:v => ((v.complaintCount||10000)*(v.costPerComplaint||220)*((v.reduction||20)/100))*3
      },
      { id:"avoided-brand-damage", title:"Avoided Brand Damage from Large-Scale Customer Issues",
        problem:"When systemic issues go unnoticed, they can trigger large-scale reputation damage (media coverage, regulatory attention, customer backlash).",
        solution:"Early detection prevents these events from escalating into high-impact brand crises.",
        icon:<Award size={20} color="#f59e0b"/>,
        inputs:[
          { id:"incidentCount", label:"Potential brand-impacting incidents per year", min:1, max:100, step:1, unit:"", defaultValue:8 },
          { id:"costPerIncident", label:"Estimated cost per incident", min:10000, max:10000000, step:10000, unit:"€", defaultValue:600000 },
          { id:"preventionRate", label:"% prevented through earlier detection", min:5, max:80, step:5, unit:"%", defaultValue:30 }
        ],
        calculate:v => ((v.incidentCount||8)*(v.costPerIncident||600000)*((v.preventionRate||30)/100))*3
      },
      { id:"nps-improvement-roi", title:"NPS Improvement",
        problem:"Unresolved systemic customer experience issues suppress Net Promoter Scores, leading to stagnant customer advocacy and significant missed referral revenue.",
        solution:"The Answer Layer identifies the root causes of systemic customer friction across all channels, providing actionable insights to resolve issues before they impact brand perception.",
        icon:<Award size={20} color="#f59e0b"/>,
        inputs:[
          { id:"totalCustomerBase", label:"Total customer base", min:1000000, max:100000000, step:1000000, unit:"", defaultValue:10000000 },
          { id:"npsImprovement", label:"NPS improvement from improved experience", min:0.5, max:10, step:0.5, unit:"", defaultValue:1 },
          { id:"referralRatePerPoint", label:"% additional referral rate per NPS point", min:0.01, max:2, step:0.01, unit:"%", defaultValue:0.01 },
          { id:"avgNewCustomerValue", label:"Average value of a new customer", min:50, max:2000, step:50, unit:"€", defaultValue:350 }
        ],
        calculate:v => ((v.totalCustomerBase||10000000)*((v.npsImprovement||1)*((v.referralRatePerPoint||0.01)/100))*(v.avgNewCustomerValue||350))*3
      }
    ]
  },
  {
    id:"churn-risk", title:"Churn Risk", description:"Identify at-risk customers before they leave.",
    icon:<UserMinus size={18} color="#f43f5e"/>, accentColor:"#f43f5e",
    cards:[
      { id:"prevented-customer-churn", title:"Prevented Customer Churn",
        problem:"Early detection of dissatisfaction signals allows for intervention before customers cancel service.",
        solution:"The Answer Layer identifies at-risk customers early, enabling proactive saving of individuals and signal for new programs targeted at saving larger groups.",
        icon:<UserMinus size={20} color="#f43f5e"/>,
        inputs:[
          { id:"customersAtRisk", label:"Customers at Churn Risk", min:10000, max:2000000, step:10000, unit:"", defaultValue:150000 },
          { id:"successRate", label:"Intervention Success Rate", min:1, max:50, step:1, unit:"%", defaultValue:12 },
          { id:"clv", label:"Customer Lifetime Value", min:100, max:2000, step:50, unit:"$", defaultValue:450 }
        ],
        calculate:v => ((v.customersAtRisk||150000)*((v.successRate||12)/100)*(v.clv||450))*3
      },
      { id:"reduced-reactive-retention-incentives", title:"Reduced Reactive Retention Incentives",
        problem:"Without early detection, providers must offer expensive discounts or credits to retain customers who threaten to leave.",
        solution:"Early intervention reduces the need for aggressive retention offers, lowering standard operating expenses.",
        icon:<UserMinus size={20} color="#f43f5e"/>,
        inputs:[
          { id:"customersSaved", label:"Customers Saved Proactively", min:1000, max:500000, step:1000, unit:"", defaultValue:10000 },
          { id:"avgIncentive", label:"Avg. Retention Incentive", min:10, max:500, step:10, unit:"$", defaultValue:80 }
        ],
        calculate:v => ((v.customersSaved||10000)*(v.avgIncentive||80))*3
      }
    ]
  },
  {
    id:"competitive-intelligence", title:"Competitive Intelligence", description:"Stay ahead by monitoring competitor strengths, weaknesses, and market shifts.",
    icon:<Users size={18} color="#3b82f6"/>, accentColor:"#3b82f6",
    cards:[
      { id:"competitive-win-rate-improvement", title:"Competitive Win Rate Improvement",
        problem:"Sales teams often lose deals because they lack real-time visibility into competitor strengths and specific objections raised by prospects.",
        solution:"Competitive intelligence from The Answer Layer provides sales teams with the data they need to win more head-to-head deals.",
        icon:<Users size={20} color="#3b82f6"/>,
        inputs:[
          { id:"competitiveOpps", label:"Competitive sales opportunities", min:10000, max:1000000, step:10000, unit:"", defaultValue:400000 },
          { id:"winRateInc", label:"Win-rate improvement", min:0.1, max:5, step:0.1, unit:"%", defaultValue:1 },
          { id:"avgAnnualValue", label:"Avg. annual contract value", min:50, max:2000, step:50, unit:"$", defaultValue:320 }
        ],
        calculate:v => ((v.competitiveOpps||400000)*((v.winRateInc||1)/100)*(v.avgAnnualValue||320))*3
      },
      { id:"faster-competitive-offer-response", title:"Faster Competitive Offer Response",
        problem:"When rivals launch aggressive new offers, slow internal response times lead to immediate market share erosion and customer churn.",
        solution:"Real-time market monitoring ensures you can respond to competitive threats before they impact market share.",
        icon:<Users size={20} color="#3b82f6"/>,
        inputs:[
          { id:"targetedCustomers", label:"Customers targeted by competitors", min:10000, max:1000000, step:10000, unit:"", defaultValue:200000 },
          { id:"arpu", label:"Avg. revenue per customer", min:100, max:2000, step:50, unit:"$", defaultValue:420 },
          { id:"churnAvoidedComp", label:"Churn avoided via fast response", min:0.5, max:10, step:0.5, unit:"%", defaultValue:3 }
        ],
        calculate:v => ((v.targetedCustomers||200000)*(v.arpu||420)*((v.churnAvoidedComp||3)/100))*3
      }
    ]
  },
  {
    id:"revenue-growth", title:"Revenue Growth", description:"Unlock expansion opportunities in your existing base.",
    icon:<TrendingUp size={18} color="#8b5cf6"/>, accentColor:"#8b5cf6",
    cards:[
      { id:"upsell-cross-sell-conversion", title:"Upsell & Cross-Sell Conversion Improvement",
        problem:"Massive amounts of expansion revenue are left on the table because high-intent signals buried in customer conversations are never identified or acted upon.",
        solution:"Insights from The Answer Layer identify high-intent customers, allowing for targeted upsell campaigns that drive incremental revenue.",
        icon:<TrendingUp size={20} color="#8b5cf6"/>,
        inputs:[
          { id:"eligibleCustomers", label:"Customers eligible for upsell", min:100000, max:10000000, step:100000, unit:"", defaultValue:3000000 },
          { id:"conversionImprovement", label:"Conversion rate improvement", min:0.1, max:10, step:0.1, unit:"%", defaultValue:1.5 },
          { id:"avgUpsellValue", label:"Average upsell value", min:10, max:500, step:5, unit:"$", defaultValue:90 }
        ],
        calculate:v => ((v.eligibleCustomers||3000000)*((v.conversionImprovement||1.5)/100)*(v.avgUpsellValue||90))*3
      },
      { id:"sales-channel-conversion", title:"Conversion Rate Improvement in Sales Channels",
        problem:"Sales conversion rates suffer when messaging and offers are based on guesswork rather than the actual pain points expressed by customers.",
        solution:"Optimized sales messaging and offer targeting based on real customer feedback lead to higher conversion rates.",
        icon:<TrendingUp size={20} color="#8b5cf6"/>,
        inputs:[
          { id:"salesLeads", label:"Number of sales leads", min:100000, max:5000000, step:100000, unit:"", defaultValue:2000000 },
          { id:"salesConversionImprovement", label:"Conversion improvement", min:0.1, max:5, step:0.1, unit:"%", defaultValue:0.5 },
          { id:"avgCustomerValue", label:"Avg. value of new customer", min:50, max:2000, step:50, unit:"$", defaultValue:400 }
        ],
        calculate:v => ((v.salesLeads||2000000)*((v.salesConversionImprovement||0.5)/100)*(v.avgCustomerValue||400))*3
      }
    ]
  },
  {
    id:"marketing-insights", title:"Marketing Insights", description:"Optimize marketing performance with deeper customer understanding.",
    icon:<Search size={18} color="#06b6d4"/>, accentColor:"#06b6d4",
    cards:[
      { id:"marketing-spend-efficiency", title:"Marketing Spend Efficiency Improvement",
        problem:"Marketing budgets are wasted on broad campaigns that fail to resonate because teams lack granular data on which messages actually drive customer interest.",
        solution:"The result is higher conversion rates from the same marketing spend, maximizing the ROI of every marketing euro.",
        icon:<Search size={20} color="#06b6d4"/>,
        inputs:[
          { id:"annualMarketingSpend", label:"Annual marketing campaign spend", min:10000000, max:1000000000, step:10000000, unit:"€", defaultValue:50000000 },
          { id:"conversionEfficiencyLift", label:"% improvement in campaign conversion efficiency", min:0.5, max:20, step:0.5, unit:"%", defaultValue:4 }
        ],
        calculate:v => ((v.annualMarketingSpend||50000000)*((v.conversionEfficiencyLift||4)/100))*3
      },
      { id:"reduced-cac", title:"Reduced Customer Acquisition Cost (CAC)",
        problem:"High customer acquisition costs persist when marketing spend is allocated to low-performing channels due to a lack of deep insight into the customer journey.",
        solution:"Improved targeting and channel optimization lead to significant acquisition efficiency gains.",
        icon:<Search size={20} color="#06b6d4"/>,
        inputs:[
          { id:"annualAcquired", label:"Customers acquired annually", min:100000, max:5000000, step:100000, unit:"", defaultValue:1500000 },
          { id:"avgCac", label:"Average CAC", min:10, max:500, step:10, unit:"$", defaultValue:120 },
          { id:"cacReduction", label:"CAC reduction from targeting", min:0.5, max:10, step:0.5, unit:"%", defaultValue:1 }
        ],
        calculate:v => ((v.annualAcquired||1500000)*(v.avgCac||120)*((v.cacReduction||1)/100))*3
      }
    ]
  },
  {
    id:"care-operations", title:"Care Operations", description:"Empower your support team with coaching powered by The Answer Layer.",
    icon:<Headphones size={18} color="#f97316"/>, accentColor:"#f97316",
    cards:[
      { id:"aht-reduction", title:"Reduced wrap-up time",
        problem:"Human agents despise clicking drop-down menus in antiquated UIs, and they're not very good at it. We're all skeptical of that data, which often isn't up to date.",
        solution:"We remove wrap-up time, and provide deeper insights into every interaction.",
        icon:<Headphones size={20} color="#f97316"/>,
        inputs:[
          { id:"agentCount", label:"Number of Agents", min:10, max:1000, step:10, unit:"", defaultValue:50 },
          { id:"callsPerDay", label:"Conversations per Agent/Day", min:5, max:100, step:5, unit:"", defaultValue:40 },
          { id:"wrapUpTimeSaved", label:"Wrap-up time saved per call", min:0.5, max:10, step:0.5, unit:"min", defaultValue:2 },
          { id:"agentAnnualCost", label:"Agent Annual Loaded Cost", min:5000, max:150000, step:1000, unit:"€", defaultValue:15000 }
        ],
        calculate:v => ((v.wrapUpTimeSaved||2)*(v.agentCount||50)*(v.callsPerDay||40)*250*((v.agentAnnualCost||15000)/120000))*3
      },
      { id:"personalized-coaching", title:"Personalized Coaching",
        problem:"Support agents often struggle with inconsistent performance and slow resolution times because they lack real-time, personalized guidance on how to handle complex customer interactions.",
        solution:"Coaching from The Answer Layer helps agents resolve issues more effectively during the first interaction.",
        icon:<Headphones size={20} color="#f97316"/>,
        inputs:[
          { id:"agents", label:"Number of Agents", min:100, max:20000, step:100, unit:"", defaultValue:8000 },
          { id:"avgSalary", label:"Average Annual Loaded Cost", min:5000, max:100000, step:1000, unit:"$", defaultValue:15000 },
          { id:"prodImprovement", label:"Productivity improvement", min:0.1, max:10, step:0.1, unit:"%", defaultValue:0.1 }
        ],
        calculate:v => ((v.agents||8000)*(v.avgSalary||15000)*((v.prodImprovement||0.1)/100))*3
      },
      { id:"reduced-agent-churn", title:"Reduced Agent Churn",
        problem:"High agent turnover is often driven by job frustration, lack of support, and the stress of handling difficult customer issues without adequate tools or visibility.",
        solution:"Lower attrition means fewer hiring cycles and lower training costs, powered by reduced wrap-up time and an improved agent experience from The Answer Layer.",
        icon:<Users size={20} color="#f97316"/>,
        inputs:[
          { id:"totalAgentsChurn", label:"Total number of support agents", min:100, max:50000, step:100, unit:"", defaultValue:8000 },
          { id:"attritionReduction", label:"Reduction in attrition rate", min:0.5, max:20, step:0.5, unit:"%", defaultValue:4 },
          { id:"hiringCost", label:"Cost to hire & train per agent", min:1000, max:50000, step:500, unit:"€", defaultValue:1000 }
        ],
        calculate:v => ((v.totalAgentsChurn||8000)*((v.attritionReduction||4)/100)*(v.hiringCost||1000))*3
      }
    ]
  },
  {
    id:"strategic-decision-velocity", title:"Strategic Decision Velocity", description:"Accelerate decision-making and eliminate administrative friction.",
    icon:<Monitor size={18} color="#ec4899"/>, accentColor:"#ec4899",
    cards:[
      { id:"analysis-productivity-gain", title:"Analysis Productivity Gain",
        problem:"Teams spend significant time compiling reports, exporting data, and preparing presentations.",
        solution:"Automating insight generation and auto-exporting to PowerPoint reduces the manual analysis burden.",
        icon:<Monitor size={20} color="#ec4899"/>,
        inputs:[
          { id:"analystCount", label:"Number of analysts/managers", min:10, max:2000, step:10, unit:"", defaultValue:200 },
          { id:"hoursSaved", label:"Hours saved per month", min:1, max:40, step:1, unit:"hr", defaultValue:6 },
          { id:"hourlyCost", label:"Average Annual Loaded Cost", min:60000, max:400000, step:5000, unit:"€", defaultValue:130000 }
        ],
        calculate:v => ((v.analystCount||200)*(v.hoursSaved||6)*12*((v.hourlyCost||130000)/2000))*3
      },
      { id:"faster-decision-making", title:"Faster Decision Making",
        problem:"Senior leaders spend significant time waiting for reports and reviewing presentations, delaying strategic actions.",
        solution:"Self-service insights from The Answer Layer provide immediate access to customer data, accelerating product, campaign, and care updates.",
        icon:<Monitor size={20} color="#ec4899"/>,
        inputs:[
          { id:"decisionCount", label:"Strategic decisions annually", min:10, max:500, step:10, unit:"", defaultValue:80 },
          { id:"decisionValue", label:"Estimated value per decision", min:1000, max:1000000, step:1000, unit:"€", defaultValue:100000 },
          { id:"accelerationFactor", label:"Acceleration factor", min:1, max:50, step:1, unit:"%", defaultValue:10 }
        ],
        calculate:v => ((v.decisionCount||80)*(v.decisionValue||100000)*((v.accelerationFactor||10)/100))*3
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
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
          {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      <div className="layout" style={{ display:"flex", flexDirection:"column", flex:1 }}>
        {/* Sidebar */}
        <aside className="sidebar" style={{ display: mobileOpen ? "flex" : "none", flexDirection:"column", width:260, minWidth:260, background:"#fff", borderRight:"1px solid #e2e8f0", position:"sticky", top:0, height:"100vh", overflowY:"auto", zIndex:40 }}>
          <div style={{ padding:"24px 20px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
              <div style={{ width:32, height:32, background:"#0f172a", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <TrendingUp size={16} color="#fff"/>
              </div>
              <span style={{ fontWeight:800, fontSize:18, color:"#0f172a" }}>ROI Engine</span>
            </div>

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

          {/* Summary Section */}
          <section id="summary" style={{ marginBottom:80 }}>
            <div style={{ marginBottom:32 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", background:"#f1f5f9", borderRadius:999, fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>
                <TrendingUp size={12}/> Value Realization Report
              </div>
              <h1 style={{ fontSize:40, fontWeight:800, color:"#0f172a", lineHeight:1.1, margin:"0 0 12px", letterSpacing:-1 }}>Your value from our partnership.</h1>
              <p style={{ fontSize:17, color:"#475569", lineHeight:1.7, maxWidth:640, margin:0 }}>Based on your current inputs, here is the estimated 3-year impact our platform can deliver across your organization.</p>
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
                      <div style={{ fontSize:24, marginBottom:6 }}>✨ 🦄 ✨</div>
                      <p style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1 }}>Enter a subscription cost above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Waterfall */}
            <div className="card" style={{ marginBottom:24 }}>
              <h3 style={{ fontSize:18, fontWeight:700, color:"#0f172a", marginBottom:4 }}>Value Realization Waterfall</h3>
              <p style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>How each strategic area contributes to your 3-year total.</p>
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
                    <div style={{ height:"100%", borderRadius:999, background:r.accentColor, width:`${Math.max(2,(r.total/totalValue)*100)}%`, transition:"width 0.5s" }}/>
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
              <p style={{ fontSize:16, color:"#475569", marginBottom:32, lineHeight:1.7 }}>{section.description}</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(360px, 1fr))", gap:20 }}>
                {section.cards.map((card, i) => (
                  <ROICard key={i} {...card} accentColor={section.accentColor}
                    values={getCardValues(card)} currencySymbol={sym}
                    onValueChange={(inputId, val) => handleValueChange(card.id, inputId, val)}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Footer CTA */}
          <div style={{ background:"#0f172a", borderRadius:20, padding:"40px 48px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <h2 style={{ fontSize:28, fontWeight:800, color:"#fff", marginBottom:12 }}>Ready to realize this value?</h2>
              <p style={{ color:"#94a3b8", maxWidth:460, lineHeight:1.7, marginBottom:24 }}>Our platform helps enterprise teams automate these workflows and capture the 3-year value estimated above in as little as 30 days.</p>
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