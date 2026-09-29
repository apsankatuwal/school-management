import Teacher from "../models/teacher.js";
import Subject from "../models/subject.js";
import ClassModel from "../models/class.js";

export const getTeacherScope = async (userId) => {
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) return null;

    const subjects = await Subject.find({ teacher: teacher._id });
    const subjectIds = subjects.map((s) => s._id);
    const subjectClassIds = subjects.map((s) => s.class).filter(Boolean);

    const homeroomClasses = await ClassModel.find({ classTeacher: teacher._id });
    const homeroomClassIds = homeroomClasses.map((c) => c._id);

    const classIdSet = new Set(
        [...subjectClassIds, ...homeroomClassIds].map((id) => id.toString())
    );

    return {
        teacher,
        subjectIds,
        subjectIdSet: new Set(subjectIds.map((id) => id.toString())),
        classIds: [...classIdSet],
    };
};