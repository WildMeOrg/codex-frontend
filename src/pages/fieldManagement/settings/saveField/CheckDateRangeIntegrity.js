
export default function CheckDateRangeIntegrity(customFields) {
    const regex = /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
    for(const value of Object.values(customFields)) {
        if(Array.isArray(value) && value.length === 2) {
            const noStartDate = !regex.test(JSON.stringify(value[0])) && regex.test(JSON.stringify(value[1]));
            const noEndDate = regex.test(JSON.stringify(value[0])) && !regex.test(JSON.stringify(value[1]));
            if( noStartDate || noEndDate) {
                return true;;
                } 
            }
        }
    return false;
}