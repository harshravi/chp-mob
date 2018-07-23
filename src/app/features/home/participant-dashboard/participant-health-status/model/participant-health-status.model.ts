    // Interface for Activity properties
    export interface IActivity {
        calories: string;
        distance: string;
        distance_unit: string;
        duration: string;
        duration_unit: string;
        reported_by: string;
        source: string;
        steps: number;
        timestamp: number;
        type: string;
        vitalType: string;
        vital_desc: string;
    }
    // Interface for Blood properties
    export interface IBloodProp {
        is_assessment_triggered: number;
        is_editable: number;
        reported_by: string;
        source: string;
        time: number;
        unit: string;
        value: string;
        value_ext: string;
        vitalType: string;
        vital_desc: string;
        vital_id: number;
        vital_status: number;
    }
    // Interface for Fluid properties
    export interface IFluidProp {
        data_type: string;
        fluid_intake_quantity: string;
        fluid_type: string;
        is_editable: number;
        participantId: number;
        source: string;
        unit: string;
        value_ltr: string;
        vitalType: string;
        vital_desc: string;
        vital_status: number;
    }
    // Interface for BMI properties
    export interface IWbmbi {
        bmi: number;
        height: number;
        height_feet: number;
        height_inches: number;
        height_unit: string;
        is_assessment_triggered: number;
        is_editable: number;
        participant_id: string;
        reported_by: string;
        source: string;
        time: number;
        vitalType:string;
        vital_desc: string;
        vital_status: number;
        weight: number;
        weight_unit: string;
        whbmi_id: number;
    }
    // Interface for Carousel and Graph properties
    export interface ICarouselData {
        activity?: IActivity;
        blood_glucose: IBloodProp;
        blood_oxygen: IBloodProp;
        blood_pressure: IBloodProp;
        fluid_intake: IFluidProp;
        heart_rate: IBloodProp;
        peak_expiratory_flow: IBloodProp;
        wbmbi: IWbmbi;
    }
    export interface IDateDropdown{
        filterBy: string;
        id: string;
    }

    export interface IFevFvcDropdown{
        filterBy: string;
        id: string;
    }    

