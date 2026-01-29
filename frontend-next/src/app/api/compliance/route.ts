
import { NextResponse } from 'next/server';

const regulations = [
    {
        id: "EED-14",
        regulation: "EED Art. 14 Assessment",
        description: "Cost-Benefit Analysis for waste heat recovery",
        status: "COMPLIANT",
        lastChecked: "2024-03-15T10:00:00Z",
        metric: "15.2 MW (Threshold: >2.5MW)",
        nextAction: "Annual Review in Q1 2025"
    },
    {
        id: "WPG-ZONE",
        regulation: "Heating Planning Act (WPG)",
        description: "District heating connection priority zone check",
        status: "WARNING",
        lastChecked: "2024-03-14T15:30:00Z",
        metric: "Zone 4-A (Priority)",
        nextAction: "Submit Connection Plan by Q3"
    },
    {
        id: "GEG-71",
        regulation: "GEG § 71",
        description: "Renewable energy share requirements for new systems",
        status: "NON_COMPLIANT",
        lastChecked: "2024-03-16T09:15:00Z",
        metric: "45% RE (Target: 65%)",
        nextAction: "Retrofit Plan Required Immediate"
    },
    {
        id: "EU-TAX",
        regulation: "EU Taxonomy Reg. 2020/852",
        description: "Substantial Contribution & DNSH Criteria",
        status: "COMPLIANT",
        lastChecked: "2024-03-16T11:00:00Z",
        metric: "Aligned",
        nextAction: "Sustainability Report Integration"
    },
    {
        id: "CSRD-E1",
        regulation: "CSRD / ESRS E1",
        description: "Climate change mitigation reporting",
        status: "PENDING",
        lastChecked: "2024-03-01T08:00:00Z",
        metric: "-570 tCO2e (Est.)",
        nextAction: "Data Verification"
    },
    {
        id: "BIMSCHG",
        regulation: "BImSchG Permit",
        description: "Federal Immission Control Act compliance",
        status: "WARNING",
        lastChecked: "2024-02-28T14:20:00Z",
        metric: "Noise Level Variance",
        nextAction: "Acoustic Survey Required"
    }
];

const auditLogs = [
    { id: "log-1", timestamp: "2024-03-16T11:00:00Z", event: "Taxonomy Check", user: "system", status: "SUCCESS", detail: "Validated DNSH criteria for Water Protection." },
    { id: "log-2", timestamp: "2024-03-16T09:15:00Z", event: "GEG Threshold Alert", user: "system", status: "FAILURE", detail: "Renewable share calculated at 45%, below 65% mandatory target." },
    { id: "log-3", timestamp: "2024-03-15T10:00:00Z", event: "CBA Simulation", user: "admin", status: "SUCCESS", detail: "EED Art. 14 assessment completed. NPV positive." },
    { id: "log-4", timestamp: "2024-03-14T15:30:00Z", event: "Zone Lookup", user: "system", status: "INFO", detail: "Property identified in Fernwärme Vorranggebiet Zone 4-A." },
    { id: "log-5", timestamp: "2024-03-10T08:45:00Z", event: "Data Ingestion", user: "field_agent_1", status: "SUCCESS", detail: "Uploaded Q1 consumption data for Plant B." },
];

export async function GET() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 450));
    return NextResponse.json({ regulations, auditLogs });
}
