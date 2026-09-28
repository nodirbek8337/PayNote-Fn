export interface ICustomAction {
    icon: string;
    tooltip?: string;
    color?: string;
    disabled?: boolean | ((row: any) => boolean);
    hidden?: boolean | ((row: any) => boolean);
    TooltipTitle?: string;
    action: (row: any) => void;
}
