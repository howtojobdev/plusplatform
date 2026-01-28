export enum WEEKDAY_ENUM {
    MON = "mon",
    TUE = "tue",
    WED = "wed",
    THU = "thu",
    FRI = "fri",
    SAT = "sat",
    SUN = "sun",
};

export type WeekdayKeyModel = `${WEEKDAY_ENUM}`;

export type WeekContentItemModel = {
    type: string;
    id: string;
};

export type WeekExpectationItemModel = {
    ques: string;
    ans: string;
};

export type WeekDayPlanModel = {
    content: WeekContentItemModel[];
    expectations: WeekExpectationItemModel[];
    feedback: string;
};

export type WeekDaysModel = Record<WeekdayKeyModel, WeekDayPlanModel | null>;

export type WeekPlanModel = {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    title?: string;
    description?: string;
    settings?: Record<string, any>;
    days: WeekDaysModel;
};