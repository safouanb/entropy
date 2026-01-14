import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 5,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        backgroundColor: '#F3F4F6',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 2,
    },
    label: {
        fontSize: 10,
        color: '#4B5563',
    },
    value: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
    },
    disclaimer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        fontSize: 8,
        color: '#9CA3AF',
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
    },
    complianceBox: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
        padding: 10,
        borderRadius: 4,
    },
    complianceText: {
        fontSize: 10,
        color: '#065F46',
        textAlign: 'center',
    }
});

// Create Document Component
export const CBAReportDocument = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Cost-Benefit Analysis Report</Text>
                <Text style={styles.subtitle}>Reference: {data.scenarioName} | Date: {new Date().toLocaleDateString()}</Text>
            </View>

            {/* Project Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Project Parameters (Supply & Demand)</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Data Center ID</Text>
                    <Text style={styles.value}>{data.dataCenterId}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Heat Sink ID</Text>
                    <Text style={styles.value}>{data.heatSinkIds?.[0]}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Analysis Standard</Text>
                    <Text style={styles.value}>DIN EN 17463 (Valuation of Energy Related Investments)</Text>
                </View>
            </View>

            {/* Financial KPIs */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Economic Feasibility Results</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Net Present Value (NPV)</Text>
                    <Text style={styles.value}>€ {data.predictionResult?.netPresentValue?.toLocaleString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Internal Rate of Return (IRR)</Text>
                    <Text style={styles.value}>{data.predictionResult?.internalRateReturn?.toFixed(2)} %</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Payback Period</Text>
                    <Text style={styles.value}>{data.predictionResult?.paybackPeriodYears?.toFixed(1)} Years</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Total CAPEX</Text>
                    <Text style={styles.value}>€ {data.predictionResult?.totalCapex?.toLocaleString()}</Text>
                </View>
            </View>

            {/* Environmental Impact */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. Environmental Impact</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Annual CO2 Reduction</Text>
                    <Text style={styles.value}>{data.predictionResult?.annualCo2ReductionKg?.toLocaleString()} kg</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Recovered Heat Energy</Text>
                    <Text style={styles.value}>{data.predictionResult?.annualHeatRecoveryKwh?.toLocaleString()} kWh/yr</Text>
                </View>
            </View>

            {/* Compliance Statment */}
            <View style={styles.complianceBox}>
                <Text style={styles.complianceText}>
                    This report is generated in accordance with the requirements of the German Energy Efficiency Act (EnEfG) and EU EED directives for waste heat utilization analysis.
                </Text>
            </View>

            <Text style={styles.disclaimer}>
                Generated by PyRecycleHeat. This document is for informational purposes only and does not constitute guaranteed financial advice.
            </Text>
        </Page>
    </Document>
);
