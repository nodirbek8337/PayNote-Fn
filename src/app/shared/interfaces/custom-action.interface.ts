export interface ICustomAction {
    icon: string;
    tooltip?: string;
    color?: string;
    disabled?: boolean;
    TooltipTitle?: string;
    action: (row: any) => void;
}
