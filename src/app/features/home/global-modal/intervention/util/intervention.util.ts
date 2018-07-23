export class InterventionUtil {
    /** Get Broder color based on event status */
    static getBroderColor(id: number) {
        switch (id) {
            case 0: return 'border-normal';
            case 1: return 'border-alert';
            case 2: return 'border-danger';
        }
    }
}
