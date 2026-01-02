import { ClassResponse } from "@/types/IClass";

/**
 * Gets an object containing day name, day number, and formatted time from a date string.
 * @param dateString - The input date string in the format 'yyyy-MM-dd'.
 * @returns An object with dayName, dayNumber, and hour properties.
 */
export const remapClassesData = (classData: ClassResponse['data']) => {
    let data: { [key: number]: ClassResponse['data'][0] } = {}
    let firstClassId: number | null = null
    classData.forEach((_class, index) => {
        if(index == 0){
            firstClassId = _class.id
        }
        data[_class.id] = _class
    })

    return { data, firstClassId };
};

