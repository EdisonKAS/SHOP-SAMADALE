// form.ts
// Type definitions for form-related data

export interface FormField {
    name: string;
    value: string;
    type: "text" | "number" | "checkbox" | "radio" | "select";
    required?: boolean;
}

export interface FormSubmission {
    fields: FormField[];
    submittedAt: Date;
    isValid: boolean;
}

export interface FormConfig {
    title: string;
    action: string;
    method: "POST" | "GET";
    fields: FormField[];
}