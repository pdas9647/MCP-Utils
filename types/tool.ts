export interface ToolParameter {
    name: string;
    techDescription: string;
    userFriendlyDescription: string;
    optional: boolean;
    parameters?: {
        name: string;
        techDescription: string;
        userFriendlyDescription: string;
        optional: boolean;
        parameters?: {
            name: string;
            techDescription: string;
            userFriendlyDescription: string;
            optional: boolean;
            parameters?: {
                name: string;
                techDescription: string;
                userFriendlyDescription: string;
                optional: boolean;
                parameters?: {
                    name: string;
                    techDescription: string;
                    userFriendlyDescription: string;
                    optional: boolean;
                }[];
            }[];
        }[];
    }[];
}

export interface Tool {
    name: string;
    category: string;
    techDescription: string;
    userFriendlyDescription: string;
    parameters: ToolParameter[];
}

export type ToolsMap = Record<string, Tool>;
