

export interface IPickadayOption {
    field: any;
    format: string;
    minDate: Date;
    onSelect: (date: string) => void;
    onClose: (date: string) => void;
}