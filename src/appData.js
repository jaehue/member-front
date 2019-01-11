const appData = {
    teachers: []
};

export const setTeachers = (teachers) => appData.teachers = teachers
export const getTeacherById = (teacherId) => appData.teachers.find(t => t.id == teacherId)
export const setToken = (token) => sessionStorage.setItem('token', token)
export const getToken = _ => sessionStorage.getItem('token')