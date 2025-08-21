import { GroupTypeTypes } from "@/types/groups"

export const GroupType: GroupTypeTypes[] = ["Education", "Social", "Professional", "Healthcare", "Others"]

export const groupTypeOptions = [{
    value: "education",
    label: "Education"
},
{
    value: "social",
    label: "Social"
},
{
    value: "professional",
    label: "Professional"
},
{
    value: "healthcare",
    label: "Healthcare"
},
{
    value: "others",
    label: "Others"
},
]


export const groupPrivacy = ["PRIVATE", "PUBLIC"]

export const groupPrivacyOptions = [{
    value: "PRIVATE",
    label: "Private"
},
{
    value: "PUBLIC",
    label: "Public"
}
]

export const currencyOptions = [
    {
        value: "UGX",
        label: "UGX"
    },
    {
        value: "KES",
        label: "KES"
    },
    {
        value: "USD",
        label: "USD"
    },
    {
        value: "RWF",
        label: "RWF"
    },
    {
        value: "TZS",
        label: "TZS"
    },
    {
        value: "EUR",
        label: "EUR"
    }
]