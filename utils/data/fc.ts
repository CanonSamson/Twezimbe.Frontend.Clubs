export type FcTypeTypes = | "critically-ill" | "dead" | "missing" | "disabled" | "hospitalized" | "in-recovery";

export const FcType: FcTypeTypes[] = [ "critically-ill" , "dead",  "missing",  "disabled" , "hospitalized" , "in-recovery" ]

export const fcMethodOptions = [ { value: "critically-ill", label: "Critically Ill" },
    { value: "dead", label: "Dead" }, { value: "missing", label: "Missing" }, { value: "disabled", label: "Disabled" }, { value: "hospitalized", label: "Hospitalized" }, { value: "in-recovery", label: "In Recovery" },
]