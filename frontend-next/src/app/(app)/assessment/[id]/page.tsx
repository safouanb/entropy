import { AssessmentResultsView } from "@/components/assessment/results-view";

export default function AssessmentResultPage({ params }: { params: { id: string } }) {
    return <AssessmentResultsView id={params.id} />;
}
