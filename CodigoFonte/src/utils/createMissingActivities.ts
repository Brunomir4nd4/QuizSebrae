import { ActivityStatus } from "@/types/IParticipants";

interface ExistingActivity {
    id: string;
    activity_id: string;
    status: ActivityStatus;
}

const existingActivityIds = (existingActivities: ExistingActivity[]) => {
    return new Set(existingActivities.map((a) => Number(a.activity_id)));
};

export const missingActivities = (
    totalActivities: number,
    existingActivities: ExistingActivity[]
) => {
    const existingIdsSet = existingActivityIds(existingActivities);

    return Array.from({ length: totalActivities }, (_, i) => i + 1)
        .filter((id) => !existingIdsSet.has(id))
        .map((missingId) => ({
            id: undefined, // sem ID real do backend
            activity_id: String(missingId),
            status: 'não recebida' as ActivityStatus,
        }));
};