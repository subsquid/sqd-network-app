export type GroupSize = {
    label: string;
    days: number;
    ms: number;
    unit: 'hour' | 'day' | 'week' | 'month';
};
export declare function getGroupSize(step: string | {
    from: Date;
    to: Date;
    maxPoints?: number;
}): GroupSize;
//# sourceMappingURL=groupSize.d.ts.map