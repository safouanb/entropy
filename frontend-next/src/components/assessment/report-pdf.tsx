import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#1F2937',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    docType: {
        fontSize: 10,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: '#F3F4F6',
        padding: 6,
        marginBottom: 8,
        color: '#374151',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: '40%',
        fontSize: 9,
        color: '#6B7280',
    },
    value: {
        width: '60%',
        fontSize: 9,
        fontWeight: 'medium',
        color: '#1F2937',
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#E5E7EB',
        marginTop: 10,
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableColHeader: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        padding: 5,
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#E5E7EB',
        padding: 5,
    },
    tableCellHeader: {
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 8,
        textAlign: 'center',
    },
    complianceBox: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#059669',
        backgroundColor: '#ECFDF5',
        padding: 12,
        borderRadius: 4,
    },
    complianceTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#065F46',
        marginBottom: 4,
    },
    complianceText: {
        fontSize: 10,
        color: '#047857',
        lineHeight: 1.4,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        color: '#9CA3AF',
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
    },
});

interface AssessmentData {
    id: number;
    project_name: string;
    thermal_load_min_kw: number;
    thermal_load_max_kw: number;
    distance_to_offtaker_km: number;
    jurisdiction: string;
    applicable_regulation: string;
    status: string;
    scenario_results?: string; // JSON string
    compliance_result?: string; // JSON string
    created_at: string;
}

interface ScenarioResult {
    ownershipModel: string;
    capexMinEur: number;
    capexMaxEur: number;
    paybackMinYears: number;
    paybackMaxYears: number;
    co2AvoidedMinKgYear: number;
    co2AvoidedMaxKgYear: number;
    irrMinPercent: number;
    irrMaxPercent: number;
}

interface ComplianceResult {
    status: string;
    reasoning: string[];
}

export const AssessmentReportDocument = ({ data }: { data: AssessmentData }) => {
    // Parse JSON fields
    const scenarios: ScenarioResult[] = data.scenario_results
        ? JSON.parse(data.scenario_results)
        : [];

    const compliance: ComplianceResult = data.compliance_result
        ? JSON.parse(data.compliance_result)
        : { status: 'UNKNOWN', reasoning: [] };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Feasibility Assessment Record</Text>
                    <Text style={styles.docType}>ENTROPY-V1-REC-{data.id}</Text>
                </View>

                {/* Section 1: Project Overview */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Project Parameters</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Project Name:</Text>
                        <Text style={styles.value}>{data.project_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Jurisdiction:</Text>
                        <Text style={styles.value}>{data.jurisdiction} ({data.applicable_regulation})</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Thermal Load:</Text>
                        <Text style={styles.value}>{data.thermal_load_min_kw} - {data.thermal_load_max_kw} kW</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Distance to Off-taker:</Text>
                        <Text style={styles.value}>{data.distance_to_offtaker_km} km</Text>
                    </View>
                </View>

                {/* Section 2: Scenario Comparison */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Ownership Scenarios & Financial Bounds</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Metric</Text></View>
                            {scenarios.map((s, i) => (
                                <View key={i} style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>{s.ownershipModel.replace(/_/g, ' ')}</Text>
                                </View>
                            ))}
                        </View>
                        {/* CAPEX Row */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Est. CAPEX (€)</Text></View>
                            {scenarios.map((s, i) => (
                                <View key={i} style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {(s.capexMinEur / 1000).toFixed(0)}k - {(s.capexMaxEur / 1000).toFixed(0)}k
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {/* Payback Row */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Payback (Yrs)</Text></View>
                            {scenarios.map((s, i) => (
                                <View key={i} style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {s.paybackMinYears.toFixed(1)} - {s.paybackMaxYears.toFixed(1)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {/* CO2 Row */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>CO2 Avoided (t/y)</Text></View>
                            {scenarios.map((s, i) => (
                                <View key={i} style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {(s.co2AvoidedMinKgYear / 1000).toFixed(0)} - {(s.co2AvoidedMaxKgYear / 1000).toFixed(0)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Section 3: Compliance Conclusion */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Regulatory Compliance & Justification</Text>
                    <View style={styles.complianceBox}>
                        <Text style={styles.complianceTitle}>
                            DETERMINATION: {compliance.status}
                        </Text>
                        <Text style={styles.complianceText}>
                            {compliance.reasoning && compliance.reasoning.length > 0
                                ? compliance.reasoning.join('\n')
                                : "No specific reasoning provided."}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Generated via Entropy Feasibility Engine • Assessment ID: {data.id} • Date: {new Date(data.created_at).toLocaleDateString()}
                </Text>
            </Page>
        </Document>
    );
};
