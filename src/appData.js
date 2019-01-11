const appData = {
    teachers: []
};

export const setTeachers = (teachers) => appData.teachers = teachers
export const getTeacherById = (teacherId) => appData.teachers.find(t => t.id == teacherId)
export const setToken = (token) => localStorage.setItem('token', token)
export const getToken = _ => localStorage.getItem('token')