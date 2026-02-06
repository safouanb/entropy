import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Entropy Brand Colors
const colors = {
    primary: '#0F172A',     // Deep navy
    secondary: '#1E293B',
    accent: '#3B82F6',      // Blue accent
    success: '#3B82F6',     // Green (Now Blue for consistency)
    warning: '#D97706',     // Amber
    danger: '#DC2626',      // Red
    muted: '#6B7280',
    border: '#E5E7EB',
    bgLight: '#F9FAFB',
    bgSuccess: '#EFF6FF',
    bgWarning: '#FEF3C7',
    bgDanger: '#FEF2F2',
};

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        color: colors.primary,
    },
    // Header
    header: {
        marginBottom: 24,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 10,
        color: colors.muted,
        marginTop: 4,
    },
    docId: {
        fontSize: 9,
        color: colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        marginRight: 20,
    },
    metaLabel: {
        fontSize: 8,
        color: colors.muted,
        marginRight: 4,
    },
    metaValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: colors.primary,
    },
    // Sections
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: colors.bgLight,
        padding: 6,
        marginBottom: 8,
        color: colors.secondary,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
    },
    // Key-Value Rows
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    label: {
        width: '35%',
        fontSize: 8,
        color: colors.muted,
    },
    value: {
        width: '65%',
        fontSize: 8,
        color: colors.primary,
    },
    // Tables
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tableRowLast: {
        flexDirection: 'row',
    },
    tableColHeader: {
        flex: 1,
        backgroundColor: colors.bgLight,
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    tableCol: {
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: colors.border,
    },
    tableColLast: {
        flex: 1,
        padding: 5,
    },
    tableCellHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.secondary,
    },
    tableCell: {
        fontSize: 7,
        textAlign: 'center',
        color: colors.primary,
    },
    // Scenario Cards
    scenarioCard: {
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
    },
    scenarioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    scenarioTitle: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    scenarioBadge: {
        fontSize: 7,
        fontWeight: 'bold',
        padding: 3,
        borderRadius: 2,
    },
    scenarioContent: {
        fontSize: 8,
        color: colors.muted,
        marginBottom: 4,
    },
    scenarioMetrics: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    scenarioMetric: {
        width: '50%',
        marginBottom: 4,
    },
    // Verdict Box
    verdictBox: {
        marginTop: 10,
        padding: 12,
        borderRadius: 4,
        borderWidth: 2,
    },
    verdictTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    verdictText: {
        fontSize: 9,
        lineHeight: 1.4,
    },
    // Risk Table
    riskRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 4,
    },
    riskCategory: {
        width: '30%',
        fontSize: 7,
        fontWeight: 'bold',
    },
    riskParty: {
        width: '25%',
        fontSize: 7,
    },
    riskMitigation: {
        width: '25%',
        fontSize: 7,
    },
    riskNotes: {
        width: '20%',
        fontSize: 6,
        color: colors.muted,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
    },
    footerText: {
        fontSize: 7,
        color: colors.muted,
        textAlign: 'center',
    },
    footerBold: {
        fontSize: 7,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginTop: 2,
    },
});

// New interfaces matching backend types
interface ReuseScenario {
    reuseScenario: 'NO_REUSE' | 'DIRECT_REUSE' | 'REUSE_WITH_MITIGATION';
    ownershipModel: string;
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'CONDITIONAL';
    complianceReason: string;
    failureMode: string;
    riskOwner: string;
    capexMinEur: number;
    capexMaxEur: number;
    opexMinEurYear: number;
    opexMaxEurYear: number;
    paybackMinYears: number;
    paybackMaxYears: number;
    irrMinPercent: number;
    irrMaxPercent: number;
    co2AvoidedMinKgYear: number;
    co2AvoidedMaxKgYear: number;
    regulatoryExposure?: string;
    mitigationType?: string;
}

interface RiskAllocation {
    category: string;
    severity: string;
    bearingParty: string;
    mitigationMechanism: string;
    notes: string;
}

interface ComplianceResult {
    status: string;
    applicableLaw: string;
    reasoning: string[];
    remediationSteps?: string[];
    citations?: { law: string; section: string; summary: string; url: string }[];
    disclaimer?: string;
}

interface AssessmentData {
    id: number;
    project_name: string;
    thermal_load_min_kw: number;
    thermal_load_max_kw: number;
    distance_to_offtaker_km: number;
    jurisdiction: string;
    applicable_regulation: string;
    time_horizon_years: number;
    supply_temp_required_c: number;
    availability_profile: string;
    status: string;
    scenario_results?: string;
    compliance_result?: string;
    risk_allocation_json?: string;
    confidence_level?: string;
    conclusion?: string;
    created_at: string;
    version?: number;
}

// Helper functions
const formatCurrency = (min: number, max: number): string => {
    if (min === 0 && max === 0) return '€0';
    const minK = (min / 1000).toFixed(0);
    const maxK = (max / 1000).toFixed(0);
    return `€${minK}k - €${maxK}k`;
};

const formatYears = (min: number, max: number): string => {
    if (min === 0 && max === 0) return 'N/A';
    return `${min.toFixed(1)} - ${max.toFixed(1)} yrs`;
};

const formatCO2 = (min: number, max: number): string => {
    const minT = (min / 1000).toFixed(0);
    const maxT = (max / 1000).toFixed(0);
    if (Number(minT) < 0) return `${minT} - ${maxT} t/yr (emissions)`;
    return `${minT} - ${maxT} t/yr avoided`;
};

const getScenarioLabel = (scenario: string): string => {
    switch (scenario) {
        case 'NO_REUSE': return 'A: No Heat Reuse';
        case 'DIRECT_REUSE': return 'B: Direct Reuse';
        case 'REUSE_WITH_MITIGATION': return 'C: Reuse + Mitigation';
        default: return scenario;
    }
};

const getComplianceColor = (status: string) => {
    switch (status) {
        case 'COMPLIANT': return { bg: colors.bgSuccess, border: colors.success, text: colors.success };
        case 'CONDITIONAL': return { bg: colors.bgWarning, border: colors.warning, text: colors.warning };
        case 'NON_COMPLIANT': return { bg: colors.bgDanger, border: colors.danger, text: colors.danger };
        default: return { bg: colors.bgLight, border: colors.border, text: colors.muted };
    }
};

const getConfidenceLabel = (level: string | undefined): string => {
    switch (level) {
        case 'HIGH': return 'HIGH — Tight assumption ranges, robust data';
        case 'LOW': return 'LOW — Wide assumption variance, limited data';
        default: return 'MEDIUM — Standard assumption quality';
    }
};

const getRiskCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
        'SUPPLY_VARIABILITY': 'Supply Variability',
        'DEMAND_VARIABILITY': 'Demand Variability',
        'LIFETIME_MISMATCH': 'Lifetime Mismatch',
        'PERFORMANCE_DEGRADATION': 'Performance Risk',
        'REGULATORY_CHANGE': 'Regulatory Change',
    };
    return labels[category] || category;
};

export const DecisionRecordDocument = ({ data }: { data: AssessmentData }) => {
    // Parse JSON fields
    const scenarios: ReuseScenario[] = data.scenario_results
        ? JSON.parse(data.scenario_results)
        : [];

    const compliance: ComplianceResult = data.compliance_result
        ? JSON.parse(data.compliance_result)
        : { status: 'UNKNOWN', applicableLaw: 'Unknown', reasoning: [] };

    const riskAllocations: RiskAllocation[] = data.risk_allocation_json
        ? JSON.parse(data.risk_allocation_json)
        : [];

    // Determine overall verdict
    const compliantScenarios = scenarios.filter(s => s.complianceStatus === 'COMPLIANT');
    const overallVerdict = compliantScenarios.length > 0 ? 'COMPLIANT' : 'NON_COMPLIANT';
    const verdictColors = getComplianceColor(overallVerdict);

    return (
        <Document>
            {/* Page 1: Header, Context, Regulatory Framework, Assumptions */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.title}>Heat Reuse Decision & Compliance Record</Text>
                            <Text style={styles.subtitle}>This is not a pitch. This is the product.</Text>
                        </View>
                        <Text style={styles.docId}>ENTROPY-REC-{data.id}</Text>
                    </View>
                    <View style={styles.headerMeta}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Project:</Text>
                            <Text style={styles.metaValue}>{data.project_name}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Jurisdiction:</Text>
                            <Text style={styles.metaValue}>{data.jurisdiction}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Version:</Text>
                            <Text style={styles.metaValue}>{data.version || 1}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Date:</Text>
                            <Text style={styles.metaValue}>{new Date(data.created_at).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Prepared by:</Text>
                            <Text style={styles.metaValue}>Entropy</Text>
                        </View>
                    </View>
                </View>

                {/* Section 1: Project Context */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Project Context</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Thermal Load (Range):</Text>
                        <Text style={styles.value}>{data.thermal_load_min_kw} - {data.thermal_load_max_kw} kW</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Distance to Offtaker:</Text>
                        <Text style={styles.value}>{data.distance_to_offtaker_km} km</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Supply Temp Required:</Text>
                        <Text style={styles.value}>{data.supply_temp_required_c}°C</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Availability Profile:</Text>
                        <Text style={styles.value}>{data.availability_profile === 'base' ? 'Baseload (24/7)' : 'Peak/Intermittent'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Time Horizon:</Text>
                        <Text style={styles.value}>{data.time_horizon_years} years</Text>
                    </View>
                </View>

                {/* Section 2: Regulatory Framework */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Regulatory Framework</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Applicable Regulation:</Text>
                        <Text style={styles.value}>{compliance.applicableLaw || data.applicable_regulation}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Compliance Status:</Text>
                        <Text style={styles.value}>{compliance.status}</Text>
                    </View>
                    {compliance.reasoning && compliance.reasoning.length > 0 && (
                        <View style={{ marginTop: 6 }}>
                            <Text style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 4 }}>Regulatory Context:</Text>
                            {compliance.reasoning.map((r, i) => (
                                <Text key={i} style={{ fontSize: 7, color: colors.muted, marginBottom: 2 }}>• {r}</Text>
                            ))}
                        </View>
                    )}
                </View>

                {/* Section 3: Core Assumptions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Core Assumptions (Ranged)</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Parameter</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Min</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Max</Text></View>
                            <View style={[styles.tableColHeader, { borderRightWidth: 0 }]}><Text style={styles.tableCellHeader}>Unit</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Thermal Output</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{data.thermal_load_min_kw}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{data.thermal_load_max_kw}</Text></View>
                            <View style={styles.tableColLast}><Text style={styles.tableCell}>kW</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Distance</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{data.distance_to_offtaker_km}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{data.distance_to_offtaker_km}</Text></View>
                            <View style={styles.tableColLast}><Text style={styles.tableCell}>km</Text></View>
                        </View>
                        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Project Lifetime</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{data.time_horizon_years}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{data.time_horizon_years}</Text></View>
                            <View style={styles.tableColLast}><Text style={styles.tableCell}>years</Text></View>
                        </View>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 8, color: colors.muted }}>
                            Confidence Level: {getConfidenceLabel(data.confidence_level)}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Generated via Entropy Decision Engine • Record ID: ENTROPY-REC-{data.id}
                    </Text>
                    <Text style={styles.footerBold}>
                        Entropy determines what is defensible, not what must be built.
                    </Text>
                </View>
            </Page>

            {/* Page 2: Scenarios Evaluated */}
            <Page size="A4" style={styles.page}>
                <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>4. Scenarios Evaluated</Text>

                {scenarios.map((scenario, index) => {
                    const statusColors = getComplianceColor(scenario.complianceStatus);
                    return (
                        <View
                            key={index}
                            style={[
                                styles.scenarioCard,
                                {
                                    borderColor: statusColors.border,
                                    backgroundColor: statusColors.bg,
                                }
                            ]}
                        >
                            <View style={styles.scenarioHeader}>
                                <Text style={[styles.scenarioTitle, { color: statusColors.text }]}>
                                    {getScenarioLabel(scenario.reuseScenario)}
                                </Text>
                                <Text style={[
                                    styles.scenarioBadge,
                                    { backgroundColor: statusColors.border, color: '#FFFFFF' }
                                ]}>
                                    {scenario.complianceStatus}
                                </Text>
                            </View>

                            <Text style={styles.scenarioContent}>
                                {scenario.complianceReason}
                            </Text>

                            {scenario.failureMode && (
                                <Text style={{ fontSize: 7, color: colors.danger, marginBottom: 4 }}>
                                    ⚠ Failure Mode: {scenario.failureMode}
                                </Text>
                            )}

                            {scenario.reuseScenario !== 'NO_REUSE' && (
                                <View style={styles.scenarioMetrics}>
                                    <View style={styles.scenarioMetric}>
                                        <Text style={styles.label}>CAPEX:</Text>
                                        <Text style={{ fontSize: 8 }}>{formatCurrency(scenario.capexMinEur, scenario.capexMaxEur)}</Text>
                                    </View>
                                    <View style={styles.scenarioMetric}>
                                        <Text style={styles.label}>OPEX:</Text>
                                        <Text style={{ fontSize: 8 }}>{formatCurrency(scenario.opexMinEurYear, scenario.opexMaxEurYear)}/yr</Text>
                                    </View>
                                    <View style={styles.scenarioMetric}>
                                        <Text style={styles.label}>Payback:</Text>
                                        <Text style={{ fontSize: 8 }}>{formatYears(scenario.paybackMinYears, scenario.paybackMaxYears)}</Text>
                                    </View>
                                    <View style={styles.scenarioMetric}>
                                        <Text style={styles.label}>CO2 Impact:</Text>
                                        <Text style={{ fontSize: 8 }}>{formatCO2(scenario.co2AvoidedMinKgYear, scenario.co2AvoidedMaxKgYear)}</Text>
                                    </View>
                                </View>
                            )}

                            {scenario.reuseScenario === 'NO_REUSE' && scenario.regulatoryExposure && (
                                <Text style={{ fontSize: 7, color: colors.danger, marginTop: 4 }}>
                                    {scenario.regulatoryExposure}
                                </Text>
                            )}
                        </View>
                    );
                })}

                {/* Economic Boundaries Summary */}
                <View style={[styles.section, { marginTop: 16 }]}>
                    <Text style={styles.sectionTitle}>5. Economic Boundaries</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Scenario</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>CAPEX</Text></View>
                            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Payback</Text></View>
                            <View style={[styles.tableColHeader, { borderRightWidth: 0 }]}><Text style={styles.tableCellHeader}>IRR</Text></View>
                        </View>
                        {scenarios.filter(s => s.reuseScenario !== 'NO_REUSE').map((s, i) => (
                            <View key={i} style={styles.tableRow}>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{getScenarioLabel(s.reuseScenario)}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(s.capexMinEur, s.capexMaxEur)}</Text></View>
                                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatYears(s.paybackMinYears, s.paybackMaxYears)}</Text></View>
                                <View style={styles.tableColLast}><Text style={styles.tableCell}>{s.irrMinPercent.toFixed(1)}% - {s.irrMaxPercent.toFixed(1)}%</Text></View>
                            </View>
                        ))}
                    </View>
                    <Text style={{ fontSize: 7, color: colors.muted, marginTop: 6, fontStyle: 'italic' }}>
                        Entropy presents bounds, not promises.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Page 2 of 3 • ENTROPY-REC-{data.id}</Text>
                </View>
            </Page>

            {/* Page 3: Risk Allocation, Verdict, Decision Summary */}
            <Page size="A4" style={styles.page}>
                {/* Section 6: Risk & Responsibility */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Risk & Responsibility Allocation</Text>
                    {riskAllocations.length > 0 ? (
                        <>
                            <View style={[styles.riskRow, { backgroundColor: colors.bgLight, fontWeight: 'bold' }]}>
                                <Text style={[styles.riskCategory, { fontWeight: 'bold' }]}>Risk Category</Text>
                                <Text style={[styles.riskParty, { fontWeight: 'bold' }]}>Bearing Party</Text>
                                <Text style={[styles.riskMitigation, { fontWeight: 'bold' }]}>Mitigation</Text>
                                <Text style={[styles.riskNotes, { fontWeight: 'bold' }]}>Notes</Text>
                            </View>
                            {riskAllocations.map((risk, i) => (
                                <View key={i} style={styles.riskRow}>
                                    <Text style={styles.riskCategory}>{getRiskCategoryLabel(risk.category)}</Text>
                                    <Text style={styles.riskParty}>{risk.bearingParty.replace(/_/g, ' ')}</Text>
                                    <Text style={styles.riskMitigation}>{risk.mitigationMechanism.replace(/_/g, ' ')}</Text>
                                    <Text style={styles.riskNotes}>{risk.notes}</Text>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={{ fontSize: 8, color: colors.muted }}>
                            Risk allocation will be determined based on selected implementation pathway.
                        </Text>
                    )}
                </View>

                {/* Section 7: Compliance Verdict */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Compliance Determination</Text>
                    <View style={[
                        styles.verdictBox,
                        {
                            borderColor: verdictColors.border,
                            backgroundColor: verdictColors.bg,
                        }
                    ]}>
                        <Text style={[styles.verdictTitle, { color: verdictColors.text }]}>
                            VERDICT: {overallVerdict}
                        </Text>
                        <Text style={[styles.verdictText, { color: verdictColors.text }]}>
                            {compliantScenarios.length > 0
                                ? `Compliance achievable via: ${compliantScenarios.map(s => getScenarioLabel(s.reuseScenario)).join(', ')}`
                                : 'No viable path to compliance under current assumptions. Review feasibility or seek exemption.'}
                        </Text>
                        {data.confidence_level && (
                            <Text style={{ fontSize: 8, marginTop: 6, color: colors.muted }}>
                                Confidence: {data.confidence_level}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Section 8: Decision Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Decision Summary</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '40%' }]}><Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'left' }]}>Compliant Scenarios</Text></View>
                            <View style={[styles.tableColLast, { width: '60%' }]}><Text style={[styles.tableCell, { textAlign: 'left' }]}>
                                {compliantScenarios.map(s => getScenarioLabel(s.reuseScenario)).join(', ') || 'None'}
                            </Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '40%' }]}><Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'left' }]}>Non-Compliant Scenarios</Text></View>
                            <View style={[styles.tableColLast, { width: '60%' }]}><Text style={[styles.tableCell, { textAlign: 'left' }]}>
                                {scenarios.filter(s => s.complianceStatus === 'NON_COMPLIANT').map(s => getScenarioLabel(s.reuseScenario)).join(', ') || 'None'}
                            </Text></View>
                        </View>
                        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                            <View style={[styles.tableCol, { width: '40%' }]}><Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'left' }]}>Recommended Path</Text></View>
                            <View style={[styles.tableColLast, { width: '60%' }]}><Text style={[styles.tableCell, { textAlign: 'left' }]}>
                                {compliantScenarios.length > 0 ? getScenarioLabel(compliantScenarios[compliantScenarios.length - 1].reuseScenario) : 'Seek exemption or reassess assumptions'}
                            </Text></View>
                        </View>
                    </View>
                </View>

                {/* Section 9: Accountability Statement */}
                <View style={[styles.section, { marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 }]}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: colors.primary, marginBottom: 6 }}>
                        Entropy Accountability Statement
                    </Text>
                    <Text style={{ fontSize: 8, color: colors.muted, lineHeight: 1.5 }}>
                        Entropy determines what is defensible, not what must be built. This record represents our assessment
                        of compliance pathways based on the assumptions provided. Entropy stands behind this assessment
                        and takes responsibility for the decision layer between policy intent and infrastructure execution.
                    </Text>
                    <Text style={{ fontSize: 8, color: colors.muted, lineHeight: 1.5, marginTop: 8 }}>
                        We don't just model scenarios — we stand behind one.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Page 3 of 3 • ENTROPY-REC-{data.id} • {new Date(data.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={styles.footerBold}>
                        This record is designed to be regulator-referenceable.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

// Keep old component for backwards compatibility
export const AssessmentReportDocument = DecisionRecordDocument;
