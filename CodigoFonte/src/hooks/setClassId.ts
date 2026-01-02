import { ClassResponse } from "@/types/IClass";

export const setClassIdOnLocalStorage = (classesData: ClassResponse['data'], setClassId: React.Dispatch<React.SetStateAction<string | null>>) => {
    const storage_class_id = localStorage.getItem("class_id");

    if(storage_class_id){
        return setClassId(storage_class_id);
    }
    
    const storage_course_id = localStorage.getItem("course_id");

    if (storage_course_id) {

        const class_ids = classesData.filter((classData) => classData.courses.id.toString() == storage_course_id);

        const lastClassId = Math.max(...class_ids.map(Number));

        return setClassId(`${lastClassId}`);

    }

    return null
    
};

